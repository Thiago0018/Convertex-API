import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { FormatOption } from "../components/sections/FormatOption";
import { ImageSelectorButton } from "../components/ui/ImageSelectorButton";
import { OcrActionGroup } from "../components/ui/OcrActionGroup";
import { OcrSection } from '../components/sections/OcrSection';

export function Home() {
    return (
        // 1. Grid com 3 linhas: Header (auto), Meio (1fr = o que sobrar), Footer (auto)
        <div className="grid h-dvh w-full grid-rows-[auto_1fr_auto] bg-amber-950 overflow-hidden">

            <Header />

            <OcrSection />

            <Footer />

        </div>
    );
}
