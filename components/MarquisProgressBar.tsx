"use client";

import Image from "next/image";

interface MarquisProgressBarProps {
  percent: number;
}

const MARKER_W = 40;
const MARKER_H = 16;

export function MarquisProgressBar({ percent }: MarquisProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percent));
  const half = MARKER_W / 2;
  const carLeft = `clamp(${half}px, ${clamped}%, calc(100% - ${half}px))`;

  return (
    <div className="relative mt-6">
      <div className="mb-2 flex justify-between text-xs font-medium uppercase tracking-widest text-bronze-bright/70">
        <span>Paid off</span>
        <span className="font-digital text-sm tracking-widest text-dash-green drop-shadow-[0_0_8px_rgba(57,255,120,0.55)]">
          {clamped.toFixed(1)}%
        </span>
      </div>

      <div className="relative">
        <div className="relative h-3 overflow-hidden rounded-full border border-bronze/40 bg-dash-950 shadow-inner">
          <div
            className="bronze-bar absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${clamped}%` }}
          />
        </div>

        <div
          className="pointer-events-none absolute top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transition-[left] duration-700 ease-out"
          style={{ left: carLeft, width: MARKER_W, height: MARKER_H }}
          aria-hidden
        >
          <Image
            src="/marquis-side.png"
            alt=""
            width={160}
            height={64}
            className="h-4 w-10 object-contain object-center drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]"
            priority
          />
        </div>
      </div>
    </div>
  );
}
