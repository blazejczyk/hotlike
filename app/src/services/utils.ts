import differenceInYears from 'date-fns/differenceInYears';

export function getAge(date: Date | string): number {
  return differenceInYears(new Date(), new Date(date));
}

export function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Password needs to have at least 8 characters including uppercase & lowercase letters, numbers and special characters.
 */
export function isValidPassword(password: string, minLength: number, maxLength: number): boolean {
  return password !== '' &&
    (password.length >= minLength) &&
    (password.length <= maxLength) &&
    (/[A-Z]/.test(password)) &&
    (/[a-z]/.test(password)) &&
    (/\d/.test(password)) &&
    (/[!@#$%^&*()]/.test(password));
}
