import crypto from 'crypto';
import differenceInYears from 'date-fns/differenceInYears';

export function getAge(date: Date | string): number {
  return differenceInYears(new Date(), new Date(date));
}

export function getHash(text: string, salt?: string): string {
  return crypto
    .createHash('sha256')
    .update(salt === undefined ? text : `${text}${salt}`)
    .digest('hex');
}

export function includesAll<T>(possibleValues: T[], values: T[]): boolean {
  const possibleValuesSet = new Set(possibleValues);
  return values.every((value) => possibleValuesSet.has(value));
}

export function generateCode() {
  return Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
}
