 // src/hooks/useClassCalendar.ts
 import { useState, useEffect, useCallback, useRef } from 'react';
 import { 
   collection, 
   query, 
   where, 
   getDocs, 
   orderBy,
   Timestamp 
 } from 'firebase/firestore';
 import { startOfWeek, endOfWeek } from 'date-fns';
 import { db } from '../providers/fireBaseAuthProvider';
 import { SecurityValidator } from '../utils/security';
 import { 
   ClassInstance, 
   ClassSchedule, 
   MergedClassData, 
   UseClassCalendarOptions,
   CalendarState 
 } from '../types/calendar';
 
 export const useClassCalendar = (
   currentWeek: Date,
   options: UseClassCalendarOptions = {}
 ) => {
   const {
     refreshInterval = 30000, // 30 seconds
     maxRetries = 3,
     cacheTime = 300000, // 5 minutes
   } = options;
 
   const [state, setState] = useState<CalendarState>({
     classData: [],
     loading: true,
     error: null,
     lastFetched: null,
   });
 
   const retryCount = useRef(0);
   const cacheRef = useRef<Map<string, { data: MergedClassData[]; timestamp: number }>>(new Map());
   const abortController = useRef<AbortController | null>(null);
 
   // 🔒 Security: Input sanitization
   const sanitizeDate = useCallback((date: Date): Date => {
     try {
       const sanitized = new Date(date);
       if (isNaN(sanitized.getTime())) {
         throw new Error('Invalid date');
       }
       return sanitized;
     } catch {
       return new Date();
     }
   }, []);
 
   // Calculate week bounds
   const weekStart = startOfWeek(sanitizeDate(currentWeek), { weekStartsOn: 1 });
   const weekEnd = endOfWeek(sanitizeDate(currentWeek), { weekStartsOn: 1 });
   const cacheKey = `${weekStart.toISOString()}-${weekEnd.toISOString()}`;
 
   // 🔒 Security: Rate limiting and caching
   const checkCache = useCallback((): MergedClassData[] | null => {
     const cached = cacheRef.current.get(cacheKey);
     if (cached && (Date.now() - cached.timestamp) < cacheTime) {
       return cached.data;
     }
     return null;
   }, [cacheKey, cacheTime]);
 
   // 🔒 Security: Secure data fetching with comprehensive error handling
   const fetchClassData = useCallback(async (): Promise<void> => {
     try {
       // Cancel previous request
       if (abortController.current) {
         abortController.current.abort();
       }
       abortController.current = new AbortController();
 
       setState(prev => ({ ...prev, loading: true, error: null }));
 
       // Check cache first
       const cachedData = checkCache();
       if (cachedData) {
         setState(prev => ({
           ...prev,
           classData: cachedData,
           loading: false,
           lastFetched: new Date(),
         }));
         return;
       }
 
       // 🔒 Security: Validate date range to prevent excessive queries
       const daysDiff = Math.abs((weekEnd.getTime() - weekStart.getTime()) / (1000 * 60 * 60 * 24));
       if (daysDiff > 7) {
         throw new Error('Invalid date range');
       }
 
       // 🔒 Security: Rate limiting
       if (retryCount.current > maxRetries) {
         throw new Error('Too many retry attempts. Please try again later.');
       }
 
       // Fetch class instances for the week
       const instancesQuery = query(
         collection(db, 'classInstance'),
         where('startTime', '>=', Timestamp.fromDate(weekStart)),
         where('startTime', '<=', Timestamp.fromDate(weekEnd)),
         where('status', '==', 'active'),
         orderBy('startTime', 'asc')
       );
 
       const instancesSnapshot = await getDocs(instancesQuery);
       
       if (instancesSnapshot.empty) {
         const emptyData: MergedClassData[] = [];
         setState(prev => ({
           ...prev,
           classData: emptyData,
           loading: false,
           lastFetched: new Date(),
         }));
         cacheRef.current.set(cacheKey, { data: emptyData, timestamp: Date.now() });
         return;
       }
 
       // Extract unique class IDs to fetch schedules
       const classIds = Array.from(new Set(
         instancesSnapshot.docs.map(doc => {
           const data = doc.data();
           return SecurityValidator.sanitizeInput(data.classId);
         })
       ));
 
       // Fetch class schedules
       const schedulesQuery = query(
         collection(db, 'classSchedules'),
         where('isActive', '==', true)
       );
 
       const schedulesSnapshot = await getDocs(schedulesQuery);
       
       // Create lookup map for schedules
       const schedulesMap = new Map<string, ClassSchedule>();
       schedulesSnapshot.docs.forEach(doc => {
         const data = doc.data();
         
         // 🔒 Security: Sanitize all input data
         const schedule: ClassSchedule = {
           id: SecurityValidator.sanitizeInput(doc.id),
           className: SecurityValidator.sanitizeInput(data.className || ''),
           description: SecurityValidator.sanitizeInput(data.description || ''),
           instructorId: SecurityValidator.sanitizeInput(data.instructorId || ''),
           instructorName: SecurityValidator.sanitizeInput(data.instructorName || ''),
           duration: Math.max(0, Math.min(480, parseInt(data.duration) || 60)), // Max 8 hours
           difficulty: ['beginner', 'intermediate', 'advanced'].includes(data.difficulty) 
             ? data.difficulty : 'beginner',
           category: SecurityValidator.sanitizeInput(data.category || ''),
           maxCapacity: Math.max(1, Math.min(100, parseInt(data.maxCapacity) || 20)),
           color: SecurityValidator.sanitizeInput(data.color || '#1976d2'),
           isActive: Boolean(data.isActive),
           createdAt: data.createdAt?.toDate() || new Date(),
           updatedAt: data.updatedAt?.toDate() || new Date(),
         };
         
         schedulesMap.set(doc.id, schedule);
       });
 
       // Merge instances with schedules
       const mergedData: MergedClassData[] = instancesSnapshot.docs
         .map(doc => {
           const instanceData = doc.data();
           const schedule = schedulesMap.get(instanceData.classId);
           
           if (!schedule) return null;
 
           // 🔒 Security: Sanitize and validate all data
           const merged: MergedClassData = {
             id: SecurityValidator.sanitizeInput(doc.id),
             className: schedule.className,
             instructorName: schedule.instructorName,
             startTime: instanceData.startTime?.toDate() || new Date(),
             endTime: instanceData.endTime?.toDate() || new Date(),
             category: schedule.category,
             difficulty: schedule.difficulty,
             enrolledCount: Math.max(0, parseInt(instanceData.enrolledCount) || 0),
             capacity: schedule.maxCapacity,
             color: schedule.color,
             location: SecurityValidator.sanitizeInput(instanceData.location || ''),
             status: ['active', 'cancelled', 'completed'].includes(instanceData.status) 
               ? instanceData.status : 'active',
           };
 
           return merged;
         })
         .filter((item): item is MergedClassData => item !== null);
 
       // Update state and cache
       setState(prev => ({
         ...prev,
         classData: mergedData,
         loading: false,
         lastFetched: new Date(),
       }));
 
       cacheRef.current.set(cacheKey, { data: mergedData, timestamp: Date.now() });
       retryCount.current = 0; // Reset retry count on success
 
     } catch (err) {
       console.error('🚨 Calendar fetch error:', err);
       
       if (err instanceof Error && err.name === 'AbortError') {
         return; // Request was cancelled, don't update state
       }
 
       const errorMessage = err instanceof Error ? err.message : 'Failed to load class data';
       
       setState(prev => ({
         ...prev,
         error: errorMessage,
         loading: false,
       }));
 
       retryCount.current += 1;
     }
   }, [weekStart, weekEnd, cacheKey, checkCache, maxRetries]);
 
   // 🔒 Security: Cleanup function
   const cleanup = useCallback(() => {
     if (abortController.current) {
       abortController.current.abort();
     }
   }, []);
 
   // Effect for data fetching
   useEffect(() => {
     fetchClassData();
     return cleanup;
   }, [fetchClassData, cleanup]);
 
   // Auto-refresh effect
   useEffect(() => {
     if (refreshInterval > 0) {
       const interval = setInterval(() => {
         // Only refresh if component is still mounted and visible
         if (document.visibilityState === 'visible') {
           fetchClassData();
         }
       }, refreshInterval);
 
       return () => clearInterval(interval);
     }
   }, [fetchClassData, refreshInterval]);
 
   // Manual refresh function
   const refresh = useCallback(() => {
     // Clear cache for current week
     cacheRef.current.delete(cacheKey);
     retryCount.current = 0;
     fetchClassData();
   }, [cacheKey, fetchClassData]);
 
   // Retry function
   const retry = useCallback(() => {
     if (retryCount.current < maxRetries) {
       fetchClassData();
     }
   }, [fetchClassData, maxRetries]);
 
   return {
     ...state,
     refresh,
     retry,
     canRetry: retryCount.current < maxRetries,
   };
 };
 
 