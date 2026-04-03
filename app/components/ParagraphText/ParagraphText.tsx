type ParagraphTextProps = {
  children: string;
}
export default function ParagraphText({ children }: ParagraphTextProps) {
  return <p className="mt-3 font-work text-lg sm:text-2xl font-extralight text-accent-color" >{children}</p>

}