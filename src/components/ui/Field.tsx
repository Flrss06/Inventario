import type { ReactNode } from 'react';

export const claseInput =
    'w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 font-normal text-body outline-none transition focus:border-accent';

export function Field({ label, children, className = '' }: { label: ReactNode; children: ReactNode; className?: string }) {
    return (
        <label className={`mb-4 flex flex-col gap-1.5 text-sm font-semibold text-ink ${className}`}>
            <span>{label}</span>
            {children}
        </label>
    );
}

export function ErrorBox({ children }: { children: ReactNode }) {
    return (
        <div role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
            {children}
        </div>
    );
}
