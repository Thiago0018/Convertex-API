import { api } from './api';
import type { ChangeEvent } from 'react';

export interface ImageSelectionResult {
    file: File;
    imageUrl: string;
}

export const imageService = {
    processImageSelection(event: ChangeEvent<HTMLInputElement>): ImageSelectionResult | null {
        const file = event.target.files?.[0];

        if (!file) {
            return null;
        }

        return {
            file,
            imageUrl: URL.createObjectURL(file),
        };
    },

    async uploadToApi(file: File, format: string): Promise<Blob> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post<Blob>('/ocr/extract', formData, {
            params: { format },
            headers: { 'Content-Type': 'multipart/form-data' },
            responseType: 'blob',
        });

        return response.data;
    }
};
