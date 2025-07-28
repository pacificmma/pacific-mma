// src/components/SecurePersonalDetails.tsx
// SECURE PERSONAL DETAILS WITH ENGLISH MESSAGING FOR INTERNATIONAL CUSTOMERS

import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Alert, LinearProgress } from '@mui/material';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../utils/fireBaseAuthProvider';
import { useFirebaseAuth } from '../providers/fireBaseAuthProvider';

// 🛡️ Security utilities import
import { SecurityValidator, SimpleAuditLogger } from '../utils/security';

// EXISTING INTERFACES - No changes
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
  phoneNumber?: string; // Support both phone and phoneNumber
  fullName?: string;
  birthDate?: string;
  gender?: string;
  address?: Address;
}

interface PersonalDetailsProps {
  user: FirebaseUserProfile;
}

const PersonalDetails: React.FC<PersonalDetailsProps> = ({ user }) => {
  // EXISTING STATE - No changes
  const [isEditing, setIsEditing] = useState(false);
  const { setUser } = useFirebaseAuth();

  const [fullName, setFullName] = useState(user.fullName || '');
  const [phone, setPhone] = useState(user.phone || user.phoneNumber || '');
  const [birthDate, setBirthDate] = useState(user.birthDate || '');
  const [gender, setGender] = useState(user.gender || '');
  const [street, setStreet] = useState(user.address?.street || '');
  const [city, setCity] = useState(user.address?.city || '');
  const [county, setCounty] = useState(user.address?.county || '');
  const [state, setState] = useState(user.address?.state || '');
  const [zipCode, setZipCode] = useState(user.address?.zipCode || '');

  // 🆕 NEW: Security states
  const [saving, setSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState('');

  // 🆕 NEW: Real-time validation function
  const validateInputs = (): boolean => {
    const errors: string[] = [];

    // Name validation
    if (!SecurityValidator.validateString(fullName, 2, 50)) {
      errors.push('Name must be between 2 and 50 characters');
    }

    // Phone validation
    if (phone && !SecurityValidator.validatePhone(phone)) {
      errors.push('Invalid phone number format');
    }

    // Postal code validation
    if (zipCode && !SecurityValidator.validateZipCode(zipCode, 'US')) {
      errors.push('Invalid postal code format');
    }

    // Address field validation
    if (street && !SecurityValidator.validateString(street, 2, 100)) {
      errors.push('Street address must be between 2 and 100 characters');
    }

    if (city && !SecurityValidator.validateString(city, 2, 50)) {
      errors.push('City must be between 2 and 50 characters');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  // 🔄 ENHANCED SAVE FUNCTION
  const handleSave = async () => {
    // 🆕 NEW: Validation check
    if (!validateInputs()) {
      SimpleAuditLogger.logSecurityEvent(
        'DATA_UPDATE', 
        user.uid, 
        { success: false, reason: 'Validation failed', errors: validationErrors },
        'MEDIUM'
      );
      return;
    }

    setSaving(true);
    setSuccessMessage('');
    setValidationErrors([]);

    try {
      const userRef = doc(db, 'members', user.uid); // Using 'members' instead of 'users'

      // 🆕 NEW: Input sanitization
      const sanitizedData = SecurityValidator.sanitizeForDatabase({
        fullName: fullName.trim(),
        phoneNumber: phone.trim(), // Use phoneNumber field
        birthDate: birthDate.trim(),
        gender: gender.trim(),
        address: {
          street: street.trim(),
          city: city.trim(),
          county: county.trim(),
          state: state.trim(),
          zipCode: zipCode.trim(),
        },
      });

      // 🆕 NEW: Add security metadata
      const updatedData = {
        ...sanitizedData,
        updatedAt: new Date().toISOString(), // Using ISO string instead of Firestore serverTimestamp()
        updatedBy: user.uid
      };

      // EXISTING FIRESTORE UPDATE
      await updateDoc(userRef, updatedData);

      // EXISTING GLOBAL USER UPDATE - Secure version
      setUser((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          ...sanitizedData,
          // Update both phone and phoneNumber
          phone: sanitizedData.phoneNumber,
          phoneNumber: sanitizedData.phoneNumber
        };
      });

      // 🆕 NEW: Success message and log
      setSuccessMessage('Your information has been updated successfully!');
      setIsEditing(false);

      SimpleAuditLogger.logSecurityEvent(
        'DATA_UPDATE', 
        user.uid, 
        { 
          success: true, 
          updatedFields: Object.keys(sanitizedData),
          // Don't include sensitive data in logs
          fieldsCount: Object.keys(sanitizedData).length
        },
        'LOW'
      );

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);

    } catch (error) {
      console.error('Profile update error:', error);
      
      // 🆕 NEW: Error log
      SimpleAuditLogger.logSecurityEvent(
        'DATA_UPDATE', 
        user.uid, 
        { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
        'HIGH'
      );

      setValidationErrors(['An error occurred while updating your profile. Please try again.']);
    } finally {
      setSaving(false);
    }
  };

  // 🆕 NEW: Cancel function with security log
  const handleCancel = () => {
    setIsEditing(false);
    setValidationErrors([]);
    setSuccessMessage('');
    
    // Reset to original values
    setFullName(user.fullName || '');
    setPhone(user.phone || user.phoneNumber || '');
    setBirthDate(user.birthDate || '');
    setGender(user.gender || '');
    setStreet(user.address?.street || '');
    setCity(user.address?.city || '');
    setCounty(user.address?.county || '');
    setState(user.address?.state || '');
    setZipCode(user.address?.zipCode || '');

    SimpleAuditLogger.logSecurityEvent(
      'DATA_UPDATE', 
      user.uid, 
      { action: 'cancelled' },
      'LOW'
    );
  };

  // 🆕 NEW: Real-time input sanitization
  const handleInputChange = (
    value: string, 
    setter: React.Dispatch<React.SetStateAction<string>>,
    maxLength: number = 255
  ) => {
    const sanitized = SecurityValidator.sanitizeInput(value);
    if (sanitized.length <= maxLength) {
      setter(sanitized);
      // Clear validation errors when user starts typing
      if (validationErrors.length > 0) {
        setValidationErrors([]);
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Personal Information
      </Typography>

      {/* 🆕 NEW: Success Message */}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}

      {/* 🆕 NEW: Validation Errors */}
      {validationErrors.length > 0 && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </Alert>
      )}

      {/* 🆕 NEW: Loading Progress */}
      {saving && <LinearProgress sx={{ mb: 2 }} />}

      {/* EXISTING FORM FIELDS - Added secure input handling */}
      <TextField
        fullWidth
        margin="normal"
        label="Full Name"
        value={fullName}
        onChange={(e) => handleInputChange(e.target.value, setFullName, 50)}
        disabled={!isEditing || saving}
        error={validationErrors.some(err => err.includes('Name'))}
        helperText={isEditing ? 'Enter your full name (2-50 characters)' : ''}
      />

      <TextField
        fullWidth
        margin="normal"
        label="Phone"
        value={phone}
        onChange={(e) => handleInputChange(e.target.value, setPhone, 15)}
        disabled={!isEditing || saving}
        error={validationErrors.some(err => err.includes('phone'))}
        helperText={isEditing ? 'Enter a valid phone number' : ''}
      />

      <TextField
        fullWidth
        margin="normal"
        label="Date of Birth"
        type="date"
        value={birthDate}
        onChange={(e) => handleInputChange(e.target.value, setBirthDate)}
        disabled={!isEditing || saving}
        InputLabelProps={{
          shrink: true,
        }}
      />

      <TextField
        fullWidth
        margin="normal"
        label="Gender"
        value={gender}
        onChange={(e) => handleInputChange(e.target.value, setGender, 20)}
        disabled={!isEditing || saving}
      />

      <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
        Address Information
      </Typography>

      <TextField
        fullWidth
        margin="normal"
        label="Street"
        value={street}
        onChange={(e) => handleInputChange(e.target.value, setStreet, 100)}
        disabled={!isEditing || saving}
        error={validationErrors.some(err => err.includes('Street'))}
      />

      <TextField
        fullWidth
        margin="normal"
        label="City"
        value={city}
        onChange={(e) => handleInputChange(e.target.value, setCity, 50)}
        disabled={!isEditing || saving}
        error={validationErrors.some(err => err.includes('City'))}
      />

      <TextField
        fullWidth
        margin="normal"
        label="County"
        value={county}
        onChange={(e) => handleInputChange(e.target.value, setCounty, 50)}
        disabled={!isEditing || saving}
      />

      <TextField
        fullWidth
        margin="normal"
        label="State"
        value={state}
        onChange={(e) => handleInputChange(e.target.value, setState, 50)}
        disabled={!isEditing || saving}
      />

      <TextField
        fullWidth
        margin="normal"
        label="Postal Code"
        value={zipCode}
        onChange={(e) => handleInputChange(e.target.value, setZipCode, 10)}
        disabled={!isEditing || saving}
        error={validationErrors.some(err => err.includes('postal code'))}
        helperText={isEditing ? 'Enter a valid postal code' : ''}
      />

      {/* EXISTING BUTTONS - Security improvements */}
      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        {!isEditing ? (
          <Button 
            variant="contained" 
            onClick={() => {
              setIsEditing(true);
              SimpleAuditLogger.logSecurityEvent(
                'DATA_UPDATE', 
                user.uid, 
                { action: 'edit_started' },
                'LOW'
              );
            }}
          >
            Edit
          </Button>
        ) : (
          <>
            <Button 
              variant="contained" 
              onClick={handleSave}
              disabled={saving || validationErrors.length > 0}
            >
              {saving ? 'Saving...' : 'Save'}
            </Button>
            <Button 
              variant="outlined" 
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </Button>
          </>
        )}
      </Box>

      {/* 🆕 NEW: Development mode security info */}
      {process.env.NODE_ENV === 'development' && (
        <Box sx={{ mt: 4, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
          <Typography variant="caption" color="text.secondary">
            🔒 Security: All inputs are sanitized, validation applied, and changes are logged
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default PersonalDetails;