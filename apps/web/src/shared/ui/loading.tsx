interface LoadingProps {
  text: string;
}

export function Loading({ text }: LoadingProps) {
  return (
    <div className="flex justify-center items-center min-h-screen font-console console-text">
      <div className="animate-pulse console-glow">{text}</div>
    </div>
  );
}
