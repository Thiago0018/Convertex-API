import { api } from './api';
import axios from 'axios';
import type { ChangeEvent } from 'react';

// Contrato para seleção local da imagem
export interface ImageSelectionResult {
    file: File;
    imageUrl: string;
}

// Contrato (DTO) de resposta do processamento OCR
export interface OcrExtractionResult {
    text: string;      // Texto string legível para a caixa flutuante / cópia
    blobData: Blob;    // Bytes originais do arquivo retornado para download opcional
}

export const imageService = {
    /**
     * Captura o arquivo do input tipo file e gera a URL de preview
     */
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

    /**
     * Realiza o envio da imagem para a API e trata a resposta/erros da rede
     */
    async uploadToApi(file: File, format: string): Promise<OcrExtractionResult> {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await api.post<Blob>('/ocr/extract', formData, {
                params: { format },
                responseType: 'blob',
            });

            const blobData = response.data;
            // Converte os bytes do Blob para string sem precisar de nova requisição
            const text = await blobData.text();

            return {
                text,
                blobData,
            };
        } catch (error) {
            // Tratamento de erros centralizado na infraestrutura
            if (axios.isAxiosError(error)) {
                if (!error.response) {
                    throw new Error('Não foi possível conectar à API.');
                }
                if (error.response.data instanceof Blob) {
                    const errorMessage = await error.response.data.text();
                    throw new Error(errorMessage);
                }
                throw new Error(error.response.data?.message || 'A API recusou a conversão.');
            }
            throw new Error('Erro inesperado ao converter a imagem.');
        }
    },

    /**
     * Utilitário DOM para disparar o download do arquivo no navegador do usuário
     */
    triggerDownload(blobData: Blob, format: string): void {
        const downloadUrl = window.URL.createObjectURL(blobData);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', `ocr-resultado.${format || 'txt'}`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(downloadUrl);
    }
};
