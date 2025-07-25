// src/pages/destination/[slug].tsx
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Typography,
  Button,
  useTheme,
  Container,
  TextField,
  MenuItem,
  Snackbar,
  Alert,
} from '@mui/material';
import { destinations } from '../../utils/destinations';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

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
}

const DestinationDetails = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    mealPlan: '',
    comfortLevel: '',
    personalNote: '',
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const formRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const router = useRouter();
  const { slug } = router.query;
  
  // ✅ FIXED: No casting needed now - types match
  const destination = destinations.find((d) => slugify(d.country) === slug);

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

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const payload = {
      fullName: formData.fullName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      selectedPackage: `${destination?.country} – ${destination?.nights}`,
      mealPlan: formData.mealPlan,
      comfortLevel: formData.comfortLevel,
      personalNote: formData.personalNote,
    };

    try {
      const res = await fetch('https://wlfn4kghud.execute-api.us-west-2.amazonaws.com/production/packageBooking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Booking failed');
      setSnackbarMessage('Thank you! Your booking has been submitted.');
      setSnackbarSeverity('success');
      setFormData({
        fullName: '',
        email: '',
        phoneNumber: '',
        mealPlan: '',
        comfortLevel: '',
        personalNote: '',
      });
    } catch (err) {
      setSnackbarMessage('Something went wrong. Please try again later.');
      setSnackbarSeverity('error');
    }
    setSnackbarOpen(true);
  };

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
      
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          width: '100vw',
          height: { xs: '50vh', sm: '60vh', md: '70vh' },
          backgroundImage: `url(${destination.image})`, // ✅ FIXED: Direct string usage (no .src needed)
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
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
          }}
        />
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <Typography
            variant="h2"
            sx={{
              color: theme.palette.primary.contrastText,
              fontWeight: 'bold',
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
              mb: 2,
            }}
          >
            {destination.country}
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: theme.palette.primary.contrastText,
              fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' },
              mb: 3,
            }}
          >
            {destination.title}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.primary.contrastText,
              fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
              mb: 1,
            }}
          >
            Duration: {destination.nights}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.primary.contrastText,
              fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
            }}
          >
            Date: {new Date(destination.date).toLocaleDateString()}
          </Typography>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        {/* What You Will Enjoy Section */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: theme.palette.text.primary, mb: 3 }}>
            What You Will Enjoy
          </Typography>
          <Box component="ul" sx={{ pl: 3 }}>
            {destination.whatYouWillEnjoy.map((item, index) => (
              <Typography component="li" key={index} variant="body1" sx={{ mb: 1, fontSize: '1.1rem', lineHeight: 1.6 }}>
                {item}
              </Typography>
            ))}
          </Box>
        </Box>

        {/* General Information Section */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: theme.palette.text.primary, mb: 3 }}>
            General Information
          </Typography>
          <Box component="ul" sx={{ pl: 3 }}>
            {destination.generalInfo.map((info, index) => (
              <Typography component="li" key={index} variant="body1" sx={{ mb: 1, fontSize: '1.1rem', lineHeight: 1.6 }}>
                {info}
              </Typography>
            ))}
          </Box>
        </Box>

        {/* Description Section */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: theme.palette.text.primary, mb: 3 }}>
            About This Experience
          </Typography>
          <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, mb: 5 }}>
            {destination.descriptionPage}
          </Typography>
        </Box>

        <Box sx={{ textAlign: 'center', mt: 6 }}>
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
        </Box>
      </Container>

      {/* Booking Form */}
      {showForm && (
        <Container ref={formRef} maxWidth="md" sx={{ mt: 8, mb: 10 }}>
          <Box sx={{ backgroundColor: theme.palette.background.default, padding: 4, borderRadius: '16px', boxShadow: '0 6px 18px rgba(0,0,0,0.1)' }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Book Your Trip — {destination.country} ({new Date(destination.date).toLocaleDateString()})
            </Typography>
            <Box component="form" sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
              <TextField 
                label="Full Name" 
                fullWidth 
                required 
                value={formData.fullName} 
                onChange={(e) => handleChange('fullName', e.target.value)} 
                InputLabelProps={{ style: { color: theme.palette.text.primary } }} 
                InputProps={{ style: { color: theme.palette.text.primary } }}
              />
              <TextField 
                label="Email" 
                fullWidth 
                required 
                type="email" 
                value={formData.email} 
                onChange={(e) => handleChange('email', e.target.value)} 
                InputLabelProps={{ style: { color: theme.palette.text.primary } }} 
                InputProps={{ style: { color: theme.palette.text.primary } }}
              />
              <TextField 
                label="Phone Number" 
                fullWidth 
                required 
                value={formData.phoneNumber} 
                onChange={(e) => handleChange('phoneNumber', e.target.value)} 
                InputLabelProps={{ style: { color: theme.palette.text.primary } }} 
                InputProps={{ style: { color: theme.palette.text.primary } }}
              />
              <TextField 
                label="Meal Plan" 
                select 
                fullWidth 
                value={formData.mealPlan} 
                onChange={(e) => handleChange('mealPlan', e.target.value)} 
                InputLabelProps={{ style: { color: theme.palette.text.primary } }} 
                InputProps={{ style: { color: theme.palette.text.primary } }}
              >
                <MenuItem value="All Inclusive">All Inclusive</MenuItem>
                <MenuItem value="Half Board">Half Board</MenuItem>
                <MenuItem value="Breakfast Only">Breakfast Only</MenuItem>
                <MenuItem value="Self Catering">Self Catering</MenuItem>
              </TextField>
              <TextField 
                label="Comfort Level" 
                select 
                fullWidth 
                value={formData.comfortLevel} 
                onChange={(e) => handleChange('comfortLevel', e.target.value)} 
                InputLabelProps={{ style: { color: theme.palette.text.primary } }} 
                InputProps={{ style: { color: theme.palette.text.primary } }}
              >
                <MenuItem value="Budget">Budget</MenuItem>
                <MenuItem value="Standard">Standard</MenuItem>
                <MenuItem value="Luxury">Luxury</MenuItem>
              </TextField>
              <TextField 
                label="Personal Note (Optional)" 
                fullWidth 
                multiline 
                rows={3} 
                value={formData.personalNote} 
                onChange={(e) => handleChange('personalNote', e.target.value)} 
                sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }} 
                InputLabelProps={{ style: { color: theme.palette.text.primary } }} 
                InputProps={{ style: { color: theme.palette.text.primary } }}
              />
              <Button 
                variant="contained" 
                onClick={handleSubmit} 
                sx={{ 
                  gridColumn: { xs: '1', sm: '1 / -1' }, 
                  backgroundColor: theme.palette.secondary.main, 
                  color: theme.palette.primary.contrastText, 
                  fontWeight: 'bold', 
                  fontSize: '1rem', 
                  borderRadius: '20px', 
                  padding: '12px 24px', 
                  '&:hover': { backgroundColor: theme.palette.secondary.dark } 
                }}
              >
                Submit Booking
              </Button>
            </Box>
          </Box>
        </Container>
      )}

      {/* Success/Error Snackbar */}
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={6000} 
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity={snackbarSeverity} 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Footer />
    </>
  );
};

export default DestinationDetails;