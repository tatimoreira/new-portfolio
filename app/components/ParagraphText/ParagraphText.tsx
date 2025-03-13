type ParagraphTextProps = {
  children: string;
}
export default function ParagraphText({ children }: ParagraphTextProps) {
  return <p className="mt-3.5 font-work text-lg sm:text-2xl font-extralight text-light-text-color dark:text-dark-text-color" >{children}</p>

}