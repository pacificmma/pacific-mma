import { NextRequest } from 'next/server';
import { ApiMiddleware } from '@/lib/api/middleware';
import { securityMiddleware } from '@/lib/security/middleware';
import { createValidationError } from '@/lib/errors/handler';

// GET /api/classes - Public endpoint
export async function GET(request: NextRequest) {
  return ApiMiddleware.withPublic(request, async (req) => {
    try {
      // Example: Get query parameters
      const { searchParams } = new URL(req.url);
      const level = searchParams.get('level');
      const instructor = searchParams.get('instructor');

      // Sanitize inputs
      const sanitizedLevel = level ? securityMiddleware.sanitizeInput(level) : null;
      const sanitizedInstructor = instructor ? securityMiddleware.sanitizeInput(instructor) : null;

      // TODO: Fetch classes from Firestore
      // const classes = await classService.getClasses({
      //   level: sanitizedLevel,
      //   instructor: sanitizedInstructor
      // });

      return {
        success: true,
        data: {
          classes: [],
          filters: {
            level: sanitizedLevel,
            instructor: sanitizedInstructor
          }
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw error;
    }
  });
}

// POST /api/classes - Requires instructor role
export async function POST(request: NextRequest) {
  return ApiMiddleware.withRole(request, 'instructor', async (req, context) => {
    try {
      const body = await req.json();
      
      // Sanitize input
      const sanitizedData = securityMiddleware.sanitizeInput(body);
      
      // Validate required fields
      if (!sanitizedData.title || !sanitizedData.instructor || !sanitizedData.date) {
        throw createValidationError('Missing required fields', {
          required: ['title', 'instructor', 'date']
        });
      }

      // TODO: Create class in Firestore
      // const classId = await classService.addClass({
      //   ...sanitizedData,
      //   createdBy: context.user.uid
      // });

      return {
        success: true,
        data: {
          message: 'Class created successfully',
          classId: 'temp-id',
          createdBy: context.user?.uid
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw error;
    }
  });
}