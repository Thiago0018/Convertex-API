import React, { useState } from 'react';
import { imageService } from '../../service/imageService';

export function OcrActionGroup({ file, format }) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleExecuteOcr = async (e) => {
        // Impede qualquer comportamento padrão de formulário/navegador
        e?.preventDefault();
        e?.stopPropagation();

        console.log("1. Botão clicado!");
        console.log("Arquivo:", file);
        console.log("Formato:", format);

        if (!file) {
            setMessage('Selecione uma imagem primeiro.');
            console.warn("Parou: sem arquivo selecionado");
            return;
        }

        if (!format) {
            setMessage('Selecione um formato (PDF, DOCX ou TXT).');
            console.warn("Parou: sem formato selecionado");
            return;
        }

        try {
            setLoading(true);
            setMessage('Processando na API .NET...');
            console.log("2. Enviando para a API .NET...");

            const blobData = await imageService.uploadToApi(file, format);
            console.log("3. Resposta do .NET recebida! Tamanho:", blobData.size);

            // Criação do Download Automático do arquivo vindo do .NET
            const blob = new Blob([blobData]);
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.setAttribute('download', `ocr-resultado.${format}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(downloadUrl);

            setMessage('Download concluído com sucesso!');
        } catch (error) {
            console.error("4. Erro ao chamar a API .NET:", error);
            setMessage('Erro ao processar imagem.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-2 mt-4 z-50 relative">
            {message && (
                <span className="text-xs font-bold text-amber-100 bg-amber-900/90 px-3 py-1 rounded border border-amber-700">
                    {message}
                </span>
            )}

            <button
                type="button"
                onClick={handleExecuteOcr}
                disabled={loading}
                className={`cursor-pointer px-6 py-2.5 rounded-xl font-bold transition-all duration-200 shadow-lg ${loading
                    ? 'bg-slate-700 cursor-not-allowed opacity-50'
                    : 'bg-slate-900 hover:bg-slate-800 text-white active:scale-95 hover:scale-105'
                    }`}
            >
                {loading ? 'Convertendo...' : 'Iniciar OCR'}
            </button>
        </div>
    );
}
