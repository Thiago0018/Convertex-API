import { ElementType, ComponentPropsWithoutRef, ReactNode, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';

// 1. Union das cores disponíveis
export type DynamicLinkVariant = 'primary' | 'secondary' | 'accent' | 'danger';

// 2. Props base do componente sem conflitos de tags
interface BaseDynamicLinkTextProps {
    to?: string;
    children?: ReactNode;
    variant?: DynamicLinkVariant;
    underline?: boolean;
    className?: string;
}

// 3. Tipo polimórfico genérico que combina a tag escolhida em 'as' com suas props nativas
export type DynamicLinkTextProps<T extends ElementType = 'p'> = BaseDynamicLinkTextProps & {
    as?: T;
} & Omit<ComponentPropsWithoutRef<T>, keyof BaseDynamicLinkTextProps | 'as'>;

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

    // Dicionário de cores fortemente tipado com Record
    const variants: Record<DynamicLinkVariant, string> = {
        primary: "text-blue-400 hover:text-blue-300",
        secondary: "text-slate-300 hover:text-white",
        accent: "text-cyan-400 hover:text-cyan-300",
        danger: "text-rose-400 hover:text-rose-300"
    };

    // Tipagem genérica adaptável do manipulador de clique
    const handleClick = (event: MouseEvent<Element>) => {
        if (onClick) {
            (onClick as (e: MouseEvent<Element>) => void)(event);
        }

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