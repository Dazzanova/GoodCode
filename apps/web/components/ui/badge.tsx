import { clsx } from "clsx";

const difficultyStyles: Record<string, string> = {
  EASY: "text-success",
  MEDIUM: "text-warning",
  HARD: "text-danger",
};

export function DifficultyBadge({ difficulty }: { difficulty: string }) {
  return (
    <span className={clsx("font-mono text-xs font-medium", difficultyStyles[difficulty])}>
      {difficulty}
    </span>
  );
}