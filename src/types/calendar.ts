// src/types/calendar.ts
export interface ClassInstance {
    id: string;
    classId: string;
    instructorId: string;
    instructorName: string;
    startTime: Date;
    endTime: Date;
    capacity: number;
    enrolledCount: number;
    status: 'active' | 'cancelled' | 'completed';
    location: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface ClassSchedule {
    id: string;
    className: string;
    description: string;
    instructorId: string;
    instructorName: string;
    duration: number; // minutes
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    category: string;
    maxCapacity: number;
    color: string; // for UI theming
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface MergedClassData {
    id: string;
    className: string;
    instructorName: string;
    startTime: Date;
    endTime: Date;
    category: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    enrolledCount: number;
    capacity: number;
    color: string;
    location: string;
    status: 'active' | 'cancelled' | 'completed';
  }
  
  export interface ClassCalendarProps {
    showInstructor?: boolean;
    showCapacity?: boolean;
    allowNavigation?: boolean;
    initialDate?: Date;
    onClassClick?: (classData: MergedClassData) => void;
    onDateChange?: (date: Date) => void;
  }
  
  export interface UseClassCalendarOptions {
    refreshInterval?: number; // milliseconds
    maxRetries?: number;
    cacheTime?: number; // milliseconds
  }
  
  export interface CalendarState {
    classData: MergedClassData[];
    loading: boolean;
    error: string | null;
    lastFetched: Date | null;
  }
  
 