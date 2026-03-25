export const PERSON_COLOR_KEYS = [
  'person-1',
  'person-2',
  'person-3',
  'person-4',
  'person-5',
  'person-6'
] as const;

export type PersonColorKey = (typeof PERSON_COLOR_KEYS)[number];

export function getPersonColorVars(key: PersonColorKey) {
  return {
    base: `--${key}-base`,
    gradientStart: `--${key}-gradient-start`,
    gradientEnd: `--${key}-gradient-end`,
    tint: `--${key}-tint`,
    angle: `--${key}-gradient-angle`
  };
}

export function getEventTypeColorVar(colorVar: string) {
  return `var(${colorVar})`;
}
