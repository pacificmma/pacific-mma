// src/components/ClassCalendar.tsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  IconButton,
  Card,
  CardContent,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  AccessTime,
  FitnessCenter,
  Person,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../providers/fireBaseAuthProvider';
import { SecurityValidator } from '../utils/security';
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, eachDayOfInterval, isSameDay, parseISO } from 'date-fns';

// 🔒 Security: Proper TypeScript interfaces
interface ClassInstance {
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

interface ClassSchedule {
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

interface MergedClassData {
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

interface ClassCalendarProps {
  // Optional props for customization
  showInstructor?: boolean;
  showCapacity?: boolean;
  allowNavigation?: boolean;
  initialDate?: Date;
  onClassClick?: (classData: MergedClassData) => void;
  onDateChange?: (date: Date) => void;
}

const ClassCalendar: React.FC<ClassCalendarProps> = ({
  showInstructor = true,
  showCapacity = true,
  allowNavigation = true,
  initialDate = new Date(),
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // State management
  const [currentWeek, setCurrentWeek] = useState<Date>(initialDate);
  const [classData, setClassData] = useState<MergedClassData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 🔒 Security: Input sanitization
  const sanitizeDate = (date: Date): Date => {
    try {
      const sanitized = new Date(date);
      if (isNaN(sanitized.getTime())) {
        throw new Error('Invalid date');
      }
      return sanitized;
    } catch {
      return new Date();
    }
  };

  // Calculate week bounds
  const weekStart = useMemo(() => 
    startOfWeek(sanitizeDate(currentWeek), { weekStartsOn: 1 }), 
    [currentWeek]
  );
  
  const weekEnd = useMemo(() => 
    endOfWeek(sanitizeDate(currentWeek), { weekStartsOn: 1 }), 
    [currentWeek]
  );

  const weekDays = useMemo(() => 
    eachDayOfInterval({ start: weekStart, end: weekEnd }), 
    [weekStart, weekEnd]
  );

  // 🔒 Security: Secure data fetching with proper error handling
  const fetchClassData = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // 🔒 Security: Validate date range to prevent excessive queries
      const daysDiff = Math.abs((weekEnd.getTime() - weekStart.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff > 7) {
        throw new Error('Invalid date range');
      }

      // Fetch class instances for the week
      const instancesQuery = query(
        collection(db, 'classInstances'),
        where('startTime', '>=', Timestamp.fromDate(weekStart)),
        where('startTime', '<=', Timestamp.fromDate(weekEnd)),
        where('status', '==', 'active'),
        orderBy('startTime', 'asc')
      );

      const instancesSnapshot = await getDocs(instancesQuery);
      
      if (instancesSnapshot.empty) {
        setClassData([]);
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
          color: SecurityValidator.sanitizeInput(data.color || theme.palette.primary.main),
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

      setClassData(mergedData);

    } catch (err) {
      console.error('🚨 Calendar fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load class data');
    } finally {
      setLoading(false);
    }
  };

  // Effect for data fetching
  useEffect(() => {
    fetchClassData();
  }, [currentWeek]);

  // Navigation handlers
  const goToPreviousWeek = (): void => {
    if (!allowNavigation) return;
    setCurrentWeek(prev => subWeeks(prev, 1));
  };

  const goToNextWeek = (): void => {
    if (!allowNavigation) return;
    setCurrentWeek(prev => addWeeks(prev, 1));
  };

  // Get classes for a specific day
  const getClassesForDay = (day: Date): MergedClassData[] => {
    return classData
      .filter(classItem => isSameDay(classItem.startTime, day))
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  };

  // Difficulty color mapping
  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'beginner': return theme.palette.success.main;
      case 'intermediate': return theme.palette.warning.main;
      case 'advanced': return theme.palette.error.main;
      default: return theme.palette.grey[500];
    }
  };

  // Class card component
  const ClassCard: React.FC<{ classItem: MergedClassData; compact?: boolean }> = ({ 
    classItem, 
    compact = false 
  }) => (
    <Card
      component={motion.div}
      whileHover={{ scale: 1.02 }}
      sx={{
        mb: compact ? 1 : 1.5,
        borderLeft: `4px solid ${classItem.color}`,
        backgroundColor: theme.palette.background.paper,
        '&:hover': {
          backgroundColor: theme.palette.action.hover,
        },
      }}
    >
      <CardContent sx={{ p: compact ? 1.5 : 2, '&:last-child': { pb: compact ? 1.5 : 2 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography 
            variant={compact ? "body2" : "subtitle1"} 
            sx={{ fontWeight: 600, color: theme.palette.text.primary }}
          >
            {classItem.className}
          </Typography>
          <Chip
            label={classItem.difficulty}
            size="small"
            sx={{
              backgroundColor: getDifficultyColor(classItem.difficulty),
              color: 'white',
              fontSize: '0.7rem',
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
          <AccessTime sx={{ fontSize: 16, mr: 0.5, color: theme.palette.text.secondary }} />
          <Typography variant="body2" color="text.secondary">
            {format(classItem.startTime, 'HH:mm')} - {format(classItem.endTime, 'HH:mm')}
          </Typography>
        </Box>

        {showInstructor && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <Person sx={{ fontSize: 16, mr: 0.5, color: theme.palette.text.secondary }} />
            <Typography variant="body2" color="text.secondary">
              {classItem.instructorName}
            </Typography>
          </Box>
        )}

        {showCapacity && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <FitnessCenter sx={{ fontSize: 16, mr: 0.5, color: theme.palette.text.secondary }} />
            <Typography variant="body2" color="text.secondary">
              {classItem.enrolledCount}/{classItem.capacity} participants
            </Typography>
          </Box>
        )}

        <Typography 
          variant="caption" 
          sx={{ 
            display: 'block', 
            color: theme.palette.text.secondary,
            mt: 0.5 
          }}
        >
          {classItem.location} • {classItem.category}
        </Typography>
      </CardContent>
    </Card>
  );

  // Loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
        <CircularProgress size={40} />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Loading classes...
        </Typography>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        <Typography variant="body1">
          {error}
        </Typography>
      </Alert>
    );
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto', p: 2 }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 2, sm: 0 }
      }}>
        <Typography 
          variant="h4" 
          component="h1"
          sx={{ 
            fontWeight: 700,
            color: theme.palette.text.primary,
            textAlign: { xs: 'center', sm: 'left' }
          }}
        >
          Class Schedule
        </Typography>

        {allowNavigation && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton 
              onClick={goToPreviousWeek}
              sx={{ 
                backgroundColor: theme.palette.action.hover,
                '&:hover': { backgroundColor: theme.palette.action.selected }
              }}
            >
              <ChevronLeft />
            </IconButton>
            
            <Typography 
              variant="h6" 
              sx={{ 
                mx: 2, 
                minWidth: 200,
                textAlign: 'center',
                fontWeight: 500,
                color: theme.palette.text.primary
              }}
            >
              {format(weekStart, 'MMM d')} - {format(weekEnd, 'd, yyyy')}
            </Typography>
            
            <IconButton 
              onClick={goToNextWeek}
              sx={{ 
                backgroundColor: theme.palette.action.hover,
                '&:hover': { backgroundColor: theme.palette.action.selected }
              }}
            >
              <ChevronRight />
            </IconButton>
          </Box>
        )}
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Desktop Calendar View */}
      {!isMobile ? (
        <Grid container spacing={2}>
          {weekDays.map((day, index) => {
            const dayClasses = getClassesForDay(day);
            const isToday = isSameDay(day, new Date());

            return (
              <Grid item xs={12} sm={6} md key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      minHeight: 400,
                      backgroundColor: isToday 
                        ? theme.palette.action.selected 
                        : theme.palette.background.paper,
                      border: isToday 
                        ? `2px solid ${theme.palette.primary.main}` 
                        : `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <CardContent>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          mb: 2,
                          textAlign: 'center',
                          fontWeight: 600,
                          color: isToday 
                            ? theme.palette.primary.main 
                            : theme.palette.text.primary
                        }}
                      >
                        {format(day, 'EEEE')}
                        <br />
                        <Typography 
                          component="span" 
                          variant="body1"
                          sx={{ 
                            color: isToday 
                              ? theme.palette.primary.main 
                              : theme.palette.text.secondary
                          }}
                        >
                          {format(day, 'MMM d')}
                        </Typography>
                      </Typography>

                      <AnimatePresence>
                        {dayClasses.length > 0 ? (
                          dayClasses.map((classItem, classIndex) => (
                            <motion.div
                              key={classItem.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              transition={{ delay: classIndex * 0.05 }}
                            >
                              <ClassCard classItem={classItem} />
                            </motion.div>
                          ))
                        ) : (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            <Typography 
                              variant="body2" 
                              color="text.secondary"
                              sx={{ 
                                textAlign: 'center',
                                py: 4,
                                fontStyle: 'italic'
                              }}
                            >
                              No classes scheduled
                            </Typography>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            );
          })}
        </Grid>
      ) : (
        /* Mobile Carousel View */
        <Box sx={{ position: 'relative' }}>
          <Swiper
            modules={[Pagination, Navigation]}
            spaceBetween={16}
            slidesPerView={1.2}
            centeredSlides
            pagination={{ 
              clickable: true,
              dynamicBullets: true,
            }}
            navigation={{
              prevEl: '.swiper-button-prev-custom',
              nextEl: '.swiper-button-next-custom',
            }}
            breakpoints={{
              480: {
                slidesPerView: 1.5,
              },
              600: {
                slidesPerView: 2,
              },
            }}
            style={{
              paddingBottom: '50px',
            }}
          >
            {weekDays.map((day, index) => {
              const dayClasses = getClassesForDay(day);
              const isToday = isSameDay(day, new Date());

              return (
                <SwiperSlide key={index}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      sx={{
                        height: 450,
                        backgroundColor: isToday 
                          ? theme.palette.action.selected 
                          : theme.palette.background.paper,
                        border: isToday 
                          ? `2px solid ${theme.palette.primary.main}` 
                          : `1px solid ${theme.palette.divider}`,
                        overflow: 'auto',
                      }}
                    >
                      <CardContent>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            mb: 2,
                            textAlign: 'center',
                            fontWeight: 600,
                            color: isToday 
                              ? theme.palette.primary.main 
                              : theme.palette.text.primary
                          }}
                        >
                          {format(day, 'EEEE')}
                          <br />
                          <Typography 
                            component="span" 
                            variant="body1"
                            sx={{ 
                              color: isToday 
                                ? theme.palette.primary.main 
                                : theme.palette.text.secondary
                            }}
                          >
                            {format(day, 'MMM d')}
                          </Typography>
                        </Typography>

                        {dayClasses.length > 0 ? (
                          dayClasses.map((classItem, classIndex) => (
                            <motion.div
                              key={classItem.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: classIndex * 0.1 }}
                            >
                              <ClassCard classItem={classItem} compact />
                            </motion.div>
                          ))
                        ) : (
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ 
                              textAlign: 'center',
                              py: 4,
                              fontStyle: 'italic'
                            }}
                          >
                            No classes scheduled
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                </SwiperSlide>
              );
            })}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <IconButton
            className="swiper-button-prev-custom"
            sx={{
              position: 'absolute',
              left: -20,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <ChevronLeft />
          </IconButton>

          <IconButton
            className="swiper-button-next-custom"
            sx={{
              position: 'absolute',
              right: -20,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <ChevronRight />
          </IconButton>
        </Box>
      )}

      {/* Empty state */}
      {classData.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card sx={{ textAlign: 'center', py: 6 }}>
            <CardContent>
              <FitnessCenter 
                sx={{ 
                  fontSize: 64, 
                  color: theme.palette.text.secondary,
                  mb: 2 
                }} 
              />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Classes This Week
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Check back later for updated class schedules.
              </Typography>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </Box>
  );
};

export default ClassCalendar;