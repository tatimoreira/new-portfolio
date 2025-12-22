type PillPros = {
  text: string;
}
export default function Pill({ text }: PillPros) {
  return <span className="rounded-xl px-2 py-1 text-white border-1 bg-indigo-500 border-indigo-500" >{text}</span>

}