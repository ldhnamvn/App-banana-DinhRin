
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

const App: React.FC = () => {
    const [originalImage, setOriginalImage] = useState<ImageFile | null>(null);
    const [editedImage, setEditedImage] = useState<string | null>(null);
    const [bgRemovedImage, setBgRemovedImage] = useState<string | null>(null);
    const [prompt, setPrompt] = useState<string>('');
    const [maintainConsistency, setMaintainConsistency] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isRemovingBg, setIsRemovingBg] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [brightness, setBrightness] = useState<number>(100);
    const [contrast, setContrast] = useState<number>(100);

    const handleImageUpload = (file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setOriginalImage({
                file,
                base64: reader.result as string,
            });
            setEditedImage(null);
            setBgRemovedImage(null);
            setError(null);
            setBrightness(100);
            setContrast(100);
        };
        reader.onerror = () => {
            setError("Failed to read the image file.");
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveBackground = async () => {
        if (!originalImage) {
            setError("Please upload an image first.");
            return;
        }

        setIsRemovingBg(true);
        setError(null);
        setBgRemovedImage(null);

        const bgRemovePrompt = "Isolate the main subject and remove the background, making it transparent. The output must be a PNG with a transparent background.";

        try {
            let base64ToProcess = originalImage.base64;
            let mimeTypeForApi = originalImage.file.type;

            if (brightness !== 100 || contrast !== 100) {
                base64ToProcess = await applyImageAdjustments(
                    originalImage.base64,
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
                // The model should return PNG for transparency
                setBgRemovedImage(`data:image/png;base64,${result.image}`);
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
        if (!originalImage) {
            setError("Please upload an image first.");
            return;
        }
        if (!prompt.trim()) {
            setError("Please enter a prompt to describe the edit.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setEditedImage(null);

        // Prepend consistency instruction if checked
        const finalPrompt = maintainConsistency
            ? `CRITICAL INSTRUCTION: Edit the image based on the following request. It is absolutely essential that you DO NOT change the person's face or identity. Preserve the facial features and unique characteristics of the subject perfectly. Now, here is the request: ${prompt}`
            : prompt;
        
        try {
             let base64ToProcess = originalImage.base64;
             let mimeTypeForApi = originalImage.file.type;

             if (brightness !== 100 || contrast !== 100) {
                 base64ToProcess = await applyImageAdjustments(
                     originalImage.base64,
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
                setEditedImage(`data:${result.mimeType || 'image/png'};base64,${result.image}`);
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
                    <h2 className="text-xl font-bold text-cyan-400">1. Upload Your Image</h2>
                    <ImageUploader onImageUpload={handleImageUpload} imagePreview={originalImage?.base64} />
                    
                    <h2 className="text-xl font-bold text-cyan-400 mt-4">2. Describe Your Edit</h2>
                    <Controls
                        prompt={prompt}
                        setPrompt={setPrompt}
                        isGenerating={isLoading}
                        onGenerate={handleGenerate}
                        maintainConsistency={maintainConsistency}
                        setMaintainConsistency={setMaintainConsistency}
                        isImageUploaded={!!originalImage}
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
                        originalImage={originalImage}
                        editedImage={editedImage}
                        bgRemovedImage={bgRemovedImage}
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
