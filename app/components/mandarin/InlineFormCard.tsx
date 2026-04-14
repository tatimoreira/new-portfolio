interface InlineFormCardProps {
  children: React.ReactNode;
  className?: string;
}

export function InlineFormCard({ children, className = "" }: InlineFormCardProps) {
  return (
    <div className={`rounded-xl border border-sub-color/30 bg-sub-color/5 p-3 ${className}`}>
      {children}
    </div>
  );
}
