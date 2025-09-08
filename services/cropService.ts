import { PixelCrop } from 'react-image-crop';

/**
 * Creates a cropped image from a source image and a crop area.
 * @param image The source HTMLImageElement.
 * @param crop The PixelCrop object from react-image-crop.
 * @returns A promise that resolves with the cropped image as a Blob.
 */
function getCroppedBlob(image: HTMLImageElement, crop: PixelCrop): Promise<Blob> {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        return Promise.reject(new Error('Could not get canvas context.'));
    }

    const pixelRatio = window.devicePixelRatio || 1;
    canvas.width = crop.width * pixelRatio;
    canvas.height = crop.height * pixelRatio;
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
    );

    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (!blob) {
                reject(new Error('Canvas is empty'));
                return;
            }
            resolve(blob);
        }, 'image/png'); // Always save as PNG for best quality and transparency support
    });
}

/**
 * Triggers a download for a given Blob.
 * @param blob The Blob to download.
 * @param fileName The name of the file to be downloaded.
 */
export function downloadBlob(blob: Blob, fileName: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Main function to crop an image and trigger a download.
 * @param image The source HTMLImageElement.
 * @param crop The PixelCrop object.
 * @param originalFileName The original name of the file being cropped.
 */
export async function cropAndDownloadImage(
    image: HTMLImageElement,
    crop: PixelCrop,
    originalFileName: string
) {
    if (!crop.width || !crop.height) {
        console.error('Crop width or height is zero.');
        return;
    }

    try {
        const blob = await getCroppedBlob(image, crop);
        const baseName = originalFileName.split('.').slice(0, -1).join('.') || 'image';
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const downloadFileName = `${baseName}_cropped_${timestamp}.png`;
        downloadBlob(blob, downloadFileName);
    } catch (error) {
        console.error('Cropping failed:', error);
    }
}
