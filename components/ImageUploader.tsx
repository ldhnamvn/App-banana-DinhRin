
import React, { useCallback, useRef } from 'react';

interface ImageUploaderProps {
    onImageUpload: (files: File[]) => void;
    imagePreview: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, imagePreview }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            onImageUpload(Array.from(event.target.files));
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleDragOver = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        event.stopPropagation();
    }, []);
    
    const handleDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        event.stopPropagation();
        if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
            onImageUpload(Array.from(event.dataTransfer.files));
        }
    }, [onImageUpload]);

    return (
        <div>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
                multiple
            />
            <label
                onClick={handleClick}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="flex justify-center items-center w-full h-48 border-2 border-dashed border-slate-500 rounded-lg cursor-pointer hover:bg-slate-700 hover:border-cyan-400 transition-colors duration-300 ease-in-out bg-slate-800"
            >
                {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="max-h-full max-w-full object-contain rounded-md" />
                ) : (
                    <div className="text-center text-slate-400">
                        <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <p className="mt-2 text-sm">Click to upload or drag & drop</p>
                        <p className="text-xs">PNG, JPG, WEBP</p>
                    </div>
                )}
            </label>
        </div>
    );
};

export default ImageUploader;
