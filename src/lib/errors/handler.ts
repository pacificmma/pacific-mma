export enum ErrorCode {
  // Authentication errors
  UNAUTHORIZED = 'UNAUTHORIZED',
  INVALID_TOKEN = 'INVALID_TOKEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
  
  // Validation errors
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  INVALID_EMAIL = 'INVALID_EMAIL',
  INVALID_PHONE = 'INVALID_PHONE',
  
  // Resource errors
  NOT_FOUND = 'NOT_FOUND',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  CONFLICT = 'CONFLICT',
  
  // Rate limiting
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  
  // Database errors
  DATABASE_ERROR = 'DATABASE_ERROR',
  TRANSACTION_FAILED = 'TRANSACTION_FAILED',
  
  // External service errors
  FIREBASE_ERROR = 'FIREBASE_ERROR',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  
  // Generic errors
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  BAD_REQUEST = 'BAD_REQUEST'
}

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly metadata?: Record<string, any>;

  constructor(
    message: string,
    code: ErrorCode,
    statusCode: number = 500,
    isOperational: boolean = true,
    metadata?: Record<string, any>
  ) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.metadata = metadata;
    
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ErrorHandler {
  private static instance: ErrorHandler;
  private readonly isDevelopment = process.env.NODE_ENV === 'development';

  private constructor() {}

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  handle(error: Error | AppError): {
    message: string;
    code?: ErrorCode;
    statusCode: number;
    details?: any;
  } {
    // Log error
    this.logError(error);

    // Handle known operational errors
    if (error instanceof AppError && error.isOperational) {
      return {
        message: error.message,
        code: error.code,
        statusCode: error.statusCode,
        details: this.isDevelopment ? error.metadata : undefined
      };
    }

    // Handle Firebase errors
    if (this.isFirebaseError(error)) {
      return this.handleFirebaseError(error);
    }

    // Handle validation errors
    if (this.isValidationError(error)) {
      return {
        message: 'Validation failed',
        code: ErrorCode.INVALID_INPUT,
        statusCode: 400,
        details: this.isDevelopment ? error.message : undefined
      };
    }

    // Generic error response
    return {
      message: this.isDevelopment ? error.message : 'An unexpected error occurred',
      code: ErrorCode.INTERNAL_ERROR,
      statusCode: 500,
      details: this.isDevelopment ? error.stack : undefined
    };
  }

  private logError(error: Error | AppError): void {
    if (error instanceof AppError) {
      console.error(`[${error.code}] ${error.message}`, {
        statusCode: error.statusCode,
        metadata: error.metadata,
        stack: error.stack
      });
    } else {
      console.error('Unhandled error:', error);
    }
  }

  private isFirebaseError(error: any): boolean {
    return error.code && typeof error.code === 'string' && error.code.startsWith('auth/');
  }

  private handleFirebaseError(error: any): {
    message: string;
    code: ErrorCode;
    statusCode: number;
  } {
    const firebaseErrorMap: Record<string, { message: string; code: ErrorCode; statusCode: number }> = {
      'auth/invalid-email': {
        message: 'Invalid email address',
        code: ErrorCode.INVALID_EMAIL,
        statusCode: 400
      },
      'auth/user-disabled': {
        message: 'User account has been disabled',
        code: ErrorCode.UNAUTHORIZED,
        statusCode: 403
      },
      'auth/user-not-found': {
        message: 'User not found',
        code: ErrorCode.NOT_FOUND,
        statusCode: 404
      },
      'auth/wrong-password': {
        message: 'Invalid credentials',
        code: ErrorCode.UNAUTHORIZED,
        statusCode: 401
      },
      'auth/email-already-in-use': {
        message: 'Email already in use',
        code: ErrorCode.ALREADY_EXISTS,
        statusCode: 409
      },
      'auth/weak-password': {
        message: 'Password is too weak',
        code: ErrorCode.INVALID_INPUT,
        statusCode: 400
      },
      'auth/operation-not-allowed': {
        message: 'Operation not allowed',
        code: ErrorCode.INSUFFICIENT_PERMISSIONS,
        statusCode: 403
      },
      'auth/invalid-api-key': {
        message: 'Invalid API key',
        code: ErrorCode.UNAUTHORIZED,
        statusCode: 401
      },
      'auth/network-request-failed': {
        message: 'Network error occurred',
        code: ErrorCode.SERVICE_UNAVAILABLE,
        statusCode: 503
      },
      'auth/too-many-requests': {
        message: 'Too many requests. Please try again later',
        code: ErrorCode.RATE_LIMIT_EXCEEDED,
        statusCode: 429
      }
    };

    const knownError = firebaseErrorMap[error.code];
    if (knownError) {
      return knownError;
    }

    return {
      message: 'Firebase operation failed',
      code: ErrorCode.FIREBASE_ERROR,
      statusCode: 500
    };
  }

  private isValidationError(error: any): boolean {
    return error.name === 'ValidationError' || 
           error.name === 'ZodError' ||
           (error.errors && Array.isArray(error.errors));
  }
}

export const errorHandler = ErrorHandler.getInstance();

// Common error factories
export const createAuthError = (message: string = 'Authentication required') => 
  new AppError(message, ErrorCode.UNAUTHORIZED, 401);

export const createPermissionError = (message: string = 'Insufficient permissions') =>
  new AppError(message, ErrorCode.INSUFFICIENT_PERMISSIONS, 403);

export const createNotFoundError = (resource: string) =>
  new AppError(`${resource} not found`, ErrorCode.NOT_FOUND, 404);

export const createValidationError = (message: string, details?: any) =>
  new AppError(message, ErrorCode.INVALID_INPUT, 400, true, details);

export const createRateLimitError = () =>
  new AppError('Too many requests', ErrorCode.RATE_LIMIT_EXCEEDED, 429);

export const createDatabaseError = (message: string = 'Database operation failed') =>
  new AppError(message, ErrorCode.DATABASE_ERROR, 500);