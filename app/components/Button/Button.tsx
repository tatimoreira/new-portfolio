type ButtonProps = {
  children: string;
  icon?: JSX.Element;
  onClick: () => void;
}
export default function Button({ children, icon, onClick }: ButtonProps) {
  return <button onClick={onClick} className="border-2 rounded-2xl p-2 border-main-color text-main-color" >
    <div className="flex">
      <div className="mr-1">{icon}</div>
      {children}
    </div>
  </button>
}