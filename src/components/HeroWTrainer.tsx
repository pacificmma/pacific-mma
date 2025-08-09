// src/components/HeroWTrainer.tsx
import React from 'react';
import { Box, Typography, Button, useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import InstagramIcon from '@mui/icons-material/Instagram';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
const BrendaWBrothers = '/assets/img/home_page/brenda_brothers.jpeg';

const HeroWTrainer = () => {
  const theme = useTheme();
  const router = useRouter();

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: { xs: 3, sm: 4, md: 5 },
        px: { xs: 2, sm: 3, md: 4 },
        backgroundColor: theme.palette.primary.main,
        borderTop: `6px solid ${theme.palette.secondary.main}`,
      }}
    >

      {/* Content Container */}
      <Box
        sx={{
          maxWidth: '1600px',
          width: '100%',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'center', md: 'flex-start' },
          justifyContent: 'space-between',
          gap: { xs: '1rem', md: '1.5rem' },
          padding: { xs: '0.5rem', sm: '1rem', md: '1.5rem' },
        }}
      >
        {/* Text Content with Title */}
        <Box 
          sx={{ 
            flex: { xs: '1', md: '1.2' }, 
            textAlign: { xs: 'center', md: 'left' },
            paddingRight: { md: '1rem' },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            order: { xs: 2, md: 1 }, // İkinci sırada mobilde, birinci sırada desktop'ta
          }}
        >
          {/* Title and Instagram Icon - Show only on desktop */}
          <Box sx={{ 
            display: { xs: 'none', md: 'flex' }, 
            alignItems: 'center', 
            justifyContent: 'flex-start', 
            gap: 2, 
            mb: 1 
          }}>
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: '1.5rem', sm: '2.3rem', md: '3rem' },
                lineHeight: { xs: 1.4, sm: 1.4 },
                letterSpacing: '0.6px',
                color: theme.palette.primary.contrastText,
                textTransform: 'none',
                fontFamily: theme.typography.fontFamily,
                marginTop: 0,
                paddingTop: 0,
              }}
            >
             PACIFIC MMA ACADEMY
            </Typography>
            <InstagramIcon 
              onClick={() => window.open('https://www.instagram.com/pacificmma.academy/', '_blank')}
              sx={{ 
                fontSize: { xs: '1.8rem', sm: '2rem', md: '2.4rem', lg: '2.6rem' },
                color: theme.palette.primary.contrastText,
                cursor: 'pointer',
                '&:hover': {
                  color: theme.palette.secondary.main,
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.3s ease',
              }} 
            />
          </Box>
          <Typography
            variant="body1"
            sx={{
              mt: 2,
              mb: 3,
              lineHeight: 1.7,
              color: theme.palette.text.secondary,
              fontSize: { xs: '0.9rem', md: '1rem' },
              fontWeight: 600,
              fontStyle: 'italic',
              fontFamily: theme.typography.fontFamily,
            }}
          >
            Where Every Warrior's Journey Begins.
          </Typography>

          <Typography
            variant="body1"
            sx={{
              mt: 2,
              mb: 3,
              lineHeight: 1.7,
              color: theme.palette.text.secondary,
              fontSize: { xs: '0.9rem', md: '1rem' },
              fontWeight: 600,
              fontFamily: theme.typography.fontFamily,
            }}
          >
            Train under legendary lineage at PACIFIC MMA ACADEMY. Chief Instructor Brenda King—certified by Erik Paulson, Rigan Machado, and Dan Inosanto—brings world-class Brazilian Jiu-Jitsu, Mixed Martial Arts, Muay Thai, Jeet-Kune-Do, Shooto, and Submission Wrestling to Belmont, California.
          </Typography>

          <Typography
            variant="body1"
            sx={{
              mb: 3,
              lineHeight: 1.7,
              color: theme.palette.text.secondary,
              fontSize: { xs: '0.9rem', md: '1rem' },
              fontWeight: 600,
              fontStyle: 'italic',
              fontFamily: theme.typography.fontFamily,
            }}
          >
            From Silicon Valley executives to future champions, from youth programs to elite training camps, we forge complete warriors. When legends visit the Bay Area, they train here. When you're ready to transform, your journey begins here.
          </Typography>

          <Typography
            variant="body1"
            sx={{
              mb: 4,
              lineHeight: 1.7,
              color: theme.palette.text.secondary,
              fontSize: { xs: '0.9rem', md: '1rem' },
              fontWeight: 600,
              fontFamily: theme.typography.fontFamily,
            }}
          >
            Experience the difference. Join the legacy.
          </Typography>

          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: { xs: 'center', md: 'flex-start' },
            gap: 2,
            width: '100%'
          }}>
            <Button
              variant="contained"
              onClick={() => router.push('/academy')}
              sx={{
                backgroundColor: theme.palette.secondary.main,
                color: theme.palette.primary.contrastText,
                padding: '10px 24px',
                fontSize: { xs: '1rem', md: '1.1rem' },
                fontWeight: 'bold',
                fontFamily: theme.typography.fontFamily,
                borderRadius: '30px',
                '&:hover': { backgroundColor: theme.palette.secondary.dark, color: 'white' },
              }}
            >
              Learn More
            </Button>
            <Button
              variant="outlined"
              startIcon={<CalendarMonthIcon />}
              onClick={() => router.push('/academy#schedule')}
              sx={{
                backgroundColor: theme.palette.secondary.main,
                color: theme.palette.primary.contrastText,
                padding: '10px 24px',
                fontSize: { xs: '1rem', md: '1.1rem' },
                fontWeight: 'bold',
                fontFamily: theme.typography.fontFamily,
                borderRadius: '30px',
                '&:hover': { backgroundColor: theme.palette.secondary.dark, color: 'white' },
              }}
            >
              Schedule
            </Button>    
          </Box>
        </Box>

        {/* Image Section - Mobile Title Above */}
        <Box
          sx={{
            flex: { xs: '1', md: '0.8' },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: { xs: 'center', md: 'flex-end' },
            alignItems: 'center',
            height: '100%',
            mt: 0,
            pt: 0,
            order: { xs: 1, md: 2 }, // İlk sırada mobilde, ikinci sırada desktop'ta
          }}
        >
          {/* Title and Instagram Icon - Show only on mobile */}
          <Box sx={{ 
            display: { xs: 'flex', md: 'none' }, 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: 2, 
            mb: 2 
          }}>
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: '1.5rem', sm: '2.3rem', md: '3rem' },
                lineHeight: { xs: 1.4, sm: 1.4 },
                letterSpacing: '0.6px',
                color: theme.palette.primary.contrastText,
                textTransform: 'none',
                fontFamily: theme.typography.fontFamily,
                marginTop: 0,
                paddingTop: 0,
              }}
            >
             PACIFIC MMA ACADEMY
            </Typography>
            <InstagramIcon 
              onClick={() => window.open('https://www.instagram.com/pacificmma.academy/', '_blank')}
              sx={{ 
                fontSize: { xs: '1.8rem', sm: '2rem', md: '2.4rem', lg: '2.6rem' },
                color: theme.palette.primary.contrastText,
                cursor: 'pointer',
                '&:hover': {
                  color: theme.palette.secondary.main,
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.3s ease',
              }} 
            />
          </Box>
          
          <Box
            component="img"
            src={BrendaWBrothers}
            alt="Brenda King with Fighters"
            sx={{
              width: '100%',
              maxWidth: { xs: '100%', sm: '500px', md: '500px' },
              borderRadius: '16px',
              boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.4)',
              marginTop: 0,
              paddingTop: 0,
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default HeroWTrainer;