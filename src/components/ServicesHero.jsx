import React, { useEffect } from 'react';
import { Box, Typography, Grid, Card, CardMedia, CardContent } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import servicesText from '../utils/servicesText.json';

// ✅ Next.js compatible asset imports - use public folder paths
const ServicesHeroPhoto = '/assets/img/services_page/services_hero.jpg';
const bagagePhoto = '/assets/img/services_page/suitcase.jpg';
const nutritionPhoto = '/assets/img/services_page/chef.jpg';
const mmaTraining = '/assets/img/services_page/mma_training.jpg';
const callCenterPhoto = '/assets/img/services_page/call_center.jpg';
const kidBoxingPhoto = '/assets/img/services_page/kid_boxing.jpg';
const glovesPhoto = '/assets/img/services_page/gloves.jpg';
const hotelRoomPhoto = '/assets/img/services_page/hotel_room.jpg';
const giPhoto = '/assets/img/services_page/gi_belt.jpg';

const photoMap = [
  mmaTraining,
  giPhoto,
  hotelRoomPhoto,
  bagagePhoto,
  nutritionPhoto,
  glovesPhoto,
  callCenterPhoto,
  kidBoxingPhoto
];

const ServicesHero = () => {
  const theme = useTheme();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Box sx={{ backgroundColor: theme.palette.background.default, mb:'2rem'}}>
      {/* Hero Section */}
      <Box
        sx={{
          backgroundImage: `url(${ServicesHeroPhoto})`, // ✅ Direct string usage
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: { xs: '400px', sm: '500px', md: '600px', lg: '650px' },
          minHeight: { xs: '50vh', md: '60vh' },
          maxHeight: { xs: '80vh', md: '70vh' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: { xs: 3, sm: 3.5, md: 4 },
          borderBottom: `6px solid ${theme.palette.secondary.main}`,
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
          Our Services
        </Typography>
      </Box>

      {/* Service Cards */}
      <Box sx={{ 
        px: { xs: 2, sm: 3, md: 4 },
        pb: { xs: 3, sm: 4, md: 5 }
      }}>
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
        {servicesText.map((service, index) => (
          <Grid item xs={12} sm={6} md={4} lg={4} xl={3} key={index}>
            <Card sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              borderRadius: '16px', 
              boxShadow: 3,
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 6
              }
            }}>
              <CardMedia
                component="img"
                image={photoMap[index % photoMap.length]}  // Safeguard if more texts than images
                alt={service.title}
                sx={{ 
                  height: { xs: '180px', sm: '200px', md: '220px' },
                  objectFit: 'cover'
                }}
              />
              <CardContent sx={{ 
                flexGrow: 1, 
                backgroundColor: theme.palette.background.paper,
                p: { xs: 2, sm: 2.5, md: 3 },
                display: 'flex',
                flexDirection: 'column',
                gap: 1
              }}>
                <Typography 
                  variant="h6" 
                  component="h3" 
                  sx={{ 
                    color: theme.palette.text.primary,
                    fontWeight: 'bold',
                    fontSize: { xs: '1.1rem', sm: '1.2rem', md: '1.3rem' },
                    mb: 1,
                    lineHeight: 1.3
                  }}
                >
                  {service.title}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: theme.palette.text.primary,
                    lineHeight: 1.6,
                    fontSize: { xs: '0.9rem', sm: '0.95rem' },
                    flex: 1
                  }}
                  {service.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      </Box>
    </Box>
  );
};

export default ServicesHero;