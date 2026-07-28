"use client";

import Image from "next/image";

interface TruckProgressBarProps {
  percent: number;
}

/** Small marker sized to sit inside the h-3 track (original layout) */
const MARKER_W = 34;
const MARKER_H = 14;

export function TruckProgressBar({ percent }: TruckProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percent));
  const half = MARKER_W / 2;
  const truckLeft = `clamp(${half}px, ${clamped}%, calc(100% - ${half}px))`;

  return (
    <div className="relative mt-6">
      <div className="mb-2 flex justify-between text-xs font-medium uppercase tracking-widest text-chrome/70">
        <span>Paid off</span>
        <span className="text-chrome-bright">{clamped.toFixed(1)}%</span>
      </div>

      <div className="relative">
        <div className="relative h-3 overflow-hidden rounded-full border border-chrome/35 bg-navy-950 shadow-inner">
          <div
            className="chrome-bar absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${clamped}%` }}
          />
        </div>

        <div
          className="pointer-events-none absolute top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transition-[left] duration-700 ease-out"
          style={{ left: truckLeft, width: MARKER_W, height: MARKER_H }}
          aria-hidden
        >
          <Image
            src="/truck-side.png"
            alt=""
            width={136}
            height={56}
            className="h-3.5 w-[2.125rem] object-contain object-center drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]"
            priority
          />
        </div>
      </div>
    </div>
  );
}
