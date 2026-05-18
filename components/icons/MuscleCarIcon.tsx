interface MuscleCarIconProps {
  className?: string;
}

/** Low, long-hood coupe silhouette — classic muscle car profile */
export function MuscleCarIcon({ className = "h-4 w-4" }: MuscleCarIconProps) {
  return (
    <svg
      viewBox="0 0 40 18"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M3 13.5h2.2l.8-2.4h4.2l.6 2.4H13l-1.1-3.6H5.4L3 13.5z" />
      <path d="M6.5 8.8h19.5l1.8-2.6H8.4L6.5 8.8z" />
      <path d="M26.5 6.2h9.5l1.5 2.6h-6.8l-1-1.8-1-.9h-1.5l-1.2 3.1z" />
      <path d="M10.5 11.2h17.5l1 2.3H12.2l-1.7-2.3z" opacity="0.9" />
      <path d="M12 6.8c3-1.1 6.2-1.3 9.8-.7l3.2.7c1 .3 1.8.8 2.4 1.4l.6.8h-2.4l-1-1.4c-.6-.7-1.4-1.2-2.4-1.3-3.2-.6-6.3-.4-9.2.6l-2 .9z" />
      <circle cx="8.5" cy="14" r="2.4" fill="none" stroke="currentColor" strokeWidth="1.15" />
      <circle cx="8.5" cy="14" r="0.85" />
      <circle cx="30.5" cy="14" r="2.4" fill="none" stroke="currentColor" strokeWidth="1.15" />
      <circle cx="30.5" cy="14" r="0.85" />
    </svg>
  );
}
