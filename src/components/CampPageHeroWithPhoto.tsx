// src/components/CampPageHeroWithPhoto.tsx
import { Box, Typography, useTheme } from '@mui/material';
import React from 'react';
const CampHeroPhoto = '/assets/img/camp_page/youthCampHero.jpg';

const CampHeroWPhoto = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100vw',
        height: { xs: '50vh', md: '60vh' },
        overflow: 'hidden',
        backgroundColor: theme.palette.background.default,
        borderBottom: `6px solid ${theme.palette.secondary.main}`,
      }}
    >
      {/* Background Image */}
      <Box
        component="img"
        src={CampHeroPhoto} // ✅ Fixed: Direct string access, no .src property needed
        alt="Pacific MMA Youth Camp"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'brightness(0.6)',
        }}
      />

      {/* Text Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: theme.palette.primary.contrastText,
          textAlign: 'center',
          zIndex: 2,
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: theme.typography.h3.fontWeight,
            fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' },
            lineHeight: 1.3,
          }}
        >
          Unlock Your Power <br />
          at <span style={{ color: theme.palette.secondary.main }}>Pacific MMA Camp</span>
        </Typography>
        <Typography
          variant="body1"
          sx={{
            marginTop: '1rem',
            color: theme.palette.text.secondary,
            fontSize: { xs: '1rem', sm: '1.2rem' },
            maxWidth: '600px',
            marginInline: 'auto',
          }}
        >
          A transformative experience combining elite martial arts training with nature, culture, and connection.
        </Typography>
      </Box>
    </Box>
  );
};

export default CampHeroWPhoto;