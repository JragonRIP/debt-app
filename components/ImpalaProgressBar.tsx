"use client";

import { MuscleCarIcon } from "./icons/MuscleCarIcon";

interface ImpalaProgressBarProps {
  percent: number;
}

export function ImpalaProgressBar({ percent }: ImpalaProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percent));
  const carLeft = `calc(${clamped}% - 18px)`;

  return (
    <div className="relative mt-6">
      <div className="mb-2 flex justify-between text-xs font-medium uppercase tracking-widest text-chrome/70">
        <span>Paid off</span>
        <span className="text-chrome-bright">{clamped.toFixed(1)}%</span>
      </div>
      <div className="relative h-3 overflow-hidden rounded-full border border-chrome/35 bg-forest-950 shadow-inner">
        <div
          className="chrome-bar absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${clamped}%` }}
        />
        <div
          className="absolute top-1/2 z-10 -translate-y-1/2 transition-all duration-700 ease-out"
          style={{ left: carLeft }}
          aria-hidden
        >
          <span className="flex h-8 w-9 items-center justify-center rounded-full border border-chrome/50 bg-gradient-to-b from-zinc-200 to-zinc-400 px-0.5 text-forest-950 shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
            <MuscleCarIcon className="h-3 w-6" />
          </span>
        </div>
      </div>
    </div>
  );
}
