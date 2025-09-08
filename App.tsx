
import React, { useState } from 'react';
import { ImageFile } from './types';
import { editImageWithGemini } from './services/geminiService';
import { applyImageAdjustments } from './services/imageService';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import ImageDisplay from './components/ImageDisplay';
import Controls from './components/Controls';
import Loader from './components/Loader';
import ErrorMessage from './components/ErrorMessage';
import Footer from './components/Footer';
import ThumbnailGallery from './components/ThumbnailGallery';

const App: React.FC = () => {
    const [originalImages, setOriginalImages] = useState<ImageFile[]>([]);
    const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
    const [editedImages, setEditedImages] = useState<Record<number, string>>({});
    const [bgRemovedImages, setBgRemovedImages] = useState<Record<number, string>>({});
    const [prompt, setPrompt] = useState<string>('');
    const [maintainConsistency, setMaintainConsistency] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isRemovingBg, setIsRemovingBg] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [brightness, setBrightness] = useState<number>(100);
    const [contrast, setContrast] = useState<number>(100);

    const handleImageUpload = (files: File[]) => {
        const readers = files.map(file => {
            return new Promise<ImageFile>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    if (typeof reader.result === 'string') {
                        resolve({ file, base64: reader.result });
                    } else {
                        reject(new Error("Failed to read file as data URL."));
                    }
                };
                reader.onerror = (error) => reject(error);
                reader.readAsDataURL(file);
            });
        });

        Promise.all(readers)
            .then(newImages => {
                setOriginalImages(newImages);
                setActiveImageIndex(newImages.length > 0 ? 0 : null);
                setEditedImages({});
                setBgRemovedImages({});
                setError(null);
                setPrompt('');
                setBrightness(100);
                setContrast(100);
            })
            .catch(err => {
                console.error(err);
                setError("Failed to read one or more image files.");
            });
    };

    const handleSelectImage = (index: number) => {
        setActiveImageIndex(index);
    };
    
    const activeImage = activeImageIndex !== null ? originalImages[activeImageIndex] : null;
    const activeEditedImage = activeImageIndex !== null ? editedImages[activeImageIndex] : null;
    const activeBgRemovedImage = activeImageIndex !== null ? bgRemovedImages[activeImageIndex] : null;

    const handleRemoveBackground = async () => {
        if (!activeImage || activeImageIndex === null) {
            setError("Please select an image first.");
            return;
        }

        setIsRemovingBg(true);
        setError(null);
        setBgRemovedImages(prev => {
            const newState = { ...prev };
            delete newState[activeImageIndex];
            return newState;
        });

        const bgRemovePrompt = "Isolate the main subject and remove the background, making it transparent. The output must be a PNG with a transparent background.";

        try {
            let base64ToProcess = activeImage.base64;
            let mimeTypeForApi = activeImage.file.type;

            if (brightness !== 100 || contrast !== 100) {
                base64ToProcess = await applyImageAdjustments(
                    activeImage.base64,
                    brightness,
                    contrast
                );
                mimeTypeForApi = 'image/png';
            }
            
            const base64Data = base64ToProcess.split(',')[1];
            if (!base64Data) {
                throw new Error("Invalid image data format.");
            }
            
            const result = await editImageWithGemini(base64Data, mimeTypeForApi, bgRemovePrompt);

            if (result.image) {
                setBgRemovedImages(prev => ({ ...prev, [activeImageIndex]: `data:image/png;base64,${result.image}` }));
            } else {
                setError(result.text || "The model did not return an image for background removal. It might have refused the request.");
            }

        } catch (e: any) {
            console.error(e);
            setError(`An error occurred during background removal: ${e.message || 'Please check the console for details.'}`);
        } finally {
            setIsRemovingBg(false);
        }
    };

    const handleGenerate = async () => {
        if (!activeImage || activeImageIndex === null) {
            setError("Please select an image first.");
            return;
        }
        if (!prompt.trim()) {
            setError("Please enter a prompt to describe the edit.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setEditedImages(prev => {
            const newState = { ...prev };
            delete newState[activeImageIndex];
            return newState;
        });

        const finalPrompt = maintainConsistency
            ? `CRITICAL INSTRUCTION: Edit the image based on the following request. It is absolutely essential that you DO NOT change the person's face or identity. Preserve the facial features and unique characteristics of the subject perfectly. Now, here is the request: ${prompt}`
            : prompt;
        
        try {
             let base64ToProcess = activeImage.base64;
             let mimeTypeForApi = activeImage.file.type;

             if (brightness !== 100 || contrast !== 100) {
                 base64ToProcess = await applyImageAdjustments(
                     activeImage.base64,
                     brightness,
                     contrast
                 );
                 mimeTypeForApi = 'image/png';
             }

            const base64Data = base64ToProcess.split(',')[1];
            if (!base64Data) {
                throw new Error("Invalid image data format.");
            }

            const result = await editImageWithGemini(base64Data, mimeTypeForApi, finalPrompt);
            
            if (result.image) {
                setEditedImages(prev => ({ ...prev, [activeImageIndex]: `data:${result.mimeType || 'image/png'};base64,${result.image}` }));
            } else {
                 setError(result.text || "The model did not return an image. It might have refused the request. Please try a different prompt.");
            }

        } catch (e: any) {
            console.error(e);
            setError(`An error occurred: ${e.message || 'Please check the console for details.'}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col">
            <Loader isLoading={isLoading || isRemovingBg} />
            <Header />
            <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8 flex flex-col lg:flex-row gap-8">
                <div className="w-full lg:w-1/3 flex flex-col gap-6 bg-slate-800/50 p-6 rounded-2xl border border-slate-700 shadow-2xl">
                    <h2 className="text-xl font-bold text-cyan-400">1. Upload Your Image(s)</h2>
                    <ImageUploader onImageUpload={handleImageUpload} imagePreview={originalImages[0]?.base64 || null} />
                    <ThumbnailGallery images={originalImages} activeIndex={activeImageIndex} onSelect={handleSelectImage} />
                    
                    <h2 className="text-xl font-bold text-cyan-400 mt-4">2. Describe Your Edit</h2>
                    <Controls
                        prompt={prompt}
                        setPrompt={setPrompt}
                        isGenerating={isLoading}
                        onGenerate={handleGenerate}
                        maintainConsistency={maintainConsistency}
                        setMaintainConsistency={setMaintainConsistency}
                        isImageUploaded={!!activeImage}
                        onRemoveBackground={handleRemoveBackground}
                        isRemovingBg={isRemovingBg}
                        brightness={brightness}
                        setBrightness={setBrightness}
                        contrast={contrast}
                        setContrast={setContrast}
                    />
                </div>
                <div className="w-full lg:w-2/3 flex flex-col">
                    <ErrorMessage error={error} clearError={() => setError(null)} />
                    <ImageDisplay
                        originalImage={activeImage}
                        editedImage={activeEditedImage}
                        bgRemovedImage={activeBgRemovedImage}
                        isLoading={isLoading}
                        isRemovingBg={isRemovingBg}
                        brightness={brightness}
                        contrast={contrast}
                    />
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default App;
