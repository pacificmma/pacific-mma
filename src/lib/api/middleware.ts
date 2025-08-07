import { NextRequest, NextResponse } from 'next/server';
import { securityMiddleware } from '@/lib/security/middleware';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export class ApiMiddleware {
  // Wrap API handler with security checks
  static async withAuth<T>(
    request: NextRequest,
    handler: (req: NextRequest, context: any) => Promise<ApiResponse<T>>
  ): Promise<NextResponse> {
    try {
      // Check rate limiting
      const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                       request.headers.get('x-real-ip') || 
                       'unknown';
      if (!securityMiddleware.checkRateLimit(clientIp)) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Too many requests', 
            timestamp: new Date().toISOString() 
          },
          { status: 429 }
        );
      }

      // Validate origin in production
      if (process.env.NODE_ENV === 'production') {
        const origin = request.headers.get('origin');
        if (!securityMiddleware.validateOrigin(origin)) {
          return NextResponse.json(
            { 
              success: false, 
              error: 'Invalid origin', 
              timestamp: new Date().toISOString() 
            },
            { status: 403 }
          );
        }
      }

      // Check authentication
      const authHeader = request.headers.get('authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Unauthorized', 
            timestamp: new Date().toISOString() 
          },
          { status: 401 }
        );
      }

      const token = authHeader.substring(7);
      const isValid = await securityMiddleware.validateToken(token);
      
      if (!isValid) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Invalid token', 
            timestamp: new Date().toISOString() 
          },
          { status: 401 }
        );
      }

      // Get user context
      const context = await securityMiddleware.getCurrentUserWithClaims();

      // Execute handler
      const result = await handler(request, context);
      
      return NextResponse.json(result);
    } catch (error) {
      console.error('API Error:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Internal server error', 
          timestamp: new Date().toISOString() 
        },
        { status: 500 }
      );
    }
  }

  // Public endpoint wrapper (no auth required but still has rate limiting)
  static async withPublic<T>(
    request: NextRequest,
    handler: (req: NextRequest) => Promise<ApiResponse<T>>
  ): Promise<NextResponse> {
    try {
      // Check rate limiting
      const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                       request.headers.get('x-real-ip') || 
                       'unknown';
      if (!securityMiddleware.checkRateLimit(clientIp)) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Too many requests', 
            timestamp: new Date().toISOString() 
          },
          { status: 429 }
        );
      }

      // Execute handler
      const result = await handler(request);
      
      return NextResponse.json(result);
    } catch (error) {
      console.error('API Error:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Internal server error', 
          timestamp: new Date().toISOString() 
        },
        { status: 500 }
      );
    }
  }

  // Role-based access control
  static async withRole<T>(
    request: NextRequest,
    requiredRole: string,
    handler: (req: NextRequest, context: any) => Promise<ApiResponse<T>>
  ): Promise<NextResponse> {
    return this.withAuth(request, async (req, context) => {
      if (context.role !== requiredRole && context.role !== 'admin') {
        return {
          success: false,
          error: 'Insufficient permissions',
          timestamp: new Date().toISOString()
        };
      }
      return handler(req, context);
    });
  }

  // Permission-based access control  
  static async withPermission<T>(
    request: NextRequest,
    requiredPermission: string,
    handler: (req: NextRequest, context: any) => Promise<ApiResponse<T>>
  ): Promise<NextResponse> {
    return this.withAuth(request, async (req, context) => {
      const hasPermission = await securityMiddleware.hasPermission(requiredPermission);
      if (!hasPermission) {
        return {
          success: false,
          error: 'Insufficient permissions',
          timestamp: new Date().toISOString()
        };
      }
      return handler(req, context);
    });
  }
}