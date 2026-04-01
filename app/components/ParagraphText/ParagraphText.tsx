type ParagraphTextProps = {
  children: string;
}
export default function ParagraphText({ children }: ParagraphTextProps) {
  return <p className="mt-3 font-work text-lg sm:text-2xl font-extralight text-link-color dark:text-dark-sub-color" >{children}</p>

}