interface LevelBarProps {
  level: number;
  xp: number;
}

export default function LevelBar({ level, xp }: LevelBarProps) {
  // Calculate the current XP progress within the current level (0-100)
  const currentLevelXP = xp % 100;
  const progressPercentage = currentLevelXP;

  return (
    <div className="w-full space-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-foreground">
            Level {level}
          </span>
          <span className="text-xs text-muted-foreground">
            {currentLevelXP}/100 XP
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
