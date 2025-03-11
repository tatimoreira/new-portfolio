type SubtitleTextProps = {
  children: string;
}
export default function SubtitleText({ children }: SubtitleTextProps) {
  return <h2 className="font-work text-3xl font-extrabold text-[#f5b1cc] " >{children}</h2>

}