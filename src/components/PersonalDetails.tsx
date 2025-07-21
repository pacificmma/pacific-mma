import React, { useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useFirebaseAuth } from '../providers/fireBaseAuthProvider';

interface Address {
  street?: string;
  city?: string;
  county?: string;
  state?: string;
  zipCode?: string;
}

interface FirebaseUserProfile {
  uid: string;
  email: string;
  phone?: string;
  fullName?: string;
  birthDate?: string;
  gender?: string;
  address?: Address;
}

interface PersonalDetailsProps {
  user: FirebaseUserProfile;
}

const PersonalDetails: React.FC<PersonalDetailsProps> = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { setUser } = useFirebaseAuth();

  const [fullName, setFullName] = useState(user.fullName || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [birthDate, setBirthDate] = useState(user.birthDate || '');
  const [gender, setGender] = useState(user.gender || '');
  const [street, setStreet] = useState(user.address?.street || '');
  const [city, setCity] = useState(user.address?.city || '');
  const [county, setCounty] = useState(user.address?.county || '');
  const [state, setState] = useState(user.address?.state || '');
  const [zipCode, setZipCode] = useState(user.address?.zipCode || '');

  const handleSave = async () => {
    try {
      const userRef = doc(db, 'users', user.uid);

      const updatedData = {
        fullName,
        phone,
        birthDate,
        gender,
        address: {
          street,
          city,
          county,
          state,
          zipCode,
        },
      };

      await updateDoc(userRef, updatedData);

      // ✅ Global kullanıcıyı güvenli şekilde güncelle
      setUser((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          ...updatedData,
          address: {
            ...prev.address,
            ...updatedData.address,
          },
        };
      });

      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update user profile:', err);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Personal Details</Typography>

      <TextField
        label="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        fullWidth
        margin="normal"
        InputProps={{ readOnly: !isEditing }}
      />

      <TextField
        label="Email"
        value={user.email}
        fullWidth
        margin="normal"
        InputProps={{ readOnly: true }}
      />

      <TextField
        label="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        fullWidth
        margin="normal"
        InputProps={{ readOnly: !isEditing }}
      />

      <TextField
        label="Gender"
        value={gender}
        onChange={(e) => setGender(e.target.value)}
        fullWidth
        margin="normal"
        InputProps={{ readOnly: !isEditing }}
      />

      <TextField
        label="Birth Date"
        type="date"
        value={birthDate}
        onChange={(e) => setBirthDate(e.target.value)}
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
        InputProps={{ readOnly: !isEditing }}
      />

      <TextField
        label="Street Address"
        value={street}
        onChange={(e) => setStreet(e.target.value)}
        fullWidth
        margin="normal"
        InputProps={{ readOnly: !isEditing }}
      />

      <TextField
        label="City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        fullWidth
        margin="normal"
        InputProps={{ readOnly: !isEditing }}
      />

      <TextField
        label="County"
        value={county}
        onChange={(e) => setCounty(e.target.value)}
        fullWidth
        margin="normal"
        InputProps={{ readOnly: !isEditing }}
      />

      <TextField
        label="State"
        value={state}
        onChange={(e) => setState(e.target.value)}
        fullWidth
        margin="normal"
        InputProps={{ readOnly: !isEditing }}
      />

      <TextField
        label="ZIP Code"
        value={zipCode}
        onChange={(e) => setZipCode(e.target.value)}
        fullWidth
        margin="normal"
        InputProps={{ readOnly: !isEditing }}
      />

      <Box sx={{ mt: 2 }}>
        {isEditing ? (
          <Button variant="contained" color="secondary" onClick={handleSave}>
            Save
          </Button>
        ) : (
          <Button variant="outlined" color="primary" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default PersonalDetails;
