// src/components/ui/DynamicLinkText.jsx
import { useNavigate } from 'react-router-dom';

export function DynamicLinkText({
    as: Component = 'p',    // Define a tag HTML ('h1', 'h2', 'h3', 'p', 'span', etc.). Padrão é 'p'
    to,                     // Caminho da rota do React Router (ex: "/sobre", "/projetos")
    children,               // O texto ou conteúdo interno
    variant = 'primary',    // Estilo de cor do texto
    onClick,                // Função customizada extra (opcional)
    underline = false,      // Exibir sublinhado ao passar o mouse
    className = '',
    ...props
}) {
    const navigate = useNavigate();

    // 1. Mapeamento de cores
    const variants = {
        primary: "text-blue-400 hover:text-blue-300",
        secondary: "text-slate-300 hover:text-white",
        accent: "text-cyan-400 hover:text-cyan-300",
        danger: "text-rose-400 hover:text-rose-300"
    };

    // 2. Manipulador da navegação de rota
    const handleClick = (event) => {
        // Executa a função onClick enviada por prop, se existir
        if (onClick) onClick(event);

        // Se houver uma rota definida na prop 'to', faz a transição de página sem recarregar o navegador
        if (to && !event.defaultPrevented) {
            navigate(to);
        }
    };

    return (
        <Component
            onClick={handleClick}
            className={`
        inline-block cursor-pointer font-bold select-none
        transition-all duration-200 ease-out
        hover:scale-105 active:scale-95
        ${underline ? 'hover:underline underline-offset-4' : ''}
        ${variants[variant]}
        ${className}
      `}
            {...props}
        >
            {children}
        </Component>
    );
}