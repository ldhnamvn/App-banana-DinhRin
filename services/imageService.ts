
export const applyImageAdjustments = (
    base64Image: string,
    brightness: number,
    contrast: number
): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                return reject(new Error('Could not get canvas context.'));
            }

            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;

            ctx.filter = `brightness(${brightness / 100}) contrast(${contrast / 100})`;
            ctx.drawImage(img, 0, 0);

            // Always export as PNG to ensure consistency and support for transparency.
            resolve(canvas.toDataURL('image/png'));
        };

        img.onerror = () => {
            reject(new Error('Failed to load image for adjustment processing.'));
        };

        img.src = base64Image;
    });
};
