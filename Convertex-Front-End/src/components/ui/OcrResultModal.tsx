import { useState, useEffect } from 'react';

interface OcrResultModalProps {
    isOpen: boolean;
    onClose: () => void;
    extractedText: string;
    onDownload: () => void;
    format: string;
}

export function OcrResultModal({
    isOpen,
    onClose,
    extractedText,
    onDownload,
    format,
}: OcrResultModalProps) {
    const [copied, setCopied] = useState<boolean>(false);

    // Permite fechar a caixa flutuante ao pressionar a tecla ESC
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(extractedText);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Erro ao copiar texto:', err);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
            {/* Modal Container */}
            <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                        <h3 className="font-bold text-slate-100 text-lg">Texto Extraído (OCR)</h3>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
                        aria-label="Fechar"
                    >
                        ✕
                    </button>
                </div>

                {/* Conteúdo do Texto */}
                <div className="p-4 flex-1 overflow-y-auto bg-slate-950/50 font-mono text-sm text-slate-200 whitespace-pre-wrap select-text leading-relaxed">
                    {extractedText || 'Nenhum texto identificado.'}
                </div>

                {/* Rodapé de Ações */}
                <div className="p-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-900">
                    <button
                        type="button"
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-medium text-sm transition-all active:scale-95 cursor-pointer"
                    >
                        {copied ? 'Copiado!' : 'Copiar Texto'}
                    </button>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-slate-400 hover:text-slate-200 text-sm font-medium transition-colors cursor-pointer"
                        >
                            Apenas Visualizar
                        </button>
                        <button
                            type="button"
                            onClick={onDownload}
                            className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-blue-500/20 active:scale-95 cursor-pointer"
                        >
                            Baixar .{format || 'txt'}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}