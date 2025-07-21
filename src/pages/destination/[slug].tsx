// src/pages/destination/[slug].tsx
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router'; // Correct Next.js router import
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
import Header from '../../components/Header'; // Adjusted import path for Header
import Footer from '../../components/Footer'; // Adjusted import path for Footer

const slugify = (text: string) =>
  text.toLowerCase().replace(/\s+/g, '-');

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
  const { slug } = router.query; // Correctly accessing slug from router.query
  const destination = destinations.find((d: any) => slugify(d.country) === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleScrollToForm = () => {
    setShowForm(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
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
    } finally {
      setSnackbarOpen(true);
    }
  };

  if (!destination) {
    // In Next.js, for dynamic routes, you might want to return a 404 page
    // if the slug does not match any destination.
    // For now, returning null or a loading state is fine during development.
    // You could also use router.isFallback if you implemented getStaticPaths.
    return null;
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
              <Typography>
                {destination.nights} — Starting from €{destination.price} —{' '}
                {new Date(destination.date).toLocaleDateString()}
              </Typography>
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
              <Box sx={{ width: 600, height: 340, flexShrink: 0, borderRadius: '12px', overflow: 'hidden', boxShadow: '0px 6px 16px rgba(0,0,0,0.25)', [theme.breakpoints.down('md')]: { width: '100%', height: 'auto' } }}>
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

        {showForm && (
          <Container ref={formRef} maxWidth="md" sx={{ mt: 8, mb: 10 }}>
            <Box sx={{ backgroundColor: theme.palette.background.default, padding: 4, borderRadius: '16px', boxShadow: '0 6px 18px rgba(0,0,0,0.1)' }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Book Your Trip — {destination.country} ({new Date(destination.date).toLocaleDateString()})
              </Typography>
              <Box component="form" sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
                <TextField label="Full Name" fullWidth required value={formData.fullName} onChange={(e) => handleChange('fullName', e.target.value)} InputLabelProps={{ style: { color: theme.palette.text.primary } }} InputProps={{ style: { color: theme.palette.text.primary } }} />
                <TextField label="Email" type="email" fullWidth required value={formData.email} onChange={(e) => handleChange('email', e.target.value)} InputLabelProps={{ style: { color: theme.palette.text.primary } }} InputProps={{ style: { color: theme.palette.text.primary } }} />
                <TextField label="Phone Number" fullWidth required value={formData.phoneNumber} onChange={(e) => handleChange('phoneNumber', e.target.value)} InputLabelProps={{ style: { color: theme.palette.text.primary } }} InputProps={{ style: { color: theme.palette.text.primary } }} />
                <TextField label="Selected Package" value={`${destination.country} – ${destination.nights}`} fullWidth disabled InputLabelProps={{ style: { color: theme.palette.text.primary } }} InputProps={{ style: { color: theme.palette.text.primary } }} />
                <TextField select label="Meal Plan" fullWidth required value={formData.mealPlan} onChange={(e) => handleChange('mealPlan', e.target.value)} InputLabelProps={{ style: { color: theme.palette.text.primary } }} InputProps={{ style: { color: theme.palette.text.primary } }}>
                  <MenuItem value="vegetarian">Vegetarian</MenuItem>
                  <MenuItem value="carnivore">Carnivore</MenuItem>
                  <MenuItem value="pescatarian">Pescatarian</MenuItem>
                  <MenuItem value="no_preference">No Preference</MenuItem>
                </TextField>
                <TextField select label="Comfort Level" fullWidth required value={formData.comfortLevel} onChange={(e) => handleChange('comfortLevel', e.target.value)} InputLabelProps={{ style: { color: theme.palette.text.primary } }} InputProps={{ style: { color: theme.palette.text.primary } }}>
                  <MenuItem value="basic">Basic</MenuItem>
                  <MenuItem value="standart">Standart</MenuItem>
                  <MenuItem value="deluxe">Deluxe</MenuItem>
                  <MenuItem value="vip">VIP</MenuItem>
                </TextField>
                <TextField label="Personal Note" fullWidth multiline rows={4} value={formData.personalNote} onChange={(e) => handleChange('personalNote', e.target.value)} sx={{ gridColumn: '1 / -1' }} InputLabelProps={{ style: { color: theme.palette.text.primary } }} InputProps={{ style: { color: theme.palette.text.primary } }} />
              </Box>
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Button onClick={handleSubmit} variant="contained" sx={{ backgroundColor: theme.palette.secondary.main, color: theme.palette.primary.contrastText, fontWeight: 'bold', padding: '10px 24px', borderRadius: '20px', '&:hover': { backgroundColor: theme.palette.secondary.dark } }}>
                  Submit Booking
                </Button>
              </Box>
            </Box>
          </Container>
        )}
      </Box>
      <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={() => setSnackbarOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snackbarSeverity} variant="filled" onClose={() => setSnackbarOpen(false)}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Footer />
    </>
  );
};

export default DestinationDetails;