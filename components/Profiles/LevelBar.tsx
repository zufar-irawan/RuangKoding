interface LevelBarProps {
  level: number;
  xp: number;
}

export default function LevelBar({ level, xp }: LevelBarProps) {
  // Hitung Total XP yang dibutuhkan untuk naik dari level saat ini ke selanjutnya.
  const xpRequired = 100 + (level - 1) * 50;

  // Hitung persentase progress
  const progressPercentage = Math.min((xp / xpRequired) * 100, 100);

  return (
    <div className="w-full space-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-foreground">
            Level {level}
          </span>
          <span className="text-xs text-muted-foreground">
            {Math.floor(xp)}/{xpRequired} XP
          </span>
        </div>
      </div>

      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
        <div
          className="bg-primary h-full rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
}
