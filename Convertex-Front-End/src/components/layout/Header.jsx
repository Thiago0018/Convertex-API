import { ClickableText } from '../ui/ClickableText';
import { Avatar } from '../ui/Avatar';
import { DynamicLinkText } from '../ui/DynamicLinkText';

export function Header() {
    return (
        <header className="Header">
            <div className="flex min-h-20 w-full flex-col items-stretch justify-between bg-[#242d3e] sm:flex-row sm:items-center">

                <div className="bg-[#242d3e] p-5 text-white sm:ml-5 sm:p-7" >
                    <DynamicLinkText to="/" variant="secondary" as="h1">
                        CONVERTEX
                    </DynamicLinkText>
                </div>
                <div className="flex w-full flex-wrap items-center justify-start gap-3 bg-[#242d3e] p-4 text-white sm:w-auto sm:justify-end sm:gap-5 sm:p-5" >

                    <ClickableText href="/" variant="default">feedback</ClickableText>
                    <ClickableText href="/" variant="default">info projeto</ClickableText>
                    <ClickableText href="/" variant="default">tutorial</ClickableText>
                    <Avatar name="John Doe" status="online" />
                </div>

            </div>
        </header >
    )
}