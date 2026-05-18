import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  icon?: ReactNode;
}

export function Card({ children, className = "", title, icon }: CardProps) {
  return (
    <section
      className={`impala-card rounded-2xl border border-chrome/25 bg-forest-900/80 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-sm sm:p-6 ${className}`}
    >
      {(title || icon) && (
        <header className="mb-5 flex items-center gap-3">
          {icon && (
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-chrome/30 bg-chrome/10 text-chrome-bright">
              {icon}
            </span>
          )}
          {title && (
            <h2 className="font-display text-lg font-semibold tracking-wide text-white/95">
              {title}
            </h2>
          )}
        </header>
      )}
      {children}
    </section>
  );
}
