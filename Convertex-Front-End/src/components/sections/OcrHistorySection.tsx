import { type OcrHistoryItem } from '../../service/ocrHistoryService';

interface OcrHistorySectionProps {
    files: OcrHistoryItem[];
    onSelectFile: (item: OcrHistoryItem) => void;
    onClearHistory: () => void;
}

const FORMAT_TAGS: Record<string, string> = {
    pdf: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    docx: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    txt: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
};

export function OcrHistorySection({ files, onSelectFile, onClearHistory }: OcrHistorySectionProps) {
    return (
        <aside className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 min-h-60 w-full md:w-64 flex flex-col items-start gap-2 p-6 rounded-2xl shadow-2xl md:mb-12 transition-all duration-300 hover:border-slate-600/60">
            {/* CABEÇALHO DA SEÇÃO COM BOTÃO DE LIMPEZA */}
            <div className="flex items-center justify-between w-full mb-2">
                <h2 className="text-xl font-bold text-white">Arquivos recentes</h2>
                {files.length > 0 && (
                    <button
                        type="button"
                        onClick={onClearHistory}
                        title="Limpar todo o histórico"
                        className="text-slate-400 hover:text-rose-400 text-xs font-semibold px-2 py-1 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer"
                    >
                        Limpar
                    </button>
                )}
            </div>

            <div className="w-full flex flex-col gap-2.5 overflow-y-auto max-h-80 pr-1">
                {files.length === 0 ? (
                    <p className="text-xs text-slate-400">Nenhum histórico recente.</p>
                ) : (
                    files.map((item) => {
                        const tagStyle = FORMAT_TAGS[item.format.toLowerCase()] || 'bg-slate-700/50 text-slate-300 border-slate-600';

                        return (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => onSelectFile(item)}
                                className="group text-left w-full bg-slate-900/60 hover:bg-slate-900 border border-slate-700/60 hover:border-blue-500/80 rounded-xl p-3 transition-all duration-200 flex flex-col gap-1.5 cursor-pointer"
                            >
                                <div className="flex items-center justify-between gap-2 w-full">
                                    <span className="text-xs font-semibold text-slate-200 truncate max-w-40 group-hover:text-blue-400 transition-colors">
                                        {item.fileName}
                                    </span>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase ${tagStyle}`}>
                                        {item.format}
                                    </span>
                                </div>

                                {item.textPreview && (
                                    <p className="text-[11px] text-slate-400 line-clamp-1 font-mono italic">
                                        "{item.textPreview}..."
                                    </p>
                                )}

                                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/80 w-full">
                                    <span>Convertido às {item.timestamp}</span>
                                    <span className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity font-semibold">Reabrir →</span>
                                </div>
                            </button>
                        );
                    })
                )}
            </div>
        </aside>
    );
}