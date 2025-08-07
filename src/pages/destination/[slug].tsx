// src/pages/destination/[slug].tsx
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Typography,
  Button,
  useTheme,
  Container,
} from '@mui/material';
import { destinations } from '../../utils/destinations';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import NotifyMe from '../../components/NotifyMe';
import CustomTripForm from '../../components/CustomBookingForm';

const slugify = (text: string) =>
  text.toLowerCase().replace(/\s+/g, '-');

// ✅ FIXED: Updated interface for Next.js string paths
interface DestinationType {
  country: string;
  title: string;
  nights: string;
  price: number;
  image: string; // ✅ Changed from StaticImageData to string
  date: string;
  videoUrl?: string;
  isSlideshow?: boolean;
  whatYouWillEnjoy: string[];
  generalInfo: string[];
  descriptionPage: string;
  notifyMe?: boolean;
}

const DestinationDetails = () => {
  const [showForm, setShowForm] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const router = useRouter();
  const { slug } = router.query;
  
  // ✅ FIXED: Handle router loading state
  const destination = typeof slug === 'string' 
    ? destinations.find((d) => slugify(d.country) === slug)
    : null;

  useEffect(() => {
    // ✅ FIX: Only run on client-side
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }, []);

  const handleScrollToForm = () => {
    setShowForm(true);
    setTimeout(() => {
      // ✅ FIX: Only run on client-side
      if (typeof window !== 'undefined' && formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Show loading state if router is not ready yet
  if (router.isFallback || !router.isReady) {
    return (
      <>
        <Header />
        <Container maxWidth="md" sx={{ mt: 10, mb: 10, textAlign: 'center' }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Loading...
          </Typography>
        </Container>
        <Footer />
      </>
    );
  }

  // Show not found if destination doesn't exist
  if (!destination) {
    return (
      <>
        <Header />
        <Container maxWidth="md" sx={{ mt: 10, mb: 10, textAlign: 'center' }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Destination Not Found
          </Typography>
          <Typography variant="body1" gutterBottom>
            Sorry, we couldn't find the destination you're looking for.
          </Typography>
          <Button
            variant="contained"
            href="/"
            sx={{
              mt: 3,
              backgroundColor: theme.palette.secondary.main,
              color: theme.palette.primary.contrastText,
              '&:hover': {
                backgroundColor: theme.palette.secondary.dark,
              },
            }}
          >
            Go Back Home
          </Button>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <Box sx={{ backgroundColor: theme.palette.background.paper }}>
        {/* Hero Section */}
        <Box sx={{ backgroundColor: theme.palette.primary.main, py: 6 }}>
          <Container
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: 4,
              position: 'relative',
            }}
          >
            <Box
              component="img"
              src={destination.image}
              alt={destination.country}
              sx={{
                width: 520,
                height: 420,
                objectFit: 'cover',
                borderRadius: '16px',
                boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                transform: 'translate(-60px, 60px)',
                zIndex: 2,
                position: 'relative',
                [theme.breakpoints.down('md')]: {
                  width: '100%',
                  height: 'auto',
                  transform: 'none',
                },
              }}
            />
            <Box sx={{ color: theme.palette.primary.contrastText, maxWidth: '600px' }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {destination.title}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {destination.nights} — Starting from €{destination.price} —{' '}
                {new Date(destination.date).toLocaleDateString()}
              </Typography>
              {destination.notifyMe && (
                <Box sx={{ mt: 3 }}>
                  <NotifyMe 
                    destinationCountry={destination.country}
                    destinationTitle={destination.title}
                  />
                </Box>
              )}
            </Box>
          </Container>
        </Box>

        {/* Content Section */}
        <Container maxWidth="lg" sx={{ py: 6, color: theme.palette.text.primary }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 6,
            }}
          >
            <Box sx={{ flexGrow: 2, minWidth: 0, maxWidth: { md: 'calc(100% - 640px)' } }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                What will you enjoy?
              </Typography>
              <Box component="ul" sx={{ pl: 3, mb: 4 }}>
                {destination.whatYouWillEnjoy.map((item, idx) => (
                  <li key={idx}><Typography variant="body1">{item}</Typography></li>
                ))}
              </Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                General Information
              </Typography>
              <Box sx={{ mb: 4, pl: 2 }}>
                {destination.generalInfo.map((info, idx) => (
                  <Typography variant="body1" key={idx} gutterBottom>
                    {info}
                  </Typography>
                ))}
              </Box>
            </Box>

            {destination.videoUrl && (
              <Box sx={{ 
                width: 600, 
                height: 340, 
                flexShrink: 0, 
                borderRadius: '12px', 
                overflow: 'hidden', 
                boxShadow: '0px 6px 16px rgba(0,0,0,0.25)', 
                [theme.breakpoints.down('md')]: { 
                  width: '100%', 
                  height: 'auto' 
                } 
              }}>
                <iframe
                  width="100%"
                  height="100%"
                  src={destination.videoUrl.replace('watch?v=', 'embed/')}
                  title="Destination Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ border: 0 }}
                />
              </Box>
            )}
          </Box>

          <Box mt={6}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Description
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 5 }}>
              {destination.descriptionPage}
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 6 }}>
            {destination.notifyMe ? (
              <NotifyMe 
                destinationCountry={destination.country}
                destinationTitle={destination.title}
              />
            ) : (
              <Button
                variant="contained"
                onClick={handleScrollToForm}
                sx={{
                  backgroundColor: theme.palette.secondary.main,
                  color: theme.palette.primary.contrastText,
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  borderRadius: '20px',
                  padding: '10px 24px',
                  '&:hover': {
                    backgroundColor: theme.palette.secondary.dark,
                  },
                }}
              >
                Book Now
              </Button>
            )}
          </Box>
        </Container>

        {/* Custom Form */}
        {showForm && (
          <Box ref={formRef}>
            <CustomTripForm selectedDestination={destination.country} />
          </Box>
        )}
      </Box>

      <Footer />
    </>
  );
};

export default DestinationDetails;