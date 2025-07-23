// src/pages/book.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  Box, Typography, Container, Grid, Button,
  useTheme,
} from '@mui/material';
import Link from 'next/link';
import dynamic from 'next/dynamic';

import Header from '../components/Header';
import Footer from '../components/Footer';
import BookingHeroPhoto from '../assets/img/booking_page/bookingHero.jpg';
import NewYorkPhoto from '../assets/img/home_page/photo-newyork.jpg';
import SanFranciscoPhoto from '../assets/img/home_page/photo-sanfrancisco.jpg';
import NevadaPhoto from '../assets/img/home_page/photo-nevada.jpg';
import LasVegasPhoto from '../assets/img/home_page/photo-lasvegas.jpg';
import JapanPhoto from '../assets/img/home_page/photo-japan.jpg';
import ThailandPhoto from '../assets/img/home_page/photo-thailand.jpg';
import { destinations as originalDestinations } from '../utils/destinations';
import { StaticImageData } from 'next/image';

// ✅ FIX: Dynamically import CustomTripForm to avoid SSR issues
const CustomTripForm = dynamic(() => import('../components/CustomBookingForm'), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

// Define a new interface for destinations specifically for this page
interface BookingPageDestination {
  country: string;
  title: string;
  nights: string;
  price?: number;
  image: StaticImageData | StaticImageData[];
  date?: string;
  videoUrl?: string;
  isSlideshow: boolean;
  description?: string;
  whatYouWillEnjoy?: string[];
  generalInfo?: string[];
  descriptionPage?: string;
  gyms?: string[];
  disciplines?: string[];
}

// ✅ FIX: Import the shared hook instead
import { useBrowser } from '../hooks/useBrowser';

const BookPage = () => {
  const theme = useTheme();
  const formRef = useRef<HTMLDivElement>(null);
  const [slideshowIndex, setSlideshowIndex] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  
  // ✅ FIX: Use the shared browser hook
  const { isBrowser } = useBrowser();

  // Convert destinations for this specific page
  const destinations: BookingPageDestination[] = [
    {
      country: 'New York',
      title: 'Experience the city that never sleeps while training with top MMA athletes',
      nights: '7 days, 6 nights',
      image: NewYorkPhoto,
      isSlideshow: false,
    },
    {
      country: 'San Francisco',
      title: 'Train by the bay with world-class coaches and stunning views',
      nights: '7 days, 6 nights',
      image: SanFranciscoPhoto,
      isSlideshow: false,
    },
    {
      country: 'Nevada',
      title: 'Desert training camps with professional fighters',
      nights: '7 days, 6 nights',
      image: NevadaPhoto,
      isSlideshow: false,
    },
    {
      country: 'Las Vegas',
      title: 'Train in the fight capital of the world',
      nights: '7 days, 6 nights',
      image: LasVegasPhoto,
      isSlideshow: false,
    },
    {
      country: 'Japan',
      title: 'Traditional martial arts meets modern MMA in the land of the rising sun',
      nights: '10 days, 9 nights',
      image: JapanPhoto,
      isSlideshow: false,
    },
    {
      country: 'Thailand',
      title: 'Muay Thai paradise with authentic training experiences',
      nights: '10 days, 9 nights',
      image: ThailandPhoto,
      isSlideshow: false,
    },
  ];

  // Custom slideshow destination
  const customExperience: BookingPageDestination = {
    country: 'Custom Experience',
    title: 'Create your personalized MMA adventure anywhere in the world',
    nights: 'Customizable duration',
    image: [NewYorkPhoto, SanFranciscoPhoto, NevadaPhoto, LasVegasPhoto, JapanPhoto, ThailandPhoto],
    isSlideshow: true,
  };

  const allDestinations = [...destinations, customExperience];

  const handleShowForm = () => {
    setShowForm(true);
  };

  // Mock data for form (these would typically come from your backend)
  const gyms = ['Gym 1', 'Gym 2', 'Gym 3'];
  const countries = ['USA', 'Japan', 'Thailand', 'Brazil'];
  const trainings = ['Boxing', 'Muay Thai', 'BJJ', 'Wrestling'];

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    startDate: null as Date | null,
    endDate: null as Date | null,
    country: [] as string[],
    gym: [] as string[],
    training: [] as string[],
    message: ''
  });

  interface SelectOption {
    value: string;
    label: string;
  }

  const handleSelectChange = (name: string) => (value: SelectOption[]) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value.map((v: SelectOption) => v.value)
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    // ✅ FIX: Only scroll to top on client-side
    if (isBrowser && typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
    
    // Slideshow for custom experience
    const interval = setInterval(() => {
      setSlideshowIndex((prev) => (prev + 1) % (customExperience.image as StaticImageData[]).length);
    }, 2000);
    return () => clearInterval(interval);
  }, [isBrowser]);

  const handleCustomTripClick = () => {
    setShowForm(true);
    setTimeout(() => {
      // ✅ FIX: Only scroll on client-side with proper checks
      if (isBrowser && typeof window !== 'undefined' && formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <>
      <Header />
      <Box>
        {/* Hero Section */}
        <Box
          sx={{
            position: 'relative',
            width: '100vw',
            height: { xs: '40vh', sm: '50vh', md: '60vh' },
            backgroundImage: `url(${BookingHeroPhoto.src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 6,
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}
          />
          <Typography
            variant="h2"
            sx={{
              position: 'relative',
              zIndex: 1,
              color: theme.palette.primary.contrastText,
              fontWeight: 'bold',
              textAlign: 'center',
              fontSize: { xs: '2rem', sm: '3rem', md: '4rem' },
            }}
          >
            Book Your Experience
          </Typography>
        </Box>

        {/* Destinations Grid */}
        <Container maxWidth="xl" sx={{ mb: 6 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography
                variant="h4"
                fontWeight="bold"
                gutterBottom
                sx={{
                  textAlign: 'center',
                  color: theme.palette.text.primary,
                  mb: 4,
                }}
              >
                Choose Your Adventure
              </Typography>
              <Grid container spacing={3}>
                {allDestinations.map((dest, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                    <Box
                      sx={{
                        position: 'relative',
                        height: '350px',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundImage: `url(${
                            dest.isSlideshow && Array.isArray(dest.image)
                              ? (dest.image as StaticImageData[])[slideshowIndex].src
                              : (dest.image as StaticImageData).src
                          })`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      />
                      <Box
                        className="destination-info"
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: '33.33%',
                          background: 'rgba(0, 0, 0, 0.7)',
                          color: '#fff',
                          p: { xs: 1, md: 1.5 },
                          zIndex: 1,
                          transition: 'height 0.3s ease',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          overflow: 'hidden',
                          '&:hover': {
                            height: '100%',
                          }
                        }}
                      >
                        <Box>
                          <Typography
                            variant="body2"
                            fontWeight="bold"
                            sx={{
                              fontSize: { xs: '0.8rem', sm: '0.95rem', md: '1.1rem' },
                              color: theme.palette.primary.contrastText,
                              mb: 0.5,
                            }}
                          >
                            {dest.country}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: { xs: '0.75rem', sm: '0.9rem', md: '1rem' },
                              color: theme.palette.primary.contrastText,
                              mb: 0.5,
                            }}
                          >
                            {dest.nights}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: { xs: '0.75rem', sm: '0.9rem', md: '1rem' },
                              display: '-webkit-box',
                              color: theme.palette.primary.contrastText,
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              '.destination-info:hover &': {
                                WebkitLineClamp: 'unset',
                              },
                            }}
                          >
                            {dest.title}
                          </Typography>
                        </Box>
                        
                        <Button
                          component={dest.country !== 'Custom Experience' ? Link : 'button'}
                          href={
                            dest.country !== 'Custom Experience'
                              ? `/destination/${dest.country.toLowerCase().replace(/\s+/g, '-')}`
                              : undefined
                          }
                          onClick={dest.country === 'Custom Experience' ? handleCustomTripClick : undefined}
                          variant="contained"
                          sx={{
                            mt: 2,
                            backgroundColor: theme.palette.primary.main,
                            color: theme.palette.primary.contrastText,
                            fontWeight: 'bold',
                            fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.9rem' },
                            py: { xs: 0.5, md: 1 },
                            '&:hover': {
                              backgroundColor: theme.palette.primary.dark,
                            },
                          }}
                        >
                          {dest.country === 'Custom Experience' ? 'Create Custom Trip' : 'Book Now'}
                        </Button>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Container>

        {/* ✅ FIX: Only render form when on client-side and showForm is true */}
        {isBrowser && showForm && (
          <Box ref={formRef} sx={{ mt: 6 }}>
            <CustomTripForm />
          </Box>
        )}
      </Box>
      <Footer />
    </>
  );
};

export default BookPage;