export function ProgressRing({ value }: { value: number }) {
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  return (
    <div className="relative grid h-16 w-16 place-items-center" aria-label={`${value}% of today complete`}>
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={radius} fill="none" stroke="currentColor" strokeWidth="4" className="text-white/10" />
        <circle cx="32" cy="32" r={radius} fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - value / 100)} className="text-[#b7f35b] transition-all duration-700" />
      </svg>
      <span className="text-sm font-semibold">{value}%</span>
    </div>
  );
}
