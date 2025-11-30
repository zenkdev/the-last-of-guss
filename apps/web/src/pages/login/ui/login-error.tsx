interface LoginErrorProps {
  error: string | null;
}

export function LoginError({ error }: LoginErrorProps) {
  if (!error) {
    return null;
  }

  return (
    <div className="p-3 mb-4 bg-red-900/30 border border-red-500 text-red-400 rounded text-sm console-border mt-4">
      {error}
    </div>
  );
}

