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
      className={`marquis-card rounded-2xl border border-bronze/30 bg-dash-900/80 p-5 shadow-[inset_0_1px_0_rgba(226,192,138,0.12),0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-sm sm:p-6 ${className}`}
    >
      {(title || icon) && (
        <header className="mb-5 flex items-center gap-3">
          {icon && (
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-bronze/35 bg-bronze/10 text-bronze-bright">
              {icon}
            </span>
          )}
          {title && (
            <h2 className="font-display text-lg font-semibold tracking-wide text-bronze-bright">
              {title}
            </h2>
          )}
        </header>
      )}
      {children}
    </section>
  );
}
