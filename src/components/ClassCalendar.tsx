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
  getDocs,
} from 'firebase/firestore';
import { db, useFirebaseAuth } from '../providers/fireBaseAuthProvider';
import { SecurityValidator } from '../utils/security';
import {
  format,
  startOfWeek,
  endOfWeek,
  addWeeks,
  subWeeks,
  eachDayOfInterval,
  isSameDay,
} from 'date-fns';

// Proper TypeScript interfaces based on the Firestore document screenshot
interface ClassInstance {
  id: string;
  classtype: string;
  name: string;
  instructorId: string;
  instructorName: string;
  startTime: string; 
  enddate: string;
  date: string;
  maxParticipants: number;
  registeredParticipants: number;
  status: 'scheduled' | 'cancelled' | 'completed';
  location: string;
  notes?: string;
  created: Date;
  updatedAt: Date;
  color: string;
}

interface MergedClassData {
  id: string;
  className: string;
  instructorName: string;
  startTime: Date;
  endTime: Date;
  category: string;
  enrolledCount: number;
  capacity: number;
  color: string;
  location: string;
  status: 'scheduled' | 'cancelled' | 'completed';
}

interface ClassCalendarProps {
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
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const { loading: authLoading } = useFirebaseAuth();
  
  const [currentWeek, setCurrentWeek] = useState<Date>(initialDate);
  const [classData, setClassData] = useState<MergedClassData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  const weekStart = useMemo(
    () => startOfWeek(sanitizeDate(currentWeek), { weekStartsOn: 1 }),
    [currentWeek]
  );

  const weekEnd = useMemo(
    () => endOfWeek(sanitizeDate(currentWeek), { weekStartsOn: 1 }),
    [currentWeek]
  );

  const weekDays = useMemo(
    () => eachDayOfInterval({ start: weekStart, end: weekEnd }),
    [weekStart, weekEnd]
  );

  const getDefaultColor = (category?: string): string => {
    const colorMap: { [key: string]: string } = {
      'fitness': theme.palette.primary.main,
      'yoga': theme.palette.secondary.main,
      'cardio': theme.palette.error.main,
      'strength': theme.palette.warning.main,
      'dance': theme.palette.info.main,
      'martial-arts': theme.palette.success.main,
    };
    return colorMap[category?.toLowerCase() || ''] || theme.palette.grey[600];
  };

  const fetchClassData = async (): Promise<void> => {
    if (authLoading) {
        setLoading(true); 
        return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const daysDiff = Math.abs((weekEnd.getTime() - weekStart.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff > 7) {
        throw new Error('Invalid date range');
      }
      
      const instancesQuery = query(
        collection(db, 'classInstances'),
      );

      const instancesSnapshot = await getDocs(instancesQuery);

      if (instancesSnapshot.empty) {
        setClassData([]);
        return;
      }
      
      const allClassInstances: MergedClassData[] = instancesSnapshot.docs.map((doc) => {
        const data = doc.data();
        
        let startTime = new Date();
        let endTime = new Date();
        try {
          if (data.date && data.startTime) {
            startTime = new Date(`${data.date}T${data.startTime}:00`);
          }
          if (data.date && data.enddate) {
            endTime = new Date(`${data.date}T${data.enddate}:00`);
          }
        } catch (e) {
          console.error("Date parsing error for:", data, e);
        }

        const mergedClass: MergedClassData = {
          id: SecurityValidator.sanitizeInput(doc.id || ''),
          className: SecurityValidator.sanitizeInput(data.name || 'Unknown Class'),
          instructorName: SecurityValidator.sanitizeInput(data.instructorName || 'Unknown Instructor'),
          startTime: startTime,
          endTime: endTime,
          category: SecurityValidator.sanitizeInput(data.classtype || 'General'),
          enrolledCount: Math.max(0, Number(data.registeredParticipants) || 0),
          capacity: Math.max(1, Number(data.maxParticipants) || 20),
          color: SecurityValidator.sanitizeInput(data.color || getDefaultColor(data.classtype)),
          location: SecurityValidator.sanitizeInput(data.location || 'Main Studio'),
          status: ['scheduled', 'cancelled', 'completed'].includes(data.status as string)
            ? (data.status as 'scheduled' | 'cancelled' | 'completed')
            : 'scheduled',
        };
        
        return mergedClass;
      });

      const filteredByWeek = allClassInstances.filter(item => {
        const itemDate = item.startTime;
        return isSameDay(itemDate, weekStart) || (itemDate >= weekStart && itemDate <= weekEnd);
      });
      
      setClassData(filteredByWeek);

    } catch (err) {
      console.error('🚨 Calendar fetch error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load class data';
      setError(errorMessage);
      setClassData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchClassData();
    }
  }, [currentWeek, authLoading]);

  const goToPreviousWeek = (): void => {
    if (!allowNavigation) return;
    setCurrentWeek((prev) => subWeeks(prev, 1));
  };

  const goToNextWeek = (): void => {
    if (!allowNavigation) return;
    setCurrentWeek((prev) => addWeeks(prev, 1));
  };

  const getClassesForDay = (day: Date): MergedClassData[] => {
    return classData
      .filter((classItem) => isSameDay(classItem.startTime, day))
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  };
  
  const ClassCard: React.FC<{ classItem: MergedClassData; compact?: boolean }> = ({
    classItem,
    compact = false,
  }) => (
    <Card
      component={motion.div}
      whileHover={{ scale: 1.02 }}
      sx={{
        mb: compact ? 1.5 : 2,
        borderLeft: `4px solid ${classItem.color}`,
        backgroundColor: theme.palette.background.paper,
        '&:hover': {
          backgroundColor: theme.palette.action.hover,
        },
      }}
    >
      <CardContent sx={{ p: compact ? 2 : 2.5, '&:last-child': { pb: compact ? 2 : 2.5 } }}>
        <Box
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}
        >
          <Typography
            variant={compact ? 'body2' : 'subtitle2'}
            sx={{
              fontWeight: 600,
              color: theme.palette.text.primary,
              lineHeight: 1.2,
            }}
          >
            {classItem.className}
          </Typography>
          
          <Chip
            label={classItem.status}
            size="small"
            sx={{
              fontSize: '0.7rem',
              height: 20,
              backgroundColor: 
                classItem.status === 'scheduled' ? theme.palette.success.light :
                classItem.status === 'cancelled' ? theme.palette.error.light :
                theme.palette.grey.A200,
              color: 
                classItem.status === 'scheduled' ? theme.palette.success.contrastText :
                classItem.status === 'cancelled' ? theme.palette.error.contrastText :
                theme.palette.text.primary,
            }}
          />
        </Box>

        {showInstructor && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Person sx={{ fontSize: 16, mr: 0.5, color: theme.palette.text.primary }} />
            <Typography variant="caption" color="text.primary">
              {classItem.instructorName}
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <AccessTime sx={{ fontSize: 16, mr: 0.5, color: theme.palette.text.primary }} />
          <Typography variant="caption" color="text.primary">
            {format(classItem.startTime, 'HH:mm')} - {format(classItem.endTime, 'HH:mm')}
          </Typography>
        </Box>

        {showCapacity && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
            <Typography variant="caption" color="text.primary">
              📍 {classItem.location}
            </Typography>
            <Typography variant="caption" color="text.primary">
              {classItem.enrolledCount}/{classItem.capacity}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 400,
          gap: 2,
        }}
      >
        <CircularProgress size={48} />
        <Typography variant="body1" color="text.secondary">
          Loading class schedule...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mx: 'auto', maxWidth: 600 }}>
        <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
          Unable to Load Class Schedule
        </Typography>
        <Typography variant="body2">
          {error}. Please refresh the page or try again later.
        </Typography>
      </Alert>
    );
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 'none', mx: 'auto', p: { xs: 2, sm: 1 } }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 2, sm: 0 },
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            color: theme.palette.text.primary,
            textAlign: { xs: 'center', sm: 'left' },
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
                '&:hover': { backgroundColor: theme.palette.action.selected },
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
                color: theme.palette.text.primary,
              }}
            >
              {format(weekStart, 'MMM d')} - {format(weekEnd, 'd, yyyy')}
            </Typography>

            <IconButton
              onClick={goToNextWeek}
              sx={{
                backgroundColor: theme.palette.action.hover,
                '&:hover': { backgroundColor: theme.palette.action.selected },
              }}
            >
              <ChevronRight />
            </IconButton>
          </Box>
        )}
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Desktop view - 7 columns */}
      {isDesktop ? (
        <Box
          sx={{
            display: 'flex',
            gap: theme.spacing(1.5), // Reduced gap for better space utilization
            width: '100%',
            '& > *': {
              flex: '1 1 0', // Equal flex distribution
            }
          }}
        >
          {weekDays.map((day, index) => {
            const dayClasses = getClassesForDay(day);
            const isToday = isSameDay(day, new Date());

            return (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1, // Take equal share of available width
                  minWidth: 0, // Allow shrinking below content size
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      height: { 
                        md: 500, 
                        lg: 550, 
                        xl: 600 
                      },
                      backgroundColor: isToday
                        ? theme.palette.action.selected
                        : theme.palette.background.paper,
                      border: isToday
                        ? `2px solid ${theme.palette.primary.main}`
                        : `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <CardContent sx={{ 
                      overflowY: 'auto', 
                      height: '100%', 
                      p: { md: 2.5, lg: 3 } 
                    }}>
                      <Typography
                        variant="h6"
                        sx={{
                          mb: 3,
                          textAlign: 'center',
                          fontWeight: 600,
                          color: isToday
                            ? theme.palette.primary.main
                            : theme.palette.text.primary,
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
                              : theme.palette.text.primary,
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
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: classIndex * 0.1 }}
                            >
                              <ClassCard classItem={classItem} compact={false} />
                            </motion.div>
                          ))
                        ) : (
                          <Typography
                            variant="body2"
                            color="text.primary"
                            sx={{
                              textAlign: 'center',
                              py: 6,
                              fontStyle: 'italic',
                            }}
                          >
                            No classes scheduled
                          </Typography>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>
              </Box>
            );
          })}
        </Box>
      ) : isTablet ? (
        // Tablet view - 3 columns with horizontal scroll
        <Box sx={{ 
          overflowX: 'auto', 
          display: 'flex', 
          gap: 2,
          pb: 2,
          '&::-webkit-scrollbar': {
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: theme.palette.action.hover,
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme.palette.primary.main,
            borderRadius: '4px',
          },
        }}>
          {weekDays.map((day, index) => {
            const dayClasses = getClassesForDay(day);
            const isToday = isSameDay(day, new Date());

            return (
              <Box
                key={index}
                sx={{
                  minWidth: '300px',
                  maxWidth: '350px',
                  flex: '0 0 auto',
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
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
                    }}
                  >
                    <CardContent sx={{ 
                      overflowY: 'auto', 
                      height: '100%', 
                      p: 2.5
                    }}>
                      <Typography
                        variant="h6"
                        sx={{
                          mb: 2,
                          textAlign: 'center',
                          fontWeight: 600,
                          fontSize: '1.1rem',
                          color: isToday
                            ? theme.palette.primary.main
                            : theme.palette.text.primary,
                        }}
                      >
                        {format(day, 'EEEE')}
                        <br />
                        <Typography
                          component="span"
                          variant="body2"
                          sx={{
                            color: isToday
                              ? theme.palette.primary.main
                              : theme.palette.text.primary,
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
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: classIndex * 0.1 }}
                            >
                              <ClassCard classItem={classItem} compact={true} />
                            </motion.div>
                          ))
                        ) : (
                          <Typography
                            variant="body2"
                            color="text.primary"
                            sx={{
                              textAlign: 'center',
                              py: 4,
                              fontStyle: 'italic',
                            }}
                          >
                            No classes scheduled
                          </Typography>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>
              </Box>
            );
          })}
        </Box>
      ) : (
        // Mobile view - Swiper with single column
        <Box sx={{ position: 'relative' }}>
          <Swiper
            modules={[Pagination, Navigation]}
            spaceBetween={16}
            slidesPerView={1}
            pagination={{ 
              clickable: true,
              dynamicBullets: true,
            }}
            navigation={{
              prevEl: '.swiper-button-prev-custom',
              nextEl: '.swiper-button-next-custom',
            }}
            className="calendarSwiper"
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
                        minHeight: 500,
                        backgroundColor: isToday
                          ? theme.palette.action.selected
                          : theme.palette.background.paper,
                        border: isToday
                          ? `2px solid ${theme.palette.primary.main}`
                          : `1px solid ${theme.palette.divider}`,
                        overflow: 'auto',
                      }}
                    >
                      <CardContent sx={{ overflowY: 'auto' }}>
                        <Typography
                          variant="h6"
                          sx={{
                            mb: 2,
                            textAlign: 'center',
                            fontWeight: 600,
                            color: isToday
                              ? theme.palette.primary.main
                              : theme.palette.text.primary,
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
                                : theme.palette.text.secondary,
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
                              color="text.primary"
                              sx={{
                                textAlign: 'center',
                                py: 4,
                                fontStyle: 'italic',
                              }}
                            >
                              No classes scheduled
                            </Typography>
                          )}
                        </AnimatePresence>
                      </CardContent>
                    </Card>
                  </motion.div>
                </SwiperSlide>
              );
            })}
          </Swiper>

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

      {classData.length === 0 && !loading && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card sx={{ textAlign: 'center', py: 6 }}>
            <CardContent>
              <FitnessCenter
                sx={{
                  fontSize: 64,
                  color: theme.palette.text.primary,
                  mb: 2,
                }}
              />
              <Typography variant="h6" color="text.primary" gutterBottom>
                No Classes This Week
              </Typography>
              <Typography variant="body2" color="text.primary">
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