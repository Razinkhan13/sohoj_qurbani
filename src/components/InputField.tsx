import React, { useId } from 'react';
import type { LucideIcon } from 'lucide-react';

interface InputFieldProps {
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  icon?: LucideIcon | null;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  type = 'number',
  placeholder,
  icon: Icon = null,
}) => {
  const inputId = useId();

  return (
    <div className="mb-5 group">
      <label
        htmlFor={inputId}
        className="block text-sm font-bold text-emerald-900 mb-2 transition-colors group-focus-within:text-amber-600"
      >
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div
            className="absolute left-4 top-3.5 text-emerald-400 group-focus-within:text-amber-500 transition-colors pointer-events-none"
            aria-hidden="true"
          >
            <Icon size={20} />
          </div>
        )}
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          {...(type === 'number' ? { min: '0' } : {})}
          className={`w-full bg-emerald-50/40 border-2 border-emerald-100 rounded-2xl py-3.5 px-5 focus:outline-none focus:ring-4 focus:ring-amber-400/20 focus:border-amber-400 transition-all text-emerald-950 font-semibold text-lg ${Icon ? 'pl-12' : ''}`}
        />
      </div>
    </div>
  );
};
