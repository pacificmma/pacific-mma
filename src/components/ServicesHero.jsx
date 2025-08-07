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
          height: { xs: '50vh', md: '60vh' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 4,
          borderBottom: `5px solid ${theme.palette.secondary.main}`,
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
      <Box sx={{ml: '1rem', mr: '1rem'}}>
      <Grid container spacing={4}>
        {servicesText.map((service, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: '16px', boxShadow: 3 }}>
              <CardMedia
                component="img"
                image={photoMap[index % photoMap.length]}  // Safeguard if more texts than images
                alt={service.title}
                sx={{ height: 200 }}
              />
              <CardContent sx={{ flexGrow: 1, backgroundColor: theme.palette.background.paper }}>
                <Typography gutterBottom variant="h5" component="div" sx={{ color: theme.palette.text.primary }}>
                  {service.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ color: theme.palette.text.primary }}>
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