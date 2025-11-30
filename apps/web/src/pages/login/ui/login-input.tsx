interface LoginInputProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
}

export function LoginInput({ id, label, type, value, onChange, required, disabled }: LoginInputProps) {
  return (
    <div className={id === 'password' ? 'mb-6' : 'mb-4'}>
      <label htmlFor={id} className="block mb-2 font-medium text-sm console-text">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className="w-full px-3 py-3 border-2 border-console-green rounded text-base box-border bg-console-bg text-console-green focus:outline-none focus:border-console-green-light focus:ring-2 focus:ring-console-green console-border disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  );
}

