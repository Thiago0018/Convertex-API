import { useState } from "react";

// Recebemos a função 'onFormatChange' para avisar a Home qual formato foi marcado
export function FormatOption({ onFormatChange }) {
    // Estado interno para saber qual formato está selecionado no momento
    const [formatoSelecionado, setFormatoSelecionado] = useState("");

    // Função que roda toda vez que uma caixinha é clicada
    const handleCheckboxChange = (formato) => {
        // Se clicar na que já está marcada, desmarca. Se não, marca a nova.
        const novoFormato = formatoSelecionado === formato ? "" : formato;

        setFormatoSelecionado(novoFormato);

        // Se o componente pai passou a função, avisamos ele sobre a mudança
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
                    className="w-4 h-4 peer-checked:bg-[##414853] cursor-pointer"
                />
                <span className="text-amber-50">DOCX</span>
            </div>

            {/* Opção TXT */}
            <div className="flex flex-row gap-2 items-center cursor-pointer">
                <input
                    type="checkbox"
                    checked={formatoSelecionado === "txt"}
                    onChange={() => handleCheckboxChange("txt")}
                    className="w-4 h-4 white cursor-pointer"
                />
                <span className="text-amber-50">TXT</span>
            </div>

        </div>
    );
}
