/**
 * Validation utilities for Firebase Functions
 */

interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number format
 */
export function isValidPhone(phone: string): boolean {
  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');
  // Check if it's between 10 and 15 digits
  return cleanPhone.length >= 10 && cleanPhone.length <= 15;
}

/**
 * Validate notify request data
 */
export function validateNotifyRequest(data: any): ValidationResult {
  // Check required fields
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters' };
  }

  if (!data.email || !isValidEmail(data.email)) {
    return { valid: false, error: 'Invalid email address' };
  }

  if (!data.phone || !isValidPhone(data.phone)) {
    return { valid: false, error: 'Invalid phone number' };
  }

  if (!data.destinationCountry || typeof data.destinationCountry !== 'string') {
    return { valid: false, error: 'Destination country is required' };
  }

  if (!data.destinationTitle || typeof data.destinationTitle !== 'string') {
    return { valid: false, error: 'Destination title is required' };
  }

  return { valid: true };
}

/**
 * Sanitize user input
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>]/g, ''); // Remove < and > characters
}

/**
 * Validate destination availability update
 */
export function validateDestinationUpdate(data: any): ValidationResult {
  if (!data.destinationId || typeof data.destinationId !== 'string') {
    return { valid: false, error: 'Destination ID is required' };
  }

  if (typeof data.available !== 'boolean') {
    return { valid: false, error: 'Availability status must be a boolean' };
  }

  // Optional fields validation
  if (data.price !== undefined) {
    if (typeof data.price !== 'number' || data.price < 0) {
      return { valid: false, error: 'Price must be a positive number' };
    }
  }

  if (data.startDate !== undefined) {
    const date = new Date(data.startDate);
    if (isNaN(date.getTime())) {
      return { valid: false, error: 'Invalid start date' };
    }
  }

  return { valid: true };
}