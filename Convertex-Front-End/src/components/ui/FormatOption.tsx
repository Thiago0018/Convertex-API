import type { Dispatch, SetStateAction } from 'react';
import type { FileFormat } from '../../service/imageService';

interface FormatOptionProps {
    selectedFormat: FileFormat;
    onFormatChange: Dispatch<SetStateAction<FileFormat>>;
}

export function FormatOption({ selectedFormat, onFormatChange }: FormatOptionProps) {
    const formats: { id: FileFormat; label: string }[] = [
        { id: 'txt', label: 'Texto (.txt)' },
        { id: 'json', label: 'JSON (.json)' },
        { id: 'csv', label: 'CSV (.csv)' },
        { id: 'docx', label: 'Word (.docx)' },
        { id: 'pdf', label: 'PDF (.pdf)' },
    ];

    return (
        <div className="flex flex-col gap-2.5 w-full">
            {formats.map((fmt) => {
                const isSelected = selectedFormat === fmt.id;

                return (
                    <button
                        key={fmt.id}
                        type="button"
                        onClick={() => onFormatChange(fmt.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl border text-sm font-medium transition-all duration-200 cursor-pointer select-none ${isSelected
                            ? 'bg-blue-600/20 border-blue-500 text-white shadow-md shadow-blue-500/10'
                            : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:bg-slate-800 hover:border-slate-600 hover:text-slate-200'
                            }`}
                    >
                        <div
                            className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${isSelected
                                ? 'bg-blue-500 border-blue-500 text-white'
                                : 'border-slate-500 bg-slate-900/50'
                                }`}
                        >
                            {isSelected && (
                                <svg
                                    className="w-3 h-3 stroke-3"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            )}
                        </div>
                        <span>{fmt.label}</span>
                    </button>
                );
            })}
        </div>
    );
}