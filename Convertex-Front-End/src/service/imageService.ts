import { api } from './api';

export const imageService = {
    async uploadToApi(file: File, format: string): Promise<Blob> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post<Blob>('/ocr/extract', formData, {
            params: { format },
            responseType: 'blob',
        });

        return response.data;
    }
};
