export type FileFormat = 'pdf' | 'docx' | 'txt' | '';

interface FormatOptionProps {
    selectedFormat: FileFormat;
    onFormatChange: (format: FileFormat) => void;
}

const FORMAT_OPTIONS: { id: FileFormat; label: string }[] = [
    { id: 'pdf', label: 'PDF' },
    { id: 'docx', label: 'DOCX' },
    { id: 'txt', label: 'TXT' },
];

export function FormatOption({ selectedFormat, onFormatChange }: FormatOptionProps) {
    const handleToggle = (format: FileFormat) => {
        // Se clicar no que já está selecionado, desmarca. Caso contrário, seleciona o novo.
        const nextFormat = selectedFormat === format ? '' : format;
        onFormatChange(nextFormat);
    };

    return (
        <div className="flex flex-col w-full gap-3 font-medium">
            {FORMAT_OPTIONS.map((option) => (
                <label
                    key={option.id}
                    onClick={() => handleToggle(option.id)}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all cursor-pointer select-none ${selectedFormat === option.id
                        ? 'bg-slate-800 border-blue-500/80 text-white shadow-md'
                        : 'bg-slate-900/50 border-slate-700/60 text-slate-300 hover:border-slate-500 hover:text-white'
                        }`}
                >
                    <input
                        type="checkbox"
                        checked={selectedFormat === option.id}
                        onChange={() => { }} // Tratado no onClick do label para melhor UX
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-500"
                    />
                    <span className="text-sm font-semibold">{option.label}</span>
                </label>
            ))}
        </div>
    );
}