const DURATION_MS = {
  s: 1000,
  m: 60 * 1000,
  h: 60 * 60 * 1000,
  d: 24 * 60 * 60 * 1000,
} as const;

export function durationToMs(duration: string): number {
  const amount = Number(duration.slice(0, -1));
  const unit = duration.at(-1) as keyof typeof DURATION_MS;
  return amount * DURATION_MS[unit];
}
