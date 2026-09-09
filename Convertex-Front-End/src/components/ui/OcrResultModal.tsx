import { useState, useEffect } from 'react';

interface OcrResultModalProps {
    isOpen: boolean;
    onClose: () => void;
    extractedText: string;
    onDownload: () => void;
    format: string; // 'pdf', 'docx', 'doc', 'txt'
    fileUrl?: string; // Veio do Hook (URL do Blob ou URL pública)
}

export function OcrResultModal({
    isOpen,
    onClose,
    extractedText,
    onDownload,
    format,
    fileUrl,
}: OcrResultModalProps) {
    const [copied, setCopied] = useState<boolean>(false);

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

    const normalizedFormat = format?.toLowerCase();

    // URL do visualizador da Microsoft (para Word via web)
    const isPublicUrl = fileUrl?.startsWith('http://') || fileUrl?.startsWith('https://');
    const officeViewerUrl = isPublicUrl && fileUrl
        ? `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`
        : undefined;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
            {/* Modal Container */}
            <div className="bg-slate-900 border border-slate-800 w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col h-[85vh] overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                        <h3 className="font-bold text-slate-100 text-lg">
                            Documento Processado ({format?.toUpperCase()})
                        </h3>
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

                {/* Área do Conteúdo / Visualizador */}
                <div className="flex-1 overflow-hidden bg-slate-950 flex flex-col justify-center items-center relative">

                    {/* 1. VISUALIZADOR DE PDF */}
                    {normalizedFormat === 'pdf' && fileUrl && (
                        <iframe
                            src={fileUrl}
                            className="w-full h-full border-none"
                            title="Visualizador de PDF"
                        />
                    )}

                    {/* 2. VISUALIZADOR DE WORD (.doc / .docx público) */}
                    {(normalizedFormat === 'docx' || normalizedFormat === 'doc') && officeViewerUrl && (
                        <iframe
                            src={officeViewerUrl}
                            className="w-full h-full border-none bg-white"
                            title="Visualizador do Word"
                        />
                    )}

                    {/* 3. VISUALIZADOR DE WORD / TEXTO (Documento Formatado Estilo Word) */}
                    {((normalizedFormat === 'docx' || normalizedFormat === 'doc') && !officeViewerUrl || normalizedFormat === 'txt') && (
                        <div className="w-full h-full p-8 overflow-y-auto bg-slate-950 flex justify-center">
                            {/* Folha estilo A4 / Word */}
                            <div className="w-full max-w-2xl bg-white text-slate-900 p-8 md:p-12 rounded-sm shadow-xl min-h-[90%] font-sans leading-relaxed text-base select-text">
                                {extractedText ? (
                                    <div className="whitespace-pre-wrap">{extractedText}</div>
                                ) : (
                                    <p className="text-slate-400 italic">Nenhum texto identificado no documento.</p>
                                )}
                            </div>
                        </div>
                    )}

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
                            Fechar
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