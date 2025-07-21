import React, { useState, useEffect } from 'react';
import {
  Box,
  Modal,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useFirebaseAuth } from '../providers/fireBaseAuthProvider';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import GoogleIcon from '@mui/icons-material/Google';

type SignUpModalProps = {
  open: boolean;
  onClose: () => void;
};

interface State {
  name: string;
  code: string;
}

interface County {
  name: string;
  code: string;
  state: string;
}

interface Place {
  name: string;
  code: string;
  state: string;
}

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  maxHeight: '90vh',
  overflowY: 'auto',
};

const SignUpModal = ({ open, onClose }: SignUpModalProps) => {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Address fields
  const [selectedState, setSelectedState] = useState('');
  const [selectedCounty, setSelectedCounty] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [zipCode, setZipCode] = useState('');

  // Address data
  const [states, setStates] = useState<State[]>([]);
  const [counties, setCounties] = useState<County[]>([]);
  const [cities, setCities] = useState<Place[]>([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCounties, setLoadingCounties] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');


  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  const validatePassword = (pwd: string) => passwordRegex.test(pwd);

  // Fetch states from Census API
  const fetchStates = async () => {
    setLoadingStates(true);
    try {
      const response = await fetch('https://api.census.gov/data/2020/dec/pl?get=NAME&for=state:*');
      const data = await response.json();

      if (data && data.length > 1) {
        const stateList: State[] = data.slice(1).map((item: string[]) => ({
          name: item[0],
          code: item[1]
        })).sort((a: State, b: State) => a.name.localeCompare(b.name));

        setStates(stateList);
      }
    } catch (error) {
      console.error('Error fetching states:', error);
      setError('Failed to load states');
    } finally {
      setLoadingStates(false);
    }
  };

  // Fetch counties for selected state
  const fetchCounties = async (stateCode: string) => {
    setLoadingCounties(true);
    try {
      const response = await fetch(`https://api.census.gov/data/2020/dec/pl?get=NAME&for=county:*&in=state:${stateCode}`);
      const data = await response.json();

      if (data && data.length > 1) {
        const countyList: County[] = data.slice(1).map((item: string[]) => ({
          name: item[0].replace(/, .+$/, ''), // Remove state name from county name
          code: item[2],
          state: item[1]
        })).sort((a: County, b: County) => a.name.localeCompare(b.name));

        setCounties(countyList);
      }
    } catch (error) {
      console.error('Error fetching counties:', error);
      setError('Failed to load counties');
    } finally {
      setLoadingCounties(false);
    }
  };

  // Fetch places (cities) for selected state
  const fetchCities = async (stateCode: string) => {
    setLoadingCities(true);
    try {
      const response = await fetch(`https://api.census.gov/data/2020/dec/pl?get=NAME&for=place:*&in=state:${stateCode}`);
      const data = await response.json();

      if (data && data.length > 1) {
        const cityList: Place[] = data.slice(1).map((item: string[]) => ({
          name: item[0].replace(/, .+$/, ''), // Remove state name from city name
          code: item[2],
          state: item[1]
        })).sort((a: Place, b: Place) => a.name.localeCompare(b.name));

        setCities(cityList);
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
      setError('Failed to load cities');
    } finally {
      setLoadingCities(false);
    }
  };

  // Load states when modal opens
  useEffect(() => {
    if (open && states.length === 0) {
      fetchStates();
    }
  }, [open]);

  // Handle state selection
  const handleStateChange = (event: SelectChangeEvent) => {
    const stateCode = event.target.value;
    setSelectedState(stateCode);
    setSelectedCounty('');
    setSelectedCity('');
    setCounties([]);
    setCities([]);

    if (stateCode) {
      fetchCounties(stateCode);
      fetchCities(stateCode);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !phone || !password || !passwordConfirm || !selectedState || !streetAddress || !zipCode) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters, include upper/lowercase, number, and special char.');
      return;
    }

    if (password !== passwordConfirm) {
      setError('Passwords do not match.');
      return;
    }

    if (!fullName || !birthDate || !gender) {
      setError('Please complete all personal info fields.');
      return;
    }

    
    setLoading(true);
    setError('');

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;

      const selectedStateName = states.find(s => s.code === selectedState)?.name || '';
      const selectedCountyName = counties.find(c => c.code === selectedCounty)?.name || '';
      const selectedCityName = cities.find(c => c.code === selectedCity)?.name || '';

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        phone: phone,
        fullName: fullName,
        birthDate: birthDate,
        gender: gender,
        address: {
          street: streetAddress,
          city: selectedCityName,
          county: selectedCountyName,
          state: selectedStateName,
          zipCode: zipCode,
          stateCode: selectedState,
          countyCode: selectedCounty,
          cityCode: selectedCity,
        },
        createdAt: new Date(),
      });
      

      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setPassword('');
    setPhone('');
    setPasswordConfirm('');
    setSelectedState('');
    setSelectedCounty('');
    setSelectedCity('');
    setStreetAddress('');
    setZipCode('');
    setError('');
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="signup-modal-title" closeAfterTransition>
      <Box sx={style} component="form" onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography id="signup-modal-title" variant="h6">
            Sign Up
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Basic Info */}
        <TextField
  label="Full Name"
  type="text"
  fullWidth
  margin="normal"
  value={fullName}
  onChange={(e) => setFullName(e.target.value)}
  required
  sx={{ '& label': { color: theme.palette.text.primary } }}
/>

<TextField
  label="Date of Birth"
  type="date"
  fullWidth
  margin="normal"
  value={birthDate}
  onChange={(e) => setBirthDate(e.target.value)}
  InputLabelProps={{ shrink: true }}
  required
  sx={{ '& label': { color: theme.palette.text.primary } }}
/>

<FormControl fullWidth margin="normal" required>
  <InputLabel sx={{ color: theme.palette.text.primary }}>Gender</InputLabel>
  <Select
    value={gender}
    onChange={(e) => setGender(e.target.value)}
    label="Gender"
  >
    <MenuItem value="Male">Male</MenuItem>
    <MenuItem value="Female">Female</MenuItem>
    <MenuItem value="Other">Other</MenuItem>
    <MenuItem value="Prefer not to say">Prefer not to say</MenuItem>
  </Select>
</FormControl>

        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          sx={{ '& label': { color: theme.palette.text.primary } }}
        />

        <TextField
          label="Phone Number"
          type="tel"
          fullWidth
          margin="normal"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          sx={{ '& label': { color: theme.palette.text.primary } }}
        />

        {/* Password Section */}
        <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
          Password
        </Typography>

        <TextField
          label="Password"
          type={showPassword ? 'text' : 'password'}
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          sx={{ '& label': { color: theme.palette.text.primary } }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="Confirm Password"
          type={showPasswordConfirm ? 'text' : 'password'}
          fullWidth
          margin="normal"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          required
          sx={{ '& label': { color: theme.palette.text.primary } }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPasswordConfirm((prev) => !prev)} edge="end">
                  {showPasswordConfirm ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Address Section */}
        <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
          Address Information
        </Typography>

        <FormControl fullWidth margin="normal" required>
          <InputLabel sx={{ color: theme.palette.text.primary }}>State</InputLabel>
          <Select
            value={selectedState}
            onChange={handleStateChange}
            label="State"
            disabled={loadingStates}
          >
            {loadingStates ? (
              <MenuItem disabled>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Loading states...
              </MenuItem>
            ) : (
              states.map((state) => (
                <MenuItem key={state.code} value={state.code}>
                  {state.name}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <FormControl fullWidth margin="normal">
            <InputLabel sx={{ color: theme.palette.text.primary }}>County</InputLabel>
            <Select
              value={selectedCounty}
              onChange={(e) => setSelectedCounty(e.target.value)}
              label="County"
              disabled={!selectedState || loadingCounties}
            >
              {loadingCounties ? (
                <MenuItem disabled>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Loading counties...
                </MenuItem>
              ) : (
                counties.map((county) => (
                  <MenuItem key={county.code} value={county.code}>
                    {county.name}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel sx={{ color: theme.palette.text.primary }}>City</InputLabel>
            <Select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              label="City"
              disabled={!selectedState || loadingCities}
            >
              {loadingCities ? (
                <MenuItem disabled>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Loading cities...
                </MenuItem>
              ) : (
                cities.map((city) => (
                  <MenuItem key={city.code} value={city.code}>
                    {city.name}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
        </Box>

        <TextField
          label="Street Address"
          fullWidth
          margin="normal"
          value={streetAddress}
          onChange={(e) => setStreetAddress(e.target.value)}
          required
          sx={{ '& label': { color: theme.palette.text.primary } }}
        />

        <TextField
          label="ZIP Code"
          fullWidth
          margin="normal"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          required
          inputProps={{ pattern: '[0-9]{5}(-[0-9]{4})?' }}
          sx={{ '& label': { color: theme.palette.text.primary } }}
        />

        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          sx={{
            mt: 3,
            backgroundColor: theme.palette.secondary.main,
            '&:hover': { backgroundColor: theme.palette.secondary.dark },
          }}
        >
          {loading ? 'Creating account...' : 'Sign Up'}
        </Button>
      </Box>
    </Modal>
  );
};

export default SignUpModal;