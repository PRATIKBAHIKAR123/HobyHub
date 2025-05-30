import React, { useState, useEffect } from 'react';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ImageCropperProps {
    isOpen: boolean;
    onClose: () => void;
    imageUrl: string;
    onCropComplete: (croppedImage: File) => void;
}

export default function ImageCropper({ isOpen, onClose, imageUrl, onCropComplete }: ImageCropperProps) {
    const [crop, setCrop] = useState<Crop>({
        unit: '%',
        width: 90,
        height: 90,
        x: 5,
        y: 5
    });
    const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setImageLoaded(false);
        }
    }, [isOpen]);

    const getCroppedImg = (image: HTMLImageElement, crop: Crop): Promise<File> => {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            throw new Error('No 2d context');
        }

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

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                if (!blob) {
                    throw new Error('Canvas is empty');
                }
                const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });
                resolve(file);
            }, 'image/jpeg', 0.95);
        });
    };

    const handleCropComplete = async () => {
        if (imageRef && crop) {
            try {
                const croppedImage = await getCroppedImg(imageRef, crop);
                onCropComplete(croppedImage);
                onClose();
            } catch (error) {
                console.error('Error cropping image:', error);
            }
        }
    };

    const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const img = e.currentTarget;
        setImageRef(img);
        setImageLoaded(true);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[90vw] md:max-w-[600px] max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>Crop Profile Image</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center gap-4">
                    <div className="w-full max-h-[60vh] overflow-auto">
                        {!imageLoaded && (
                            <div className="flex items-center justify-center h-[300px]">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                            </div>
                        )}
                        <ReactCrop
                            crop={crop}
                            onChange={(c) => setCrop(c)}
                            aspect={1}
                            circularCrop
                            className={!imageLoaded ? 'hidden' : ''}
                        >
                            <img
                                src={imageUrl}
                                alt="Crop me"
                                onLoad={handleImageLoad}
                                className="max-w-full max-h-[60vh] object-contain"
                            />
                        </ReactCrop>
                    </div>
                    <div className="flex gap-2 mt-4">
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleCropComplete}
                            disabled={!imageLoaded}
                        >
                            Crop & Save
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}