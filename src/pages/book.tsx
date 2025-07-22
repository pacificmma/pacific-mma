// src/pages/book.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  Box, Typography, Container, Grid, Button, Paper,
  useTheme,
  TextField,
  MenuItem
} from '@mui/material';
import { motion } from 'framer-motion';
import Link from 'next/link';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import 'react-datepicker/dist/react-datepicker.css';

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
import CustomTripForm from '../components/CustomBookingForm';
import { StaticImageData } from 'next/image';

const animatedComponents = makeAnimated();

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

// Define types for form data and select options
interface FormData {
  name: string;
  phone: string;
  email: string;
  destinations: string[];
  gyms: string[];
  trainings: string[];
  mealPlan: string;
  comfort: string;
  budget: string;
  note: string;
}

interface SelectOption {
  value: string;
  label: string;
}

const customExperience: BookingPageDestination = {
  country: 'Custom Experience',
  title: 'Design Your Custom Trip',
  nights: 'Flexible',
  image: [NewYorkPhoto, SanFranciscoPhoto, NevadaPhoto, LasVegasPhoto, JapanPhoto, ThailandPhoto],
  isSlideshow: true,
};

const BookingPage = () => {
  const theme = useTheme();
  const [showForm, setShowForm] = useState(false);
  const formRef = useRef<HTMLDivElement | null>(null);

  const [slideshowIndex, setSlideshowIndex] = useState(0);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);

  const handleShowForm = () => {
    setShowForm(true);
    setTimeout(() => {
      if (typeof window !== 'undefined' && formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }

  // Combine customExperience with originalDestinations, ensuring type compatibility
  const destinations: BookingPageDestination[] = [
    customExperience,
    ...originalDestinations.map(d => ({
      ...d,
      image: d.image as StaticImageData,
      isSlideshow: false,
    }))
  ];

  const gyms = Array.from(new Set(originalDestinations.flatMap(d => d.gyms)));
  const countries = Array.from(new Set(originalDestinations.map(d => d.country)));
  const trainings = Array.from(new Set(originalDestinations.flatMap(d => d.disciplines)));

  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    destinations: [],
    gyms: [],
    trainings: [],
    mealPlan: '',
    comfort: '',
    budget: '',
    note: '',
  });

  useEffect(() => {
    // ✅ FIX: Only run on client-side
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
    
    const interval = setInterval(() => {
      setSlideshowIndex((prev) => (prev + 1) % (customExperience.image as StaticImageData[]).length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleCustomTripClick = () => {
    setShowForm(true);
    setTimeout(() => {
      // ✅ FIX: Only run on client-side
      if (typeof window !== 'undefined' && formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

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
                {destinations.map((dest, index) => (
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
                            mt: 'auto',
                            mb: { xs: 1, md: 1 },
                            borderRadius: '30px',
                            color: theme.palette.primary.contrastText,
                            backgroundColor: theme.palette.secondary.main,
                            fontWeight: 'bold',
                            textTransform: 'none',
                            fontSize: { xs: '0.7rem', sm: '0.9rem', md: '1rem' },
                            padding: { xs: '4px 8px', md: '6px 12px' },
                            opacity: 0,
                            transition: 'opacity 0.3s ease',
                            '.destination-info:hover &': {
                              opacity: 1,
                            },
                            '&:hover': {
                              backgroundColor: theme.palette.secondary.dark,
                            },
                          }}
                        >
                          {dest.country === 'Custom Experience' 
                            ? 'Start Custom Booking' 
                            : `Discover ${dest.country} Trip`}
                        </Button>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Container>

        {/* Custom Form */}
        <Box ref={formRef}>
          <CustomTripForm />
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default BookingPage;