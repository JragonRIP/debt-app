"use client";

import Image from "next/image";

interface ImpalaProgressBarProps {
  percent: number;
}

const CAR_WIDTH = 96;
const CAR_HEIGHT = 44;
const BAR_HEIGHT = 12;

export function ImpalaProgressBar({ percent }: ImpalaProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percent));

  return (
    <div className="relative mt-6">
      <div className="mb-3 flex justify-between text-xs font-medium uppercase tracking-widest text-chrome/70">
        <span>Paid off</span>
        <span className="text-chrome-bright">{clamped.toFixed(1)}%</span>
      </div>

      <div
        className="relative w-full"
        style={{ height: CAR_HEIGHT + BAR_HEIGHT }}
      >
        {/* Chrome track */}
        <div
          className="absolute inset-x-0 bottom-0 overflow-hidden rounded-full border border-chrome/35 bg-forest-950 shadow-inner"
          style={{ height: BAR_HEIGHT }}
        >
          <div
            className="chrome-bar h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${clamped}%` }}
          />
        </div>

        {/* Car: centered on fill edge, wheels on the track */}
        <div
          className="pointer-events-none absolute z-10 flex items-end justify-center transition-[left] duration-700 ease-out"
          style={{
            left: `clamp(${CAR_WIDTH / 2}px, ${clamped}%, calc(100% - ${CAR_WIDTH / 2}px))`,
            bottom: BAR_HEIGHT,
            width: CAR_WIDTH,
            height: CAR_HEIGHT,
            transform: "translateX(-50%)",
          }}
          aria-hidden
        >
          <Image
            src="/impala-side.png"
            alt=""
            width={320}
            height={120}
            className="h-full w-full object-contain object-bottom drop-shadow-[0_4px_14px_rgba(0,0,0,0.5)]"
            priority
          />
        </div>
      </div>
    </div>
  );
}
