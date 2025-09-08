
import React from 'react';
import { ImageFile } from '../types';

interface ThumbnailGalleryProps {
    images: ImageFile[];
    activeIndex: number | null;
    onSelect: (index: number) => void;
}

const ThumbnailGallery: React.FC<ThumbnailGalleryProps> = ({ images, activeIndex, onSelect }) => {
    if (images.length <= 1) {
        return null;
    }

    return (
        <div className="mt-4">
            <h3 className="text-md font-semibold text-slate-400 mb-2">Uploaded Images ({images.length})</h3>
            <div className="flex gap-3 pb-2 overflow-x-auto">
                {images.map((image, index) => (
                    <button
                        key={index}
                        onClick={() => onSelect(index)}
                        className={`relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-500 ${
                            activeIndex === index ? 'border-cyan-400' : 'border-slate-600 hover:border-slate-400'
                        }`}
                        aria-current={activeIndex === index}
                        aria-label={`Select image ${index + 1}`}
                    >
                        <img
                            src={image.base64}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                         {activeIndex === index && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <span className="text-white font-bold text-sm">Active</span>
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ThumbnailGallery;
