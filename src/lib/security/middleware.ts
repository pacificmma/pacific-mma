import { auth } from '@/utils/fireBaseAuthProvider';
import { User } from 'firebase/auth';

export interface SecurityContext {
  user: User | null;
  isAuthenticated: boolean;
  role?: string;
  permissions?: string[];
}

export class SecurityMiddleware {
  private static instance: SecurityMiddleware;
  private rateLimitMap = new Map<string, { count: number; resetTime: number }>();
  private readonly RATE_LIMIT_WINDOW = 60000; // 1 minute
  private readonly MAX_REQUESTS = 60; // 60 requests per minute

  private constructor() {}

  static getInstance(): SecurityMiddleware {
    if (!SecurityMiddleware.instance) {
      SecurityMiddleware.instance = new SecurityMiddleware();
    }
    return SecurityMiddleware.instance;
  }

  // Rate limiting
  checkRateLimit(identifier: string): boolean {
    const now = Date.now();
    const limit = this.rateLimitMap.get(identifier);

    if (!limit || now > limit.resetTime) {
      this.rateLimitMap.set(identifier, {
        count: 1,
        resetTime: now + this.RATE_LIMIT_WINDOW
      });
      return true;
    }

    if (limit.count >= this.MAX_REQUESTS) {
      return false;
    }

    limit.count++;
    return true;
  }

  // Input sanitization
  sanitizeInput(input: any): any {
    if (typeof input === 'string') {
      // Remove potential XSS attempts
      return input
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .trim();
    }
    
    if (Array.isArray(input)) {
      return input.map(item => this.sanitizeInput(item));
    }
    
    if (input && typeof input === 'object') {
      const sanitized: any = {};
      for (const key in input) {
        sanitized[key] = this.sanitizeInput(input[key]);
      }
      return sanitized;
    }
    
    return input;
  }

  // Validate request origin
  validateOrigin(origin: string | null): boolean {
    const allowedOrigins = [
      process.env.NEXT_PUBLIC_APP_URL,
      'http://localhost:3000',
      'http://localhost:3001'
    ].filter(Boolean);

    if (!origin) return false;
    return allowedOrigins.includes(origin);
  }

  // Get current user with claims
  async getCurrentUserWithClaims(): Promise<SecurityContext> {
    const user = auth.currentUser;
    
    if (!user) {
      return {
        user: null,
        isAuthenticated: false
      };
    }

    const idTokenResult = await user.getIdTokenResult();
    
    return {
      user,
      isAuthenticated: true,
      role: idTokenResult.claims.role as string,
      permissions: idTokenResult.claims.permissions as string[]
    };
  }

  // Check permission
  async hasPermission(permission: string): Promise<boolean> {
    const context = await this.getCurrentUserWithClaims();
    
    if (!context.isAuthenticated) return false;
    
    // Admin has all permissions
    if (context.role === 'admin') return true;
    
    // Check specific permissions
    return context.permissions?.includes(permission) || false;
  }

  // Validate Firebase ID token
  async validateToken(token: string): Promise<boolean> {
    try {
      const user = auth.currentUser;
      if (!user) return false;
      
      const currentToken = await user.getIdToken();
      return currentToken === token;
    } catch {
      return false;
    }
  }
}

export const securityMiddleware = SecurityMiddleware.getInstance();