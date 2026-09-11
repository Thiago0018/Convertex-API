import { api } from './api';
import axios from 'axios';
import type { ChangeEvent } from 'react';

export type FileFormat = 'txt' | 'json' | 'csv' | 'docx' | 'pdf';

export interface ImageSelectionResult {
    file: File;
    imageUrl: string;
}

export interface OcrExtractionResult {
    text: string;      // Texto legível formatado para o modal/textarea
    blobData: Blob;    // Bytes compilados retornados pela API .NET
}

export const imageService = {
    processImageSelection(event: ChangeEvent<HTMLInputElement>): ImageSelectionResult | null {
        const file = event.target.files?.[0];
        if (!file) return null;

        return {
            file,
            imageUrl: URL.createObjectURL(file),
        };
    },

    async uploadToApi(file: File, format: FileFormat): Promise<OcrExtractionResult> {
        try {
            const formData = new FormData();
            formData.append('file', file);

            // Requisita a versão binária ou formatada do arquivo selecionado
            const response = await api.post<Blob>('/ocr/extract', formData, {
                params: { format },
                responseType: 'blob',
            });

            const blobData = response.data;
            let text = '';

            if (format === 'docx' || format === 'pdf') {
                // Para DOCX e PDF, fazemos uma chamada em TXT para exibir o conteúdo legível na tela
                const textResponse = await api.post<Blob>('/ocr/extract', formData, {
                    params: { format: 'txt' },
                    responseType: 'blob',
                });
                text = await textResponse.data.text();
            } else {
                text = await blobData.text();
            }

            return { text, blobData };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (!error.response) {
                    throw new Error('Não foi possível conectar à API do Convertex.');
                }
                if (error.response.data instanceof Blob) {
                    const errorMessage = await error.response.data.text();
                    throw new Error(errorMessage || 'A API recusou a conversão.');
                }
                throw new Error(error.response.data?.message || 'Erro no processamento da imagem.');
            }
            throw new Error('Erro inesperado ao converter a imagem.');
        }
    },

    triggerDownload(blobData: Blob, format: FileFormat): void {
        const downloadUrl = window.URL.createObjectURL(blobData);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', `resultado-ocr.${format}`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(downloadUrl);
    }
};
