// src/services/imageService.js
import { api } from './api';

export const imageService = {
    /**
     * Processa o evento de alteração de arquivo do input file
     */
    processImageSelection(event) {
        const file = event.target.files?.[0];
        if (!file) return null;

        const imageUrl = URL.createObjectURL(file);

        return {
            file,
            imageUrl
        };
    },

    /**
     * Envia a imagem para o OcrController do .NET via FormData e QueryString
     * @param {File} file - Arquivo de imagem selecionado
     * @param {string} format - Formato escolhido no checkbox ('pdf', 'docx', 'txt')
     * @returns {Promise<Blob>} Arquivo gerado pelo OCR devolvido pela API .NET
     */
    async uploadToApi(file, format) {
        const formData = new FormData();
        // 1. Alinhado com '[FromForm] IFormFile file' do seu .NET
        formData.append('file', file);

        // 2. Alinhado com '[HttpPost("extract")]' e '[FromQuery] string format'
        // Passamos o formato na URL através do objeto 'params' do Axios
        const response = await api.post('/ocr/extract', formData, {
            params: {
                format: format // Coloca '?format=txt' automaticamente na URL
            },
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            responseType: 'blob' // Garante que o Axios capture os bytes do arquivo retornado pelo seu .NET
        });

        return response.data;
    }
};
