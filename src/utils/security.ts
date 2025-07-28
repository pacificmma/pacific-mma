// src/utils/security.ts - CORRECTED VERSION
import DOMPurify from 'dompurify';

// 🛡️ INPUT SANITIZATION & VALIDATION
export class SecurityValidator {
  
  // XSS protection with input sanitization - Optimized with native DOMPurify
  static sanitizeInput(input: string): string {
    if (!input || typeof input !== 'string') return '';
    
    try {
      // Browser check - only works client-side
      if (typeof window === 'undefined') {
        // Server-side simple sanitization
        return input
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/javascript:/gi, '')
          .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
          .replace(/[<>]/g, '')
          .trim();
      }

      // Client-side using DOMPurify
      const sanitized = DOMPurify.sanitize(input, { 
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: [],
        KEEP_CONTENT: true // Keep content, only remove tags
      });
      
      // Extra security checks
      return sanitized
        .replace(/javascript:/gi, '')
        .replace(/data:/gi, '')
        .replace(/vbscript:/gi, '')
        .trim();
        
    } catch (error) {
      console.error('Sanitization error:', error);
      // Fallback: remove all potentially harmful characters
      return input.replace(/[<>'"&]/g, '').trim();
    }
  }

  // Safe HTML sanitization for rich content (blog posts, etc.)
  static sanitizeHTML(html: string): string {
    if (!html || typeof html !== 'string') return '';
    
    if (typeof window === 'undefined') {
      // Server-side fallback
      return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    }

    // Allowed HTML tags for rich content
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['p', 'br', 'b', 'i', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li'],
      ALLOWED_ATTR: ['class'],
      KEEP_CONTENT: true
    });
  }

  // Email validation - Production ready
  static validateEmail(email: string): boolean {
    if (!email || typeof email !== 'string') return false;
    
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const sanitizedEmail = this.sanitizeInput(email);
    
    return emailPattern.test(sanitizedEmail) && 
           sanitizedEmail.length <= 254 && 
           !sanitizedEmail.includes('..') && 
           !sanitizedEmail.startsWith('.') &&
           !sanitizedEmail.endsWith('.') &&
           !sanitizedEmail.includes(' ');
  }

  // International phone number validation
  static validatePhone(phone: string): boolean {
    if (!phone || typeof phone !== 'string') return false;
    
    const sanitizedPhone = this.sanitizeInput(phone).replace(/\D/g, '');
    
    // International standards: 7-15 digits
    // US: 10 digits, UK: 11 digits, International: varies
    return sanitizedPhone.length >= 7 && 
           sanitizedPhone.length <= 15 &&
           /^[0-9]+$/.test(sanitizedPhone);
  }

  // Safe string validation
  static validateString(str: string, minLength: number = 1, maxLength: number = 255): boolean {
    if (!str || typeof str !== 'string') return false;
    
    const sanitized = this.sanitizeInput(str);
    return sanitized.length >= minLength && 
           sanitized.length <= maxLength &&
           // SQL injection pattern check
           !/(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i.test(sanitized);
  }

  // Postal code validation (International)
  static validateZipCode(zipCode: string, country: string = 'US'): boolean {
    const sanitized = this.sanitizeInput(zipCode);
    
    switch (country.toUpperCase()) {
      case 'US':
        return /^\d{5}(-\d{4})?$/.test(sanitized); // US: 12345 or 12345-6789
      case 'CA':
        return /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i.test(sanitized); // Canada: K1A 0A6
      case 'UK':
      case 'GB':
        return /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i.test(sanitized); // UK: SW1A 1AA
      case 'AU':
        return /^\d{4}$/.test(sanitized); // Australia: 1234
      case 'TR':
        return /^\d{5}$/.test(sanitized); // Turkey: 34000
      case 'DE':
        return /^\d{5}$/.test(sanitized); // Germany: 12345
      case 'FR':
        return /^\d{5}$/.test(sanitized); // France: 75001
      default:
        return sanitized.length >= 3 && sanitized.length <= 10;
    }
  }

  // Safe database sanitization for Firestore
  static sanitizeForDatabase(obj: any): any {
    if (typeof obj === 'string') {
      return this.sanitizeInput(obj);
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.sanitizeForDatabase(item));
    }
    
    if (obj && typeof obj === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(obj)) {
        // Firestore field name safety
        const sanitizedKey = key.replace(/[.$#[\]/]/g, '_');
        sanitized[sanitizedKey] = this.sanitizeForDatabase(value);
      }
      return sanitized;
    }
    
    return obj;
  }

  // Mask sensitive data for logging
  static maskSensitiveData(obj: any): any {
    if (!obj || typeof obj !== 'object') return obj;
    
    const sensitiveFields = [
      'password', 'email', 'phone', 'phoneNumber', 'address', 
      'emergencyContact', 'creditCard', 'ssn', 'taxId', 'bankAccount'
    ];
    
    const masked = JSON.parse(JSON.stringify(obj)); // Deep clone
    
    for (const field of sensitiveFields) {
      if (masked[field]) {
        if (typeof masked[field] === 'string') {
          // Special masking for email: k***@g***.com
          if (field === 'email' && masked[field].includes('@')) {
            const [user, domain] = masked[field].split('@');
            masked[field] = `${user[0]}***@${domain[0]}***.${domain.split('.').pop()}`;
          } else {
            masked[field] = '***MASKED***';
          }
        } else {
          masked[field] = '[SENSITIVE_DATA_MASKED]';
        }
      }
    }
    
    return masked;
  }

  // URL validation
  static validateURL(url: string): boolean {
    if (!url || typeof url !== 'string') return false;
    
    try {
      const sanitizedUrl = this.sanitizeInput(url);
      const urlObj = new URL(sanitizedUrl);
      
      // Only allow HTTP/HTTPS protocols
      return ['http:', 'https:'].includes(urlObj.protocol);
    } catch {
      return false;
    }
  }
}

// 🔐 AUTHENTICATION SECURITY
export class AuthSecurity {
  
  // Memory-based rate limiting (use Redis in production)
  private static attempts: Map<string, number[]> = new Map();
  private static passwordAttempts: Map<string, number[]> = new Map();
  
  // Login attempt tracking
  static trackLoginAttempt(identifier: string): boolean {
    const now = Date.now();
    const windowMs = 15 * 60 * 1000; // 15 minutes
    const maxAttempts = 5; // 5 attempts allowed
    
    if (!this.attempts.has(identifier)) {
      this.attempts.set(identifier, []);
    }
    
    const userAttempts = this.attempts.get(identifier)!;
    
    // Clean old attempts
    const recentAttempts = userAttempts.filter(time => now - time < windowMs);
    this.attempts.set(identifier, recentAttempts);
    
    // Add new attempt
    recentAttempts.push(now);
    
    // Check limit
    if (recentAttempts.length > maxAttempts) {
      console.warn(`🚨 Rate limit exceeded for: ${identifier}`);
      return false;
    }
    
    return true;
  }

  // Password change attempt tracking
  static trackPasswordChangeAttempt(userId: string): boolean {
    const now = Date.now();
    const windowMs = 60 * 60 * 1000; // 1 hour
    const maxAttempts = 3; // 3 attempts allowed
    
    if (!this.passwordAttempts.has(userId)) {
      this.passwordAttempts.set(userId, []);
    }
    
    const userAttempts = this.passwordAttempts.get(userId)!;
    const recentAttempts = userAttempts.filter(time => now - time < windowMs);
    this.passwordAttempts.set(userId, recentAttempts);
    
    recentAttempts.push(now);
    
    return recentAttempts.length <= maxAttempts;
  }

  // Enhanced password strength validation
  static validatePasswordStrength(password: string): {
    isValid: boolean;
    errors: string[];
    score: number; // 0-100 strength score
    suggestions: string[];
  } {
    const errors: string[] = [];
    const suggestions: string[] = [];
    let score = 0;
    
    // Basic checks
    if (password.length >= 8) {
      score += 20;
    } else {
      errors.push('Must be at least 8 characters long');
      suggestions.push('Choose a longer password');
    }
    
    if (password.length >= 12) {
      score += 10; // Bonus for longer passwords
    }
    
    if (/[A-Z]/.test(password)) {
      score += 15;
    } else {
      errors.push('Must contain at least one uppercase letter');
      suggestions.push('Add uppercase letters (A-Z)');
    }
    
    if (/[a-z]/.test(password)) {
      score += 15;
    } else {
      errors.push('Must contain at least one lowercase letter');
      suggestions.push('Add lowercase letters (a-z)');
    }
    
    if (/\d/.test(password)) {
      score += 15;
    } else {
      errors.push('Must contain at least one number');
      suggestions.push('Add numbers (0-9)');
    }
    
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 15;
    } else {
      errors.push('Must contain at least one special character');
      suggestions.push('Add special characters (!@#$%^&*)');
    }
    
    // Character diversity bonus
    const uniqueChars = new Set(password).size;
    if (uniqueChars >= password.length * 0.7) {
      score += 10; // 70%+ unique character bonus
    }
    
    // Common password check
    const commonPasswords = [
      'password', '123456', 'qwerty', 'admin', 'password123',
      'welcome', 'login', 'test', 'user', 'changeme',
      '123456789', 'qwerty123', 'admin123', 'letmein',
      'monkey', 'dragon', 'master', 'football', 'baseball'
    ];
    
    if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
      errors.push('Contains common words or patterns');
      suggestions.push('Use a unique combination that\'s hard to guess');
      score = Math.min(score, 30); // Cap at 30 points
    }
    
    // Repeating character check
    if (/(.)\1{2,}/.test(password)) {
      errors.push('Contains too many repeating characters');
      suggestions.push('Use different characters');
      score -= 10;
    }
    
    // Sequential character check
    if (/123|abc|qwe|asd/i.test(password)) {
      errors.push('Contains sequential characters');
      suggestions.push('Use random character combinations');
      score -= 5;
    }
    
    return {
      isValid: errors.length === 0 && score >= 70,
      errors,
      score: Math.max(0, Math.min(100, score)),
      suggestions
    };
  }

  // Secure session token generation
  static generateSecureSessionToken(): string {
    if (typeof window !== 'undefined' && window.crypto) {
      const array = new Uint8Array(16);
      window.crypto.getRandomValues(array);
      const randomStr = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
      return `session_${Date.now()}_${randomStr}`;
    } else {
      // Fallback for older browsers
      const timestamp = Date.now().toString(36);
      const random1 = Math.random().toString(36).substring(2);
      const random2 = Math.random().toString(36).substring(2);
      return `session_${timestamp}_${random1}_${random2}`;
    }
  }

  // Password entropy calculation
  static calculatePasswordEntropy(password: string): number {
    let charset = 0;
    if (/[a-z]/.test(password)) charset += 26;
    if (/[A-Z]/.test(password)) charset += 26;
    if (/[0-9]/.test(password)) charset += 10;
    if (/[^a-zA-Z0-9]/.test(password)) charset += 32;
    
    return Math.log2(Math.pow(charset, password.length));
  }
}

// 🌐 NETWORK SECURITY
export class NetworkSecurity {
  
  // HTTPS enforcement
  static enforceHTTPS(): void {
    if (typeof window !== 'undefined' && 
        window.location.protocol !== 'https:' && 
        window.location.hostname !== 'localhost' &&
        !window.location.hostname.includes('127.0.0.1') &&
        !window.location.hostname.includes('192.168.') &&
        process.env.NODE_ENV === 'production') {
      
      console.warn('🔒 Redirecting to HTTPS...');
      window.location.href = window.location.href.replace('http:', 'https:');
    }
  }

  // Crypto-secure token generation
  static generateCSRFToken(): string {
    if (typeof window !== 'undefined' && window.crypto) {
      const array = new Uint8Array(32);
      window.crypto.getRandomValues(array);
      return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    } else {
      // Fallback for Node.js or older browsers
      return Date.now().toString(36) + Math.random().toString(36).substring(2);
    }
  }

  // Secure API headers
  static getSecureHeaders(csrfToken?: string): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Accept': 'application/json'
    };
    
    if (csrfToken) {
      headers['X-CSRF-Token'] = csrfToken;
    }
    
    return headers;
  }

  // Basic client fingerprinting
  static getDeviceFingerprint(): string {
    if (typeof window === 'undefined') return 'server';
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx?.fillText('fingerprint', 10, 10);
    
    const fingerprint = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screen: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      canvas: canvas.toDataURL().slice(-50) // Last 50 characters
    };
    
    return btoa(JSON.stringify(fingerprint)).slice(0, 32);
  }
}

// 📊 ENHANCED AUDIT LOGGING
export class SimpleAuditLogger {
  
  private static readonly MAX_LOGS = 200;
  private static readonly STORAGE_KEY = 'security_audit_logs';
  private static readonly SESSION_KEY = 'audit_session_id';
  
  // Log security events
  static logSecurityEvent(
    eventType: 'LOGIN' | 'LOGOUT' | 'REGISTER' | 'PASSWORD_CHANGE' | 'DATA_UPDATE' | 'SUSPICIOUS_ACTIVITY' | 'SYSTEM',
    userId: string,
    details: any = {},
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'MEDIUM'
  ): void {
    
    try {
      const logEntry = {
        id: NetworkSecurity.generateCSRFToken().slice(0, 8),
        timestamp: new Date().toISOString(),
        eventType,
        userId,
        severity,
        userAgent: navigator?.userAgent?.substring(0, 200) || 'Unknown',
        url: typeof window !== 'undefined' ? window.location.href : 'N/A',
        deviceFingerprint: NetworkSecurity.getDeviceFingerprint(),
        details: SecurityValidator.maskSensitiveData(details),
        sessionId: this.getOrCreateSessionId()
      };
      
      // Write to console (different levels based on severity)
      const prefix = this.getSeverityIcon(severity);
      const logMethod = severity === 'CRITICAL' ? 'error' : severity === 'HIGH' ? 'warn' : 'log';
      console[logMethod](`${prefix} Security Event [${eventType}]:`, logEntry);
      
      // Save to local storage (for development)
      if (typeof window !== 'undefined') {
        this.saveToLocalStorage(logEntry);
      }
      
      // Extra handling for critical events
      if (severity === 'CRITICAL') {
        this.handleCriticalEvent(logEntry);
      }
      
      // Warning for high severity events
      if (severity === 'HIGH') {
        this.handleHighSeverityEvent(logEntry);
      }
      
    } catch (error) {
      console.error('Audit logging failed:', error);
    }
  }

  private static getSeverityIcon(severity: string): string {
    switch (severity) {
      case 'CRITICAL': return '🚨';
      case 'HIGH': return '⚠️';
      case 'MEDIUM': return '📋';
      case 'LOW': return 'ℹ️';
      default: return '📝';
    }
  }

  private static getOrCreateSessionId(): string {
    if (typeof window === 'undefined') return 'server_session';
    
    let sessionId = sessionStorage.getItem(this.SESSION_KEY);
    if (!sessionId) {
      sessionId = NetworkSecurity.generateCSRFToken();
      sessionStorage.setItem(this.SESSION_KEY, sessionId);
    }
    return sessionId;
  }

  private static saveToLocalStorage(logEntry: any): void {
    try {
      const logs = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
      logs.push(logEntry);
      
      // Clean old logs
      if (logs.length > this.MAX_LOGS) {
        logs.splice(0, logs.length - this.MAX_LOGS);
      }
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(logs));
    } catch (error) {
      console.error('Local storage logging failed:', error);
    }
  }

  private static handleCriticalEvent(logEntry: any): void {
    console.error('🚨 CRITICAL SECURITY EVENT:', logEntry);
    
    // Production: add immediate notification system
    if (typeof window !== 'undefined') {
      // Browser notification (if user permission granted)
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Critical Security Alert', {
          body: `${logEntry.eventType} event detected`,
          icon: '/favicon.ico',
          tag: 'security-critical'
        });
      }
      
      // Development mode alert
      if (process.env.NODE_ENV === 'development') {
        setTimeout(() => {
          alert(`🚨 CRITICAL SECURITY EVENT: ${logEntry.eventType}`);
        }, 1000);
      }
    }
  }

  private static handleHighSeverityEvent(logEntry: any): void {
    console.warn('⚠️ HIGH SEVERITY SECURITY EVENT:', logEntry);
    
    // Increment counter for rate limiting
    const counterKey = `security_${logEntry.eventType}_count`;
    const count = parseInt(localStorage.getItem(counterKey) || '0') + 1;
    localStorage.setItem(counterKey, count.toString());
    
    // If more than 10 high severity events, escalate to critical
    if (count >= 10) {
      this.logSecurityEvent('SUSPICIOUS_ACTIVITY', logEntry.userId, {
        reason: 'Multiple high severity events',
        eventType: logEntry.eventType,
        count
      }, 'CRITICAL');
    }
  }

  // View audit logs (for development)
  static getAuditLogs(): any[] {
    if (typeof window === 'undefined') return [];
    
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  }

  // Filter logs by severity
  static getLogsBySeverity(severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'): any[] {
    return this.getAuditLogs().filter(log => log.severity === severity);
  }

  // Filter logs by event type
  static getLogsByEventType(eventType: string): any[] {
    return this.getAuditLogs().filter(log => log.eventType === eventType);
  }

  // Filter logs by user
  static getLogsByUser(userId: string): any[] {
    return this.getAuditLogs().filter(log => log.userId === userId);
  }

  // Clear audit logs
  static clearAuditLogs(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.STORAGE_KEY);
      sessionStorage.removeItem(this.SESSION_KEY);
      
      // Also clear security counters
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('security_') && key.endsWith('_count')) {
          localStorage.removeItem(key);
        }
      });
    }
  }

  // Security statistics
  static getSecurityStats(): {
    totalLogs: number;
    severityBreakdown: Record<string, number>;
    eventTypeBreakdown: Record<string, number>;
    recentActivity: any[];
  } {
    const logs = this.getAuditLogs();
    
    const severityBreakdown: Record<string, number> = {};
    const eventTypeBreakdown: Record<string, number> = {};
    
    logs.forEach(log => {
      severityBreakdown[log.severity] = (severityBreakdown[log.severity] || 0) + 1;
      eventTypeBreakdown[log.eventType] = (eventTypeBreakdown[log.eventType] || 0) + 1;
    });
    
    const recentActivity = logs
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);
    
    return {
      totalLogs: logs.length,
      severityBreakdown,
      eventTypeBreakdown,
      recentActivity
    };
  }
}

// 🚀 AUTO-INITIALIZE SECURITY
if (typeof window !== 'undefined') {
  // HTTPS enforcement
  NetworkSecurity.enforceHTTPS();
  
  // DOMPurify configuration (it's already imported, no need to check window)
  DOMPurify.setConfig({
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true
  });
  
  // Initial security event
  SimpleAuditLogger.logSecurityEvent('SYSTEM', 'anonymous', {
    message: 'Security utilities initialized with native DOMPurify',
    url: window.location.href,
    userAgent: navigator.userAgent.substring(0, 100)
  }, 'LOW');
}

// Easy usage default export
export default {
  SecurityValidator,
  AuthSecurity,
  NetworkSecurity,
  SimpleAuditLogger
};