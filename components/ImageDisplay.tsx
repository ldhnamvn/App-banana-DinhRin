
import React from 'react';
import { ImageFile } from '../types';

interface ImageDisplayProps {
    originalImage: ImageFile | null;
    editedImage: string | null;
    isLoading: boolean;
}

const ImagePlaceholder: React.FC<{ title: string, isLoading?: boolean }> = ({ title, isLoading }) => (
    <div className="w-full aspect-square bg-slate-800 rounded-lg flex flex-col justify-center items-center text-slate-500 border-2 border-dashed border-slate-700">
        {isLoading ? (
             <div className="flex flex-col items-center">
                <svg className="animate-spin h-10 w-10 text-cyan-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-lg font-semibold text-slate-400">Editing in progress...</span>
                <span className="text-sm mt-1">This may take a moment.</span>
             </div>
        ) : (
            <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="font-semibold text-lg">{title}</span>
            </>
        )}
    </div>
);


const ImageDisplay: React.FC<ImageDisplayProps> = ({ originalImage, editedImage, isLoading }) => {
    const handleDownload = () => {
        if (!editedImage || !originalImage) return;

        const link = document.createElement('a');
        link.href = editedImage;

        const originalFileName = originalImage.file.name.split('.').slice(0, -1).join('.') || 'download';
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const mimeType = editedImage.substring(editedImage.indexOf(':') + 1, editedImage.indexOf(';'));
        const extension = mimeType.split('/')[1] || 'png';

        link.download = `${originalFileName}_edited_${timestamp}.${extension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
            <div className="flex flex-col items-center">
                <h3 className="text-lg font-semibold mb-2 text-slate-400">Original</h3>
                {originalImage ? (
                    <img src={originalImage.base64} alt="Original" className="w-full aspect-square object-contain bg-slate-800 rounded-lg" />
                ) : (
                    <ImagePlaceholder title="Original Image" />
                )}
            </div>
            <div className="flex flex-col items-center">
                <h3 className="text-lg font-semibold mb-2 text-slate-400">Edited</h3>
                {editedImage ? (
                    <img src={editedImage} alt="Edited" className="w-full aspect-square object-contain bg-slate-800 rounded-lg" />
                ) : (
                    <ImagePlaceholder title="Edited Image" isLoading={isLoading} />
                )}
                {editedImage && (
                    <button
                        onClick={handleDownload}
                        className="mt-4 w-full max-w-xs bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-500 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-green-500 flex items-center justify-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                           <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Download Edited Image
                    </button>
                )}
            </div>
        </div>
    );
};

export default ImageDisplay;
