interface LevelBarProps {
  level: number;
  xp: number;
}

export default function LevelBar({ level, xp }: LevelBarProps) {
  function xpNeededForLevel(level: number) {
    return 100 + (level - 1) * 50;
  }

  function totalXpBeforeLevel(level: number) {
    let total = 0;
    for (let i = 1; i < level; i++) {
      total += xpNeededForLevel(i);
    }
    return total;
  }

  const xpForThisLevel = xpNeededForLevel(level);
  const xpBefore = totalXpBeforeLevel(level);
  const xpProgress = xp - xpBefore;

  const progressPercentage = Math.min(
    Math.max((xpProgress / xpForThisLevel) * 100, 0),
    100,
  );

  return (
    <div className="w-full space-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-foreground">
            Level {level}
          </span>
          <span className="text-xs text-muted-foreground">
            {xpProgress}/{xpForThisLevel} XP
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
