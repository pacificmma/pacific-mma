// src/components/EventCalendar.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Typography,
  Button,
  useTheme,
  Tooltip,
} from '@mui/material';
import { destinations } from '../utils/destinations';
import { StaticImageData } from 'next/image';

interface Destination {
  country: string;
  title: string;
  date: string;
  image: string | StaticImageData;
}

const EventCalendar = () => {
  const theme = useTheme();
  const router = useRouter();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const startDay = new Date(currentYear, currentMonth, 1).getDay();

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // 🔧 FIX: Proper typing for destinations reduce (62:84)
  const eventsMap: Record<string, Destination[]> = destinations.reduce((map, dest) => {
    const destination = dest as Destination; // Type assertion for external data
    const date = new Date(destination.date);
    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    if (!map[key]) map[key] = [];
    map[key].push(destination);
    return map;
  }, {} as Record<string, Destination[]>);

  return (
    <Box sx={{ py: { xs: 3, sm: 4, md: 5 }, px: { xs: 2, sm: 3, md: 4 }, backgroundColor: theme.palette.background.paper, borderTop: `6px solid ${theme.palette.secondary.main}` }}>
      <Typography variant="h6"
        sx={{
          fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' },
          lineHeight: { xs: 1.4, sm: 1.4 },
          letterSpacing: '1px',
          textAlign: 'center',
          color: theme.palette.text.primary,
          textTransform: 'none',
          maxWidth: '900px',
          mb: { xs: 3, sm: 4, md: 4 },
          mx: 'auto',
          fontFamily: theme.typography.fontFamily,
        }}>
        Upcoming Events
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography onClick={handlePrevMonth} sx={{ cursor: 'pointer', fontWeight: 'bold', color: theme.palette.text.primary }}>{'<'}</Typography>
        <Typography variant="h4" fontWeight="bold" sx={{ color: theme.palette.text.primary }}>
          {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} {currentYear}
        </Typography>
        <Typography onClick={handleNextMonth} sx={{ cursor: 'pointer', fontWeight: 'bold', color: theme.palette.text.primary }}>{'>'}</Typography>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
          <Typography key={day} textAlign="center" fontWeight="bold" sx={{ color: theme.palette.text.primary }}>{day}</Typography>
        ))}

        {Array.from({ length: startDay }).map((_, idx) => (
          <Box key={`empty-${idx}`} sx={{ minHeight: 80 }} />
        ))}

        {Array.from({ length: daysInMonth }).map((_, idx) => {
          const day = idx + 1;
          const key = `${currentYear}-${currentMonth}-${day}`;
          const events = eventsMap[key] || [];

          return (
            <Tooltip
              key={day}
              title={events.map(e => `${e.country}: ${e.title}`).join(', ') || ''}
              arrow
            >
              <Box
                sx={{
                  minHeight: 80,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 1,
                  position: 'relative',
                  backgroundImage: events[0]
                    ? `url(${typeof events[0].image === 'object'
                      ? events[0].image.src // If it's StaticImageData (an object), use .src
                      : events[0].image // Otherwise (if it's a string), use it directly
                    })`
                    : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  cursor: events.length ? 'pointer' : 'default',
                }}
              >
                <Typography sx={{ position: 'absolute', top: 4, left: 4, fontSize: theme.typography.body2.fontSize, fontWeight: theme.typography.body2.fontWeight, backgroundColor: 'rgba(0,0,0,0.6)', color: theme.palette.primary.contrastText, borderRadius: '4px', px: 0.5 }}>
                  {day}
                </Typography>
              </Box>
            </Tooltip>
          );
        })}
      </Box>

      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Button
          variant="contained"
          onClick={() =>
            router.push('/book')
          }
          sx={{
            backgroundColor: theme.palette.secondary.main,
            color: theme.palette.primary.contrastText,
            padding: '12px 30px',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            fontFamily: theme.typography.fontFamily,
            borderRadius: '30px',
            '&:hover': { backgroundColor: theme.palette.secondary.dark, color: 'white' },
          }}
        >
          Book
        </Button>
      </Box>
    </Box>
  );
};

export default EventCalendar;