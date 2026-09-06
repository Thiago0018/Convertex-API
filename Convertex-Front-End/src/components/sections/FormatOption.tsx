import { useState } from 'react';

// 1. Criamos um "Type Union" (similar a um Enum no C#) para restringir os valores aceitos
export type FileFormat = 'pdf' | 'docx' | 'txt' | '';

// 2. Definimos a Interface de Props (o contrato que o componente exige)
interface FormatOptionProps {
    onFormatChange?: (format: FileFormat) => void;
}

export function FormatOption({ onFormatChange }: FormatOptionProps) {
    // 3. Tipamos o estado com a nossa union FileFormat
    const [formatoSelecionado, setFormatoSelecionado] = useState<FileFormat>("");

    // 4. Tipamos o parâmetro de entrada da função
    const handleCheckboxChange = (formato: FileFormat) => {
        const novoFormato: FileFormat = formatoSelecionado === formato ? "" : formato;

        setFormatoSelecionado(novoFormato);

        if (onFormatChange) {
            onFormatChange(novoFormato);
        }
    };

    return (
        <div className="flex flex-col gap-4 text-slate-800 font-medium">

            {/* Opção PDF */}
            <div className="flex flex-row gap-2 items-center cursor-pointer">
                <input
                    type="checkbox"
                    checked={formatoSelecionado === "pdf"}
                    onChange={() => handleCheckboxChange("pdf")}
                    className="w-4 h-4 cursor-pointer"
                />
                <span className="text-amber-50">PDF</span>
            </div>

            {/* Opção DOCX */}
            <div className="flex flex-row gap-2 items-center cursor-pointer">
                <input
                    type="checkbox"
                    checked={formatoSelecionado === "docx"}
                    onChange={() => handleCheckboxChange("docx")}
                    className="w-4 h-4 cursor-pointer"
                />
                <span className="text-amber-50">DOCX</span>
            </div>

            {/* Opção TXT */}
            <div className="flex flex-row gap-2 items-center cursor-pointer">
                <input
                    type="checkbox"
                    checked={formatoSelecionado === "txt"}
                    onChange={() => handleCheckboxChange("txt")}
                    className="w-4 h-4 cursor-pointer"
                />
                <span className="text-amber-50">TXT</span>
            </div>

        </div>
    );
}
