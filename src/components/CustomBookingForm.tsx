import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  MenuItem,
  useTheme,
  Paper,
  Divider,
  Container,
  Snackbar,
  Alert,
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

interface SelectOption {
  label: string;
  value: string;
}

interface FormData {
  name: string;
  phone: string;
  email: string;
  startDate: Date | null;
  endDate: Date | null;
  destination: SelectOption[];
  training: SelectOption[];
  gym: SelectOption[];
  mealPlan: string;
  comfort: string;
  budget: string;
  note: string;
}

type FormField = keyof FormData;

const mealPlans = ['Vegetarian', 'Carnivore', 'No Preference', 'Pescatarian'];
const comfortLevels = ['Basic', 'Deluxe', 'VIP'];
const budgets = ['Standard', 'Premium'];
const gymOptions = [
  'Alliance MMA Gym', 'American Kickboxing Academy', 'American Top Team', 'Brazilian Top Team',
  'Cruz MMA', 'El Nino Training Center', "Eric Paulson's CSW Academy", 'Pacific MMA Academy',
  'Team Alpha Male', 'Tiger Muay Thai', 'UFC Gyms', 'World Team USA', 'Rise Combat Sports',
  'Woodenman Muay Thai', 'CJ Judo', 'Gracie Barra Jiu Jitsu', 'Nakano Judo Academy',
  'Ralph Gracie Jiu Jitsu', 'United Wrestling Academy',
];
const trainingOptions = ['Boxing', 'Muay Thai', 'Wrestling', 'BJJ'];
const destinationOptions = [
  'Florida', 'Brazil', 'California', 'New York', 'Las Vegas', 'Nevada', 'Japan', 'Thailand',
  'San Francisco', 'Phuket', 'Bangkok', 'Miami', 'Los Angeles', 'San Diego', 'Chicago',
  'Austin', 'Denver', 'Seattle', 'Phoenix', 'Atlanta'
];

interface CustomTripFormProps {
  selectedDestination?: string;
}

const CustomTripForm = ({ selectedDestination = '' }: CustomTripFormProps) => {
  const theme = useTheme();

  // Seçilen destinasyonu default olarak ayarla
  const getInitialDestination = () => {
    if (selectedDestination) {
      const matchedDestination = destinationOptions.find(dest =>
        dest.toLowerCase() === selectedDestination.toLowerCase()
      );
      if (matchedDestination) {
        return [{ label: matchedDestination, value: matchedDestination }];
      }
    }
    return [];
  };

  const [formData, setFormData] = useState<FormData>({
    name: '', phone: '', email: '', startDate: null, endDate: null,
    destination: getInitialDestination(),
    training: [], gym: [], mealPlan: '', comfort: '', budget: '', note: '',
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  // 🔧 FIX: Proper typing for handleChange (48:32, 48:44)
  const handleChange = (field: FormField, value: FormData[FormField]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const payload = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      startDate: formData.startDate,
      endDate: formData.endDate,
      destination: formData.destination,
      training: formData.training,
      gym: formData.gym,
      mealPlan: formData.mealPlan,
      comfort: formData.comfort,
      budget: formData.budget,
      note: formData.note,
    };
    try {
      const res = await fetch('https://58uunlaqjj.execute-api.us-west-2.amazonaws.com/production/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Submission failed');
      setSnackbarMessage('Your custom trip request has been submitted!');
      setSnackbarSeverity('success');
      setFormData({ name: '', phone: '', email: '', startDate: null, endDate: null, destination: [], training: [], gym: [], mealPlan: '', comfort: '', budget: '', note: '' });
    } catch {
      // 🔧 FIX: Removed unused 'error' variable (77:14)
      setSnackbarMessage('Something went wrong. Please try again.');
      setSnackbarSeverity('error');
    } finally {
      setSnackbarOpen(true);
    }
  };

  // 🔧 FIX: Proper typing for select styles (86:21, 94:20, 94:32)
  const selectStyle = {
    control: (base: Record<string, unknown>) => ({
      ...base,
      backgroundColor: theme.palette.background.paper,
      borderColor: theme.palette.divider,
      boxShadow: 'none',
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.body2.fontSize,
    }),
    option: (base: Record<string, unknown>, state: { isFocused: boolean }) => ({
      ...base,
      backgroundColor: state.isFocused ? theme.palette.action.hover : theme.palette.background.paper,
      color: theme.palette.text.primary,
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.body2.fontSize,
    }),
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 3, backgroundColor: theme.palette.background.default, border: `1px solid ${theme.palette.divider}`, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: theme.typography.h5.fontWeight, color: theme.palette.text.primary, textAlign: 'center' }}>
          Custom Trip Inquiry
        </Typography>

        <Divider sx={{ mb: 4 }} />

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Full Name"
              fullWidth
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              sx={{ '& label': { color: theme.palette.text.primary } }}
            />
            <TextField
              label="Phone"
              fullWidth
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              sx={{ mt: 3, '& label': { color: theme.palette.text.primary } }}
            />
            <TextField
              label="Email"
              fullWidth
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              sx={{ mt: 3, '& label': { color: theme.palette.text.primary } }}
            />

            <Box sx={{ mt: 4, p: 2, border: `1px solid ${theme.palette.text.primary}`, borderRadius: 2, backgroundColor: theme.palette.background.paper }}>
              <Typography variant="body2" sx={{ mb: 2, fontStyle: 'italic', color: theme.palette.secondary.main, textAlign: 'center', fontSize: '0.9rem' }}>
                ✈️ To ensure the best experience, we plan trips 90+ days in advance for premium arrangements
              </Typography>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: theme.typography.body1.fontWeight, color: theme.palette.text.primary }}>
                Start Date
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  value={formData.startDate}
                  onChange={(newValue) => handleChange('startDate', newValue)}
                  minDate={new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)}
                  slotProps={{ textField: { fullWidth: true } }}
                  sx={{ '& label': { color: theme.palette.text.primary } }}
                />
              </LocalizationProvider>

              <Typography variant="body1" sx={{ mt: 2, mb: 1, fontWeight: theme.typography.body1.fontWeight, color: theme.palette.text.primary }}>
                End Date
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="End Date"
                  value={formData.endDate}
                  onChange={(newValue) => handleChange('endDate', newValue)}
                  minDate={formData.startDate || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)}
                  slotProps={{ textField: { fullWidth: true } }}
                  sx={{ '& label': { color: theme.palette.text.primary } }}
                />
              </LocalizationProvider>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: theme.typography.body1.fontWeight, color: theme.palette.text.primary, zIndex: 1 }}>
              Select Destinations
            </Typography>
            <Select
              isMulti
              options={destinationOptions.map((val) => ({ label: val, value: val }))}
              value={formData.destination}
              onChange={(val) => handleChange('destination', val as SelectOption[])}
              styles={{
                ...selectStyle,
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              }}
              components={animatedComponents}
              menuPortalTarget={typeof window !== 'undefined' ? document.body : undefined}
            />


            <Typography variant="body1" sx={{ mt: 3, mb: 1, fontWeight: theme.typography.body1.fontWeight, color: theme.palette.text.primary, zIndex: 1 }}>
              Select Trainings
            </Typography>
            <Select
              isMulti
              options={trainingOptions.map((val) => ({ label: val, value: val }))}
              value={formData.training}
              onChange={(val) => handleChange('training', val as SelectOption[])}
              styles={{
                ...selectStyle,
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              }}
              components={animatedComponents}
              menuPortalTarget={typeof window !== 'undefined' ? document.body : undefined}
            />


            <Typography variant="body1" sx={{ mt: 3, mb: 1, fontWeight: theme.typography.body1.fontWeight, color: theme.palette.text.primary, zIndex: 1 }}>
              Select Gyms
            </Typography>
            <Select
              isMulti
              options={gymOptions.map((val) => ({ label: val, value: val }))}
              value={formData.gym}
              onChange={(val) => handleChange('gym', val as SelectOption[])}
              styles={{
                ...selectStyle,
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              }}
              components={animatedComponents}
              menuPortalTarget={typeof window !== 'undefined' ? document.body : undefined}
            />

          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              select
              label="Meal Plan"
              fullWidth
              value={formData.mealPlan}
              onChange={(e) => handleChange('mealPlan', e.target.value)}
              sx={{ '& label': { color: theme.palette.text.primary } }}
            >
              {mealPlans.map((plan) => (
                <MenuItem key={plan} value={plan}>{plan}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              select
              label="Comfort Level"
              fullWidth
              value={formData.comfort}
              onChange={(e) => handleChange('comfort', e.target.value)}
              sx={{ '& label': { color: theme.palette.text.primary } }}
            >
              {comfortLevels.map((c) => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              select
              label="Budget"
              fullWidth
              value={formData.budget}
              onChange={(e) => handleChange('budget', e.target.value)}
              sx={{ '& label': { color: theme.palette.text.primary } }}
            >
              {budgets.map((b) => (
                <MenuItem key={b} value={b}>{b}</MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Personal Note"
              fullWidth
              multiline
              rows={4}
              value={formData.note}
              onChange={(e) => handleChange('note', e.target.value)}
              sx={{ '& label': { color: theme.palette.text.primary } }}
            />
          </Grid>

          <Grid item xs={12} sx={{ textAlign: 'center', mt: 4 }}>
            <Typography
              variant="body1"
              sx={{
                mt: 3,
                mb: 1,
                fontWeight: theme.typography.body1.fontWeight,
                color: theme.palette.text.primary,
                zIndex: 1,
                fontStyle: 'italic',
              }}
            >
              {/* 🔧 FIX: Escaped apostrophe (285:17) */}
              We&apos;ll reach out shortly to help you design and book your perfect trip
            </Typography>
            <Button
              onClick={handleSubmit}
              variant="contained"
              sx={{
                backgroundColor: theme.palette.secondary.main,
                color: theme.palette.primary.contrastText,
                fontWeight: theme.typography.button.fontWeight,
                px: 4,
                py: 1.5,
                borderRadius: '30px',
                fontSize: theme.typography.button.fontSize,
                '&:hover': {
                  backgroundColor: theme.palette.secondary.dark,
                },
              }}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbarSeverity}
          variant="filled"
          onClose={() => setSnackbarOpen(false)}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CustomTripForm;