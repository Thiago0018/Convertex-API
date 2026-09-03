import { SocialIconButton } from "../ui/SocialIconButton";
import { DynamicLinkText } from "../ui/DynamicLinkText";

export function Footer() {
    return (
        <footer className="Footer">
            <div className="flex w-full flex-col items-center justify-between gap-4 bg-[#2a2f37] p-6 sm:flex-row sm:p-8">
                <div className="flex items-center gap-2 text-amber-50 sm:ml-4">
                    <DynamicLinkText to="/" variant="secondary" as="h1">
                        CONVERTEX
                    </DynamicLinkText>
                </div>
                <div className="flex items-center gap-2 sm:ml-4">

                    <SocialIconButton href="https://github.com/Thiago0018/" icon="github" size="sm" />
                    <SocialIconButton href="https://www.linkedin.com/in/seu-usuario" icon="linkedin" size="sm" />
                    <SocialIconButton href="mailto:seu.email@exemplo.com" icon="gmail" size="sm" />

                </div>
            </div>
        </footer>
    );
}