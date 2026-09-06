export const imageService = {
    async uploadToApi(file: File, format: string): Promise<Blob> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`http://localhost:5000/api/ocr/extract?format=${format}`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Falha na comunicação com a API');
        }

        return await response.blob();
    }
};
