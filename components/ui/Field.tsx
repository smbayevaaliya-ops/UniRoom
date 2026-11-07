import { useId } from "react";
import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

const controlClasses =
  "w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 disabled:bg-slate-100";

function controlBorder(error?: string): string {
  return error
    ? "border-red-400 focus-visible:outline-red-600"
    : "border-slate-300";
}

type FieldShellProps = {
  label: string;
  error?: string;
  hint?: string;
};

function FieldShell({
  id,
  label,
  error,
  hint,
  children,
}: FieldShellProps & { id: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-slate-500">{hint}</p>
      ) : null}
    </div>
  );
}

export function TextField({
  label,
  error,
  hint,
  ...props
}: FieldShellProps & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} error={error} hint={hint}>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${controlClasses} ${controlBorder(error)}`}
        {...props}
      />
    </FieldShell>
  );
}

export function SelectField({
  label,
  error,
  hint,
  children,
  ...props
}: FieldShellProps & SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} error={error} hint={hint}>
      <select
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${controlClasses} ${controlBorder(error)}`}
        {...props}
      >
        {children}
      </select>
    </FieldShell>
  );
}

export function TextAreaField({
  label,
  error,
  hint,
  ...props
}: FieldShellProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} error={error} hint={hint}>
      <textarea
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${controlClasses} ${controlBorder(error)}`}
        {...props}
      />
    </FieldShell>
  );
}
