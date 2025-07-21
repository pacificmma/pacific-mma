import React, { useState } from 'react';
import { Box, Typography, useTheme, Tooltip, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { destinations } from '../utils/destinations';

interface Destination {
  country: string;
  title: string;
  date: string;
  image: string;
}

interface EventsMap {
  [key: string]: Destination[];
}

const EventCalendar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
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

  const eventsMap: Record<string, Destination[]> = destinations.reduce((map, dest) => {
    const date = new Date(dest.date);
    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    if (!map[key]) map[key] = [];
    map[key].push(dest);
    return map;
  }, {} as Record<string, Destination[]>);

  return (
    <Box sx={{ mb: { xs: '1.5rem' }, px: { xs: 2, sm: 4, md: 8 }, backgroundColor: theme.palette.background.paper, borderTop: `5px solid ${theme.palette.secondary.main}` }}>
      <Typography variant="h6"
        sx={{
          fontSize: { xs: '1.4rem', sm: '2.5rem', md: '3rem' },
          lineHeight: { xs: 1.4, sm: 1.4 },
          letterSpacing: '1px',
          textAlign: 'center',
          color: theme.palette.text.primary,
          textTransform: 'none',
          maxWidth: '900px',
          mt:'1rem',
          mx: 'auto',
          fontFamily: theme.typography.fontFamily,
        }}>
        Upcoming Tours
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
                  backgroundImage: events[0] ? `url(${events[0].image})` : 'none',
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
            navigate('/book')
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
          Book Now
        </Button>
      </Box>
    </Box>
  );
};

export default EventCalendar;