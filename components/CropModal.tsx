import React, { useState, useRef } from 'react';
import ReactCrop, { type Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import { cropAndDownloadImage } from '../services/cropService';

interface CropModalProps {
    isOpen: boolean;
    onClose: () => void;
    imageSrc: string;
    originalFileName: string;
}

const aspectRatios = [
    { name: 'Free', value: undefined },
    { name: '1:1', value: 1 / 1 },
    { name: '16:9', value: 16 / 9 },
    { name: '9:16', value: 9 / 16 },
];

const CropModal: React.FC<CropModalProps> = ({ isOpen, onClose, imageSrc, originalFileName }) => {
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
    const [aspect, setAspect] = useState<number | undefined>(undefined);
    const imgRef = useRef<HTMLImageElement>(null);

    function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
        const { width, height } = e.currentTarget;
        const newCrop = centerCrop(
            makeAspectCrop(
                {
                    unit: '%',
                    width: 90,
                },
                aspect,
                width,
                height
            ),
            width,
            height
        );
        setCrop(newCrop);
        setCompletedCrop(newCrop); // Set initial completed crop
    }
    
    const handleCropAndDownload = async () => {
        if (completedCrop && imgRef.current) {
            await cropAndDownloadImage(imgRef.current, completedCrop, originalFileName);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-slate-900 bg-opacity-80 backdrop-blur-sm flex justify-center items-center z-50 p-4"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className="bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl p-6 w-full max-w-4xl max-h-[90vh] flex flex-col gap-4"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-cyan-400">Crop Image</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="flex-grow min-h-0 flex justify-center items-center">
                    <ReactCrop
                        crop={crop}
                        onChange={(_, percentCrop) => setCrop(percentCrop)}
                        onComplete={(c) => setCompletedCrop(c)}
                        aspect={aspect}
                        minWidth={10}
                        minHeight={10}
                    >
                        <img
                            ref={imgRef}
                            src={imageSrc}
                            alt="Image to crop"
                            onLoad={onImageLoad}
                            className="max-w-full max-h-[60vh] object-contain"
                        />
                    </ReactCrop>
                </div>

                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                    <span className="text-slate-400 font-medium text-sm">Aspect Ratio:</span>
                    <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-lg border border-slate-700">
                        {aspectRatios.map(ratio => (
                            <button
                                key={ratio.name}
                                onClick={() => setAspect(ratio.value)}
                                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                                    aspect === ratio.value ? 'bg-cyan-600 text-white' : 'hover:bg-slate-700'
                                }`}
                            >
                                {ratio.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end gap-4 mt-4">
                    <button
                        onClick={onClose}
                        className="bg-slate-600 text-slate-200 font-bold py-2 px-6 rounded-lg hover:bg-slate-500 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleCropAndDownload}
                        disabled={!completedCrop?.width || !completedCrop?.height}
                        className="bg-cyan-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
                    >
                        Crop & Download
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CropModal;
