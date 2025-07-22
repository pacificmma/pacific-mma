import React from 'react';
import { Box, Typography, Button, useTheme, Container } from '@mui/material';

// ✅ Next.js compatible asset import - use public folder path
const CampHeroPhoto = '/assets/img/camp_page/youthCampHero.jpg';

const YouthCamp = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        minHeight: '60vh',
        backgroundImage: `url(${CampHeroPhoto})`, // ✅ Direct string usage
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        color: '#fff',
        pt: { xs: 6, md: 8 },
        pb: { xs: 6, md: 10 },
        borderTop: `5px solid ${theme.palette.secondary.main}`,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 1,
        }}
      />

      <Container
        sx={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          maxWidth: '800px',
          fontFamily: theme.typography.fontFamily,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontSize: { xs: '1.4rem', sm: '2.5rem', md: '3rem' },
            lineHeight: { xs: 1.4, sm: 1.4 },
            letterSpacing: '1px',
            color: theme.palette.primary.contrastText,
            textTransform: 'none',
            maxWidth: '900px',
            margin: '0 auto',
            fontFamily: theme.typography.fontFamily,
          }}
        >
          Youth MMA Camp
        </Typography>

        <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, mb: 3, color: theme.palette.text.secondary, fontFamily: theme.typography.fontFamily }}>
          Introduce your child to the world of martial arts in a fun, engaging, and empowering environment.
          Our Youth MMA Camp offers kids the chance to train with experienced coaches, develop discipline,
          build confidence, and make new friends — all while having an amazing time!
        </Typography>

        <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, mb: 3, color: theme.palette.text.secondary, fontFamily: theme.typography.fontFamily }}>
          Through a mix of Brazilian Jiu-Jitsu, Kickboxing, and playful strength exercises, children will gain
          essential self-defense skills and a love for movement. No experience required — just curiosity and energy!
        </Typography>

        <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, mb: 4, color: theme.palette.text.secondary, fontFamily: theme.typography.fontFamily }}>
          Each session is designed not only to improve physical health, but also to foster social skills and sportsmanship.
          With a strong emphasis on respect, teamwork, and self-discipline, our camp helps young martial artists grow into
          confident and responsible individuals — all in a safe and supervised setting parents can trust.
        </Typography>

        <Button
          variant="contained"
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
          Learn More
        </Button>
      </Container>
    </Box>
  );
};

export default YouthCamp;