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

export function getPersonColorKeyByIndex(index: number): PersonColorKey {
  return PERSON_COLOR_KEYS[index % PERSON_COLOR_KEYS.length];
}

export function getPersonColorStyle(key: PersonColorKey): Record<string, string> {
  const vars = getPersonColorVars(key);

  return {
    '--person-color-base': `var(${vars.base})`,
    '--person-color-gradient-start': `var(${vars.gradientStart})`,
    '--person-color-gradient-end': `var(${vars.gradientEnd})`,
    '--person-color-tint': `var(${vars.tint})`,
    '--person-color-angle': `var(${vars.angle})`
  };
}
