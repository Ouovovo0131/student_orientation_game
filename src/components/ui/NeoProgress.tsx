interface NeoProgressProps {
  value: number;
  max: number;
}

export function NeoProgress({ value, max }: NeoProgressProps) {
  const safeMax = Math.max(max, 1);
  const ratio = Math.min(Math.max(value / safeMax, 0), 1);

  return (
    <div>
      <div className="mb-1 flex justify-between text-sm font-bold">
        <span>進度</span>
        <span>
          {value} / {max}
        </span>
      </div>
      <div className="h-5 border-4 border-black bg-white">
        <div
          className="h-full bg-[#3BEA7D] transition-all"
          style={{ width: `${ratio * 100}%` }}
          aria-label="目前闖關進度"
        />
      </div>
    </div>
  );
}