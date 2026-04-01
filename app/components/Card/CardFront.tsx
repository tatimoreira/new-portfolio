import ParagraphText from "../ParagraphText/ParagraphText";
import { GithubIcon } from "../Icons/GithubIcon";
import { LinkedInLogo } from "../Icons/LinkedInLogo";
import Button from "../Button/Button";
import { Theme, useTheme } from "~/utils/theme-provider";
import { DocumentIcon } from "../Icons/DocumentIcon";

interface CardFrontProps {
    onFlip: () => void;
}

export default function CardFront({ onFlip }: CardFrontProps) {
    const [theme] = useTheme();

    return (
        <div className="absolute w-full h-full rounded-2xl shadow-lg flex items-center justify-center backface-hidden bg-white/55 dark:bg-white/10 backdrop-blur-xl dark:backdrop-blur-md border border-white/80 dark:border-white/25">
            <div className="p-5 sm:p-8 text-center">
                <h1 className="font-work text-3xl sm:text-5xl font-extrabold text-[#f5b1cc] leading-tight">
                    Tatiana Moreira
                </h1>
                <p className="font-work text-2xl sm:text-4xl font-bold text-light-text-color dark:text-dark-text-color leading-tight">
                    Software Developer
                </p>
                <ParagraphText>Crafting web experiences</ParagraphText>
                <div className="flex mb-4 mt-4 justify-center gap-4">
                    <a href="https://github.com/tatimoreira" target="_blank" rel="noopener noreferrer">
                        <GithubIcon fillColor={theme === Theme.LIGHT ? "black" : "white"} />
                    </a>
                    <a href="https://www.linkedin.com/in/tmoreirab/" target="_blank" rel="noopener noreferrer">
                        <LinkedInLogo fillColor={theme === Theme.LIGHT ? "black" : "white"} />
                    </a>
                </div>
                <div className="flex gap-4 justify-center flex-wrap">
                    <Button
                        onClick={() => { const a = document.createElement('a'); a.href = '/resume/Tatiana_Moreira_Resume.pdf'; a.download = 'Tatiana_Moreira_Resume.pdf'; a.click(); }}
                        icon={<DocumentIcon fillColor="#f5b1cc" />}
                    >
                        Resume
                    </Button>
                    <Button onClick={onFlip} icon={<span>✨</span>}>
                        Ask me
                    </Button>
                </div>
            </div>
        </div>
    );
}
