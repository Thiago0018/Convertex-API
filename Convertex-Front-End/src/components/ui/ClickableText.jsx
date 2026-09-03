// src/components/ui/ClickableText.jsx
export function ClickableText({
    children,
    onClick,
    href,
    variant = 'primary',
    size = 'md',
    underline = true,
    className = '',
    ...props
}) {
    // Styles base para o texto ser interativo e responsivo
    const baseStyles = `inline-flex items-center gap-1.5 font-medium transition-all duration-200 cursor-pointer select-none active:opacity-70 ${underline ? 'hover:underline underline-offset-4' : ''
        }`;

    // Tamanhos
    const sizes = {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base"
    };

    // Variações de cores
    const variants = {
        default: "text-[#749099] hover:text-slate-300",
        primary: "text-blue-400 hover:text-blue-300",
        secondary: "text-slate-400 hover:text-slate-200",
        accent: "text-cyan-400 hover:text-cyan-300",
        danger: "text-red-400 hover:text-red-300"
    };

    const combinedClasses = `${baseStyles} ${sizes[size]} ${variants[variant]} ${className}`;

    // Se a prop 'href' for passada, renderiza como link <a>. Senão, renderiza como <button>
    if (href) {
        return (
            <a
                href={href}
                onClick={onClick}
                className={combinedClasses}
                {...props}
            >
                {children}
            </a>
        );
    }

    return (
        <button
            type="button"
            onClick={onClick}
            className={combinedClasses}
            {...props}
        >
            {children}
        </button>
    );
}