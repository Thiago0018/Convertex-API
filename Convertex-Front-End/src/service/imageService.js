// src/services/imageService.js

export const imageService = {
    /**
     * Processa o evento de alteração de arquivo do input file
     * @param {Event} event Evento nativo do input
     * @returns {{ file: File, imageUrl: string } | null}
     */
    processImageSelection(event) {
        const file = event.target.files?.[0];
        if (!file) return null;

        // Gera a URL temporária para exibição visual
        const imageUrl = URL.createObjectURL(file);

        return {
            file,
            imageUrl
        };
    },

    /**
     * Exemplo de método para enviar a imagem para o backend .NET via FormData
     * @param {File} file 
     */
    async uploadToApi(file) {
        const formData = new FormData();
        formData.append('file', file);

        // Aqui entraria a chamada do Axios/Fetch para a API .NET
        // const response = await api.post('/upload', formData);
        // return response.data;
        console.log("Serviço: Imagem pronta para ser enviada para a API .NET", file.name);
    }
};