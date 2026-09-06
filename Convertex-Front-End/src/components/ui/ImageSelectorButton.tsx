// src/components/ui/ImageSelectorButton.jsx
// src/components/ui/ImageSelectorButton.tsx
import React from 'react';

// Similar a um DTO ou Contrato em C#
export interface ImageSelectedResult {
    file: File;
    previewUrl: string;
}

interface ImageSelectorButtonProps {
    onImageSelect: (result: ImageSelectedResult | null) => void;
}

export function ImageSelectorButton({ onImageSelect }: ImageSelectorButtonProps) {
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];

        if (selectedFile) {
            const previewUrl = URL.createObjectURL(selectedFile);
            onImageSelect({ file: selectedFile, previewUrl });
        } else {
            onImageSelect(null);
        }
    };

    return (
        <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
        />
    );
}