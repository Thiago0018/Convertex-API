// src/components/ui/Avatar.jsx
export function Avatar({
    src,                  // URL da foto de perfil (opcional)
    alt = 'Avatar',       // Texto alternativo
    name,                 // Nome do usuário (para gerar as iniciais se não houver foto)
    size = 'md',          // 'sm' | 'md' | 'lg' | 'xl'
    status,               // 'online' | 'offline' | 'busy' | 'away' (opcional)
    variant = 'primary',  // Estilo da borda/fundo
    className = '',
    onClick,
    ...props
}) {

    // 1. Dicionário de Tamanhos
    const sizes = {
        sm: "w-8 h-8 text-xs",
        md: "w-10 h-10 text-sm",
        lg: "w-14 h-14 text-base",
        xl: "w-20 h-20 text-xl"
    };

    // Tamanhos do indicador de status (bolinha verde/cinza)
    const statusSizes = {
        sm: "w-2.5 h-2.5 border",
        md: "w-3 h-3 border-2",
        lg: "w-4 h-4 border-2",
        xl: "w-5 h-5 border-2"
    };

    // 2. Estilos de Borda e Fundo
    const variants = {
        primary: "bg-slate-800 text-blue-400 border-2 border-blue-500/30",
        gradient: "bg-slate-900 text-white p-[2px] bg-gradient-to-tr from-blue-600 to-cyan-400",
        secondary: "bg-slate-800 text-slate-200 border border-slate-700",
        accent: "bg-slate-800 text-cyan-400 border-2 border-cyan-500/40"
    };

    // 3. Cores dos Status
    const statusColors = {
        online: "bg-emerald-500 border-slate-950",
        offline: "bg-slate-500 border-slate-950",
        busy: "bg-rose-500 border-slate-950",
        away: "bg-amber-500 border-slate-950"
    };

    // Função auxiliar para extrair até 2 iniciais a partir do nome
    const getInitials = (fullName) => {
        if (!fullName) return '?';
        const names = fullName.trim().split(' ');
        if (names.length === 1) return names[0].charAt(0).toUpperCase();
        return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
    };

    const isClickable = Boolean(onClick);

    return (
        <div className={`relative inline-block select-none ${className}`}>
            <div
                onClick={onClick}
                /* 
                  CLASSES DE HOVER E CLIQUE:
                  - cursor-pointer: cursor de mãozinha
                  - transition-transform duration-200: animação suave
                  - hover:scale-105: cresce ao passar o mouse
                  - active:scale-95: afunda ao clicar
                */
                className={`
          relative rounded-full flex items-center justify-center font-bold overflow-hidden
          cursor-pointer transition-all duration-200 ease-out
          hover:scale-105 active:scale-95
          ${sizes[size]} 
          ${variants[variant]}
          `}
                {...props}
            >
                {/* Caso 1: Foto passada por URL */}
                {src ? (
                    <img
                        src={src}
                        alt={alt || name}
                        className="w-full h-full object-cover rounded-full"
                    />
                ) : name ? (
                    /* Caso 2: Iniciais do Nome */
                    <span>{getInitials(name)}</span>
                ) : (
                    /* Caso 3: Ícone SVG Padrão de Usuário */
                    <svg className="w-1/2 h-1/2 opacity-70" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                )}
            </div>

            {/* Indicador de Status (se fornecido) */}
            {status && (
                <span
                    className={`
            absolute bottom-0 right-0 rounded-full
            ${statusSizes[size]} 
            ${statusColors[status]}
          `}
                />
            )}
        </div>
    );
}