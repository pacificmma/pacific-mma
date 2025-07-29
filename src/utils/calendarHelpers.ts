// src/utils/calendarHelpers.ts
import { format, isSameDay, isToday } from 'date-fns';
import { MergedClassData } from '../types/calendar';

export const getClassesForDay = (
  classes: MergedClassData[], 
  day: Date
): MergedClassData[] => {
  return classes
    .filter(classItem => isSameDay(classItem.startTime, day))
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
};

export const formatClassTime = (startTime: Date, endTime: Date): string => {
  return `${format(startTime, 'HH:mm')} - ${format(endTime, 'HH:mm')}`;
};

export const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty) {
    case 'beginner': return '#4caf50'; // Green
    case 'intermediate': return '#ff9800'; // Orange  
    case 'advanced': return '#f44336'; // Red
    default: return '#9e9e9e'; // Grey
  }
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'active': return '#4caf50'; // Green
    case 'cancelled': return '#f44336'; // Red
    case 'completed': return '#9e9e9e'; // Grey
    default: return '#2196f3'; // Blue
  }
};

export const isClassToday = (classDate: Date): boolean => {
  return isToday(classDate);
};

export const getClassCapacityStatus = (enrolled: number, capacity: number): {
  percentage: number;
  status: 'low' | 'medium' | 'high' | 'full';
  color: string;
} => {
  const percentage = (enrolled / capacity) * 100;
  
  if (percentage >= 100) {
    return { percentage, status: 'full', color: '#f44336' };
  } else if (percentage >= 80) {
    return { percentage, status: 'high', color: '#ff9800' };
  } else if (percentage >= 50) {
    return { percentage, status: 'medium', color: '#2196f3' };
  } else {
    return { percentage, status: 'low', color: '#4caf50' };
  }
};