import { ElementType, ComponentPropsWithoutRef, ReactNode, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';

export type DynamicLinkVariant = 'primary' | 'secondary' | 'accent' | 'danger';

interface BaseDynamicLinkTextProps {
    to?: string;
    children?: ReactNode;
    variant?: DynamicLinkVariant;
    underline?: boolean;
    className?: string;
}

export type DynamicLinkTextProps<T extends ElementType = 'p'> = BaseDynamicLinkTextProps & {
    as?: T;
} & Omit<ComponentPropsWithoutRef<T>, keyof BaseDynamicLinkTextProps | 'as'>;

// Dicionário estático movido para FORA (alocação única de memória)
const VARIANTS: Record<DynamicLinkVariant, string> = {
    primary: "text-blue-400 hover:text-blue-300",
    secondary: "text-slate-300 hover:text-white",
    accent: "text-cyan-400 hover:text-cyan-300",
    danger: "text-rose-400 hover:text-rose-300"
};

export function DynamicLinkText<T extends ElementType = 'p'>({
    as,
    to,
    children,
    variant = 'primary',
    onClick,
    underline = false,
    className = '',
    ...props
}: DynamicLinkTextProps<T>) {
    const Component = as || 'p';
    const navigate = useNavigate();

    const handleClick = (event: MouseEvent<HTMLOrSVGElement>) => {
        // Dispara o onClick original passado pelas props
        if (typeof onClick === 'function') {
            (onClick as (e: MouseEvent<HTMLOrSVGElement>) => void)(event);
        }

        // Checa se o usuário pressionou Ctrl, Cmd, Alt ou Shift (para abrir em nova aba/janela)
        const isModifiedClick = event.metaKey || event.altKey || event.ctrlKey || event.shiftKey;

        // Só faz a navegação via SPA se o clique for simples e sem modificadores
        if (to && !event.defaultPrevented && !isModifiedClick && event.button === 0) {
            event.preventDefault();
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
                ${VARIANTS[variant]}
                ${className}
            `}
            {...props}
        >
            {children}
        </Component>
    );
}