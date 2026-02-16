/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number (allows digits, spaces, dashes, parens, plus sign)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[+]?[\d\s\-().]{7,20}$/;
  return phoneRegex.test(phone);
}

/**
 * Sanitize a string by trimming and limiting length
 */
export function sanitizeString(value: string, maxLength: number = 500): string {
  return value.trim().slice(0, maxLength);
}
