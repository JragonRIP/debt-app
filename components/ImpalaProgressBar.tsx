"use client";

import Image from "next/image";

interface ImpalaProgressBarProps {
  percent: number;
}

const CAR_WIDTH = 88;

export function ImpalaProgressBar({ percent }: ImpalaProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percent));
  const carLeft = `calc(${clamped}% - ${CAR_WIDTH / 2}px)`;

  return (
    <div className="relative mt-6">
      <div className="mb-2 flex justify-between text-xs font-medium uppercase tracking-widest text-chrome/70">
        <span>Paid off</span>
        <span className="text-chrome-bright">{clamped.toFixed(1)}%</span>
      </div>

      <div className="relative pt-9 pb-1">
        <div
          className="pointer-events-none absolute top-0 z-10 transition-all duration-700 ease-out"
          style={{ left: carLeft, width: CAR_WIDTH }}
          aria-hidden
        >
          <Image
            src="/impala-side.png"
            alt=""
            width={176}
            height={64}
            className="h-10 w-[88px] object-contain object-left mix-blend-multiply drop-shadow-[0_4px_12px_rgba(0,0,0,0.55)]"
            priority
          />
        </div>

        <div className="relative h-3 overflow-hidden rounded-full border border-chrome/35 bg-forest-950 shadow-inner">
          <div
            className="chrome-bar absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${clamped}%` }}
          />
        </div>
      </div>
    </div>
  );
}
