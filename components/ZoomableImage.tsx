import React, { useState, useRef, WheelEvent, MouseEvent, useEffect } from 'react';

interface ZoomableImageProps {
    src: string;
    alt: string;
}

const MIN_SCALE = 0.5;
const MAX_SCALE = 5;

const ZoomableImage: React.FC<ZoomableImageProps> = ({ src, alt }) => {
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const isDraggingRef = useRef(false);
    const startPosRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        // Reset zoom and pan when image source changes
        setScale(1);
        setPosition({ x: 0, y: 0 });
    }, [src]);

    const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (!containerRef.current) return;

        const delta = e.deltaY * -0.01;
        const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale + delta));

        if (newScale === scale) return;
        
        const rect = containerRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // Adjust position to zoom towards the cursor
        const newPosX = mouseX - (mouseX - position.x) * (newScale / scale);
        const newPosY = mouseY - (mouseY - position.y) * (newScale / scale);

        setScale(newScale);
        
        if (newScale <= 1) {
            // If zoomed out, center the image
            setPosition({ x: 0, y: 0 });
        } else {
            setPosition({ x: newPosX, y: newPosY });
        }
    };

    const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
        if (scale <= 1 || e.button !== 0) return; // Only pan on left-click
        isDraggingRef.current = true;
        startPosRef.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        };
        e.currentTarget.style.cursor = 'grabbing';
    };

    const handleMouseUp = (e: MouseEvent<HTMLDivElement>) => {
        isDraggingRef.current = false;
        e.currentTarget.style.cursor = 'grab';
    };

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!isDraggingRef.current || scale <= 1) return;
        const newX = e.clientX - startPosRef.current.x;
        const newY = e.clientY - startPosRef.current.y;
        setPosition({ x: newX, y: newY });
    };

    const handleMouseLeave = (e: MouseEvent<HTMLDivElement>) => {
        if (isDraggingRef.current) {
            isDraggingRef.current = false;
            e.currentTarget.style.cursor = 'grab';
        }
    };

    const zoom = (direction: 'in' | 'out') => {
        const factor = 1.2;
        let newScale = direction === 'in' ? scale * factor : scale / factor;
        newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));
        setScale(newScale);
        if (newScale <= 1) {
             setPosition({ x: 0, y: 0 });
        }
    };

    const reset = () => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
    };

    return (
        <div className="relative w-full aspect-square bg-slate-800 rounded-lg group">
            <div
                ref={containerRef}
                className="w-full h-full overflow-hidden rounded-lg"
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ cursor: scale > 1 ? 'grab' : 'default' }}
            >
                <img
                    src={src}
                    alt={alt}
                    className="w-full h-full object-contain"
                    style={{
                        transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                        transition: isDraggingRef.current ? 'none' : 'transform 0.1s ease-out',
                    }}
                    draggable="false"
                />
            </div>
            <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-slate-900/70 backdrop-blur-sm p-1.5 rounded-lg border border-slate-700 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300">
                <button onClick={() => zoom('out')} title="Zoom Out" className="p-1 rounded-md hover:bg-slate-700 disabled:opacity-50 transition-colors" disabled={scale <= MIN_SCALE}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                </button>
                <button onClick={reset} title="Reset Zoom" className="p-1 rounded-md hover:bg-slate-700 text-xs font-mono w-12 text-center disabled:opacity-50 transition-colors" disabled={scale === 1}>
                    {Math.round(scale * 100)}%
                </button>
                <button onClick={() => zoom('in')} title="Zoom In" className="p-1 rounded-md hover:bg-slate-700 disabled:opacity-50 transition-colors" disabled={scale >= MAX_SCALE}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                </button>
            </div>
        </div>
    );
};

export default ZoomableImage;