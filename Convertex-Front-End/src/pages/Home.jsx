import { FormatOption } from "../components/sections/FormatOption";
import { SidebarRight } from "../components/sections/SidebarRight";
import { ImageSelectorButton } from "../components/ui/ImageSelectorButton";

export function Home() {
    return (
        <div className="flex flex-1 flex-col justify-center items-center md:flex-row ">
            <aside className="flex w-[25%] h-80 bg-[#88b0f6]">
                aside
            </aside>
            <div className="flex justify-center bg-amber-400 h-90 w-1.5 ">
                <FormatOption />
            </div>
            <div className="flex h-48 w-16 items-center justify-center">
                <ImageSelectorButton className="ml-4" />
            </div>
        </div>
    );
}
