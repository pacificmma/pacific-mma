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
import { StaticImageData } from 'next/image'; // Import StaticImageData

const animatedComponents = makeAnimated();

// Define a new interface for destinations specifically for this page
interface BookingPageDestination {
  country: string;
  title: string;
  nights: string;
  price?: number; // price is optional for custom experience
  image: StaticImageData | StaticImageData[]; // Can be a single StaticImageData or an array
  date?: string; // date is optional for custom experience
  videoUrl?: string; // videoUrl is optional for custom experience
  isSlideshow: boolean;
  description?: string;
  whatYouWillEnjoy?: string[];
  generalInfo?: string[];
  descriptionPage?: string;
  gyms?: string[];
  disciplines?: string[];
}

const customExperience: BookingPageDestination = { // Apply the new interface
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
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  // Combine customExperience with originalDestinations, ensuring type compatibility
  const destinations: BookingPageDestination[] = [
    customExperience,
    ...originalDestinations.map(d => ({ // Map originalDestinations to BookingPageDestination
      ...d,
      image: d.image as StaticImageData, // Ensure image is StaticImageData for single images
      isSlideshow: false, // Explicitly set isSlideshow for original destinations
    }))
  ];

  const gyms = Array.from(new Set(originalDestinations.flatMap(d => d.gyms)));
  const countries = Array.from(new Set(originalDestinations.map(d => d.country)));
  const trainings = Array.from(new Set(originalDestinations.flatMap(d => d.disciplines)));

  const [formData, setFormData] = useState({
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
    window.scrollTo(0, 0);
    const interval = setInterval(() => {
      setSlideshowIndex((prev) => (prev + 1) % (customExperience.image as StaticImageData[]).length); // Cast to array
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleCustomTripClick = () => {
    setShowForm(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSelectChange = (name: string) => (value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value.map((v: any) => v.value)
    }));
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <Header />
      <Box sx={{ backgroundColor: theme.palette.background.paper }}>
        {/* Hero */}
        <Box
          sx={{
            height: '60vh',
            backgroundImage: `url(${(BookingHeroPhoto as StaticImageData).src})`, // Access .src property
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            borderBottom: `5px solid ${theme.palette.secondary.main}`
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
              zIndex: 1,
              margin: '0 auto',
              fontFamily: theme.typography.fontFamily,
            }}
          >
            Design Your Own Martial Arts Journey
          </Typography>
        </Box>

        {/* Destination Cards */}
        <Container maxWidth="lg" sx={{ py: 10 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={3}>
              <Typography variant="h3" fontWeight="bold" gutterBottom>
                Our Favourite <br /> Luxury MMA Vacations
              </Typography>
              <Typography>
                Your trip should be as unique as your journey. Start with a custom plan or explore one of our crafted experiences.
              </Typography>
            </Grid>
            <Grid item xs={12} md={9}>
              <Grid container spacing={4}>
                {destinations.map((dest, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Box
                      onClick={dest.country === 'Custom Experience' ? handleCustomTripClick : undefined}
                      sx={{
                        width: '100%',
                        height: { xs: '300px', sm: '350px', md: '440px' },
                        borderRadius: '12px',
                        overflow: 'hidden',
                        position: 'relative',
                        cursor: 'pointer',
                        boxShadow: '0px 4px 12px rgba(0,0,0,0.2)',
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'scale(1.03)'
                        }
                      }}
                    >
                      <Box
                        sx={{
                          width: '100%',
                          height: '100%',
                          backgroundImage: `url(${
                            dest.isSlideshow
                              ? (dest.image as StaticImageData[])[slideshowIndex].src // Correctly access src from array item
                              : (dest.image as StaticImageData).src // Correctly access src from single image
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
                          height: '33.33%', // Kartın 1/3'ü kadar yükseklik
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
                            height: '100%', // Hover'da tüm kart yüksekliğini kapla
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
                              WebkitLineClamp: 3, // Varsayılan olarak 3 satır göster
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              '.destination-info:hover &': {
                                WebkitLineClamp: 'unset', // Hover durumunda tüm metni göster
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
                            mt: 'auto', // Alt tarafa ittir
                            mb: { xs: 1, md: 1 },
                            borderRadius: '30px',
                            color: theme.palette.primary.contrastText,
                            backgroundColor: theme.palette.secondary.main,
                            fontWeight: 'bold',
                            textTransform: 'none',
                            fontSize: { xs: '0.7rem', sm: '0.9rem', md: '1rem' },
                            padding: { xs: '4px 8px', md: '6px 12px' },
                            opacity: 0, // Varsayılan olarak gizli
                            transition: 'opacity 0.3s ease',
                            '.destination-info:hover &': {
                              opacity: 1, // Hover durumunda göster
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