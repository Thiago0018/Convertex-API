import { useState, useEffect, useMemo, ChangeEvent } from 'react';

interface OcrResultModalProps {
    isOpen: boolean;
    onClose: () => void;
    extractedText: string;
    format: string;
}

export function OcrResultModal({
    isOpen,
    onClose,
    extractedText,
    format,
}: OcrResultModalProps) {
    const [text, setText] = useState<string>(extractedText);
    const [copied, setCopied] = useState<boolean>(false);

    // Sincroniza o estado interno sempre que o modal abre ou a prop extractedText muda
    useEffect(() => {
        setText(extractedText);
    }, [extractedText, isOpen]);

    // Suporte ao atalho Tecla ESC para fechar
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    // Cálculo otimizado do contador de palavras e caracteres
    const { wordCount, charCount } = useMemo(() => {
        const trimmedText = text.trim();
        const charCount = text.length;
        const wordCount = trimmedText === '' ? 0 : trimmedText.split(/\s+/).length;
        return { wordCount, charCount };
    }, [text]);

    if (!isOpen) return null;

    const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Erro ao copiar texto:', err);
        }
    };

    const handleDownloadEditedText = () => {
        // Cria um Blob atualizado com o texto editado pelo usuário
        const updatedBlob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const downloadUrl = window.URL.createObjectURL(updatedBlob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', `ocr-resultado-editado.${format || 'txt'}`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(downloadUrl);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
            {/* Modal Container */}
            <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">

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

                {/* Toolbar Superior: Métricas / Contador */}
                <div className="bg-slate-950/60 px-4 py-2 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <span className="font-medium">Edite o texto extraído abaixo antes de copiar ou baixar</span>
                    <div className="flex items-center gap-3 font-mono">
                        <span className="font-mono text-cyan-400 font-semibold">{wordCount}</span>
                        <span>•</span>
                        <span><strong className="text-cyan-400">{charCount}</strong> caracteres</span>
                    </div>
                </div>

                {/* Área de Edição (Textarea) */}
                <div className="p-4 flex-1 bg-slate-950/50 flex flex-col min-h-75">
                    <textarea
                        value={text}
                        onChange={handleTextChange}
                        placeholder="Nenhum texto identificado..."
                        className="w-full h-full flex-1 bg-transparent border-0 font-mono text-sm text-slate-200 focus:outline-none resize-none leading-relaxed select-text placeholder:text-slate-600"
                    />
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
                            onClick={handleDownloadEditedText}
                            className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-blue-500/20 active:scale-95 cursor-pointer"
                        >
                            Baixar .{format || 'txt'}
                        </button>
                    </div>
                </div>

            </div>
        </div >
    );
}