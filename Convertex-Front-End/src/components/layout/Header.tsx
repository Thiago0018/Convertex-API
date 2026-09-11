import { DynamicLinkText } from '../ui/DynamicLinkText';

export function Header() {
    return (
        <header className="Header shrink-0">
            <div className="flex min-h-20 w-full items-center justify-between bg-[#242d3e] px-6 sm:px-8">
                <div className="flex items-center gap-2 text-white">
                    <DynamicLinkText to="/" variant="secondary" as="h1">
                        CONVERTEX
                    </DynamicLinkText>
                </div>
            </div>
        </header>
    );
}