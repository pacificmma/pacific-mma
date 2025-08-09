import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '../utils/fireBaseAuthProvider';
import { SecurityValidator, SimpleAuditLogger } from '../utils/security';

const ContactUs = () => {
  const theme = useTheme();
  const [formData, setFormData] = useState({ name: '', email: '', message: '', topic: '' });
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const fields: Array<keyof typeof formData> = ['name', 'email', 'message'];
  const characterLimits = { name: 50, email: 100, message: 500 };

  const handleChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const limit = characterLimits[field as keyof typeof characterLimits];
    
    // Sanitize input to prevent XSS attacks
    const sanitizedValue = SecurityValidator.sanitizeInput(rawValue);
    
    if (!limit || sanitizedValue.length <= limit) {
      setFormData({ ...formData, [field]: sanitizedValue });
    }
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const sanitizedTopic = SecurityValidator.sanitizeInput(e.target.value);
    setFormData({ ...formData, topic: sanitizedTopic });
  };

  const isFormValid = () => {
    // Character limits check
    const withinLimits = fields.every(field => {
      const limit = characterLimits[field as keyof typeof characterLimits];
      return !limit || formData[field].length <= limit;
    });

    // Security validation checks
    const nameValid = SecurityValidator.validateString(formData.name, 1, 50);
    const emailValid = SecurityValidator.validateEmail(formData.email);
    const messageValid = SecurityValidator.validateString(formData.message, 1, 500);
    const topicValid = SecurityValidator.validateString(formData.topic, 1, 50);

    return withinLimits && nameValid && emailValid && messageValid && topicValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Security logging - form submission attempt
    SimpleAuditLogger.logSecurityEvent('DATA_UPDATE', 'anonymous', {
      action: 'contact_form_submission_attempt',
      topic: formData.topic
    }, 'LOW');
    
    if (!isFormValid()) {
      setSnackbarMessage('Please ensure all fields are properly filled and within character limits.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      
      // Log invalid form submission
      SimpleAuditLogger.logSecurityEvent('SUSPICIOUS_ACTIVITY', 'anonymous', {
        action: 'invalid_form_submission',
        formData: SecurityValidator.maskSensitiveData(formData)
      }, 'MEDIUM');
      return;
    }
    
    setLoading(true);
    try {
      const functions = getFunctions(app);
      const contactUsFunction = httpsCallable(functions, 'contactUs');
      
      // Sanitize all data before sending
      const sanitizedData = SecurityValidator.sanitizeForDatabase({
        name: formData.name,
        email: formData.email,
        message: formData.message,
        topic: formData.topic,
      });
      
      const result = await contactUsFunction(sanitizedData);

      const data = result.data as any;
      if (data.success) {
        setSnackbarMessage('Thank you! We received your message and will respond within 24 hours.');
        setSnackbarSeverity('success');
        setFormData({ name: '', email: '', message: '', topic: '' });
        
        // Log successful form submission
        SimpleAuditLogger.logSecurityEvent('DATA_UPDATE', 'anonymous', {
          action: 'contact_form_submitted_successfully',
          topic: formData.topic
        }, 'LOW');
      } else {
        setSnackbarMessage(`Error: ${data.message || 'Failed to send message'}`);
        setSnackbarSeverity('error');
        
        // Log failed form submission
        SimpleAuditLogger.logSecurityEvent('SYSTEM', 'anonymous', {
          action: 'contact_form_submission_failed',
          error: data.message
        }, 'MEDIUM');
      }
    } catch (error: any) {
      console.error('Contact form error:', error);
      setSnackbarMessage(error.message || 'Something went wrong. Please try again later.');
      setSnackbarSeverity('error');
      
      // Log system error
      SimpleAuditLogger.logSecurityEvent('SYSTEM', 'anonymous', {
        action: 'contact_form_system_error',
        error: error.message
      }, 'HIGH');
    } finally {
      setSnackbarOpen(true);
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: '100%',
        margin: '0 auto',
        py: { xs: 3, sm: 4, md: 5 },
        px: { xs: 2, sm: 3, md: 4 },
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderTop: `6px solid ${theme.palette.secondary.main}`,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'center', md: 'flex-start' },
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: { xs: 4, md: 6 },
          width: '100%',
          maxWidth: { xs: '100%', md: '80%' },
          boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Box
          sx={{
            flex: 1,
            textAlign: { xs: 'center', md: 'left' },
            pr: { md: 6 },
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' },
              lineHeight: 1.4,
              letterSpacing: '1px',
              color: theme.palette.text.primary,
              marginBottom: 2,
              fontFamily: theme.typography.fontFamily,
            }}
          >
            Contact Us
          </Typography>

          <Typography
            variant="body1"
            sx={{
              opacity: 0.8,
              fontSize: theme.typography.body1.fontSize,
              color: theme.palette.text.primary,
              fontFamily: theme.typography.fontFamily,
            }}
          >
            Do you have questions about our camps, academy, or products? Are you interested in
            joining our network of trainers and gyms? If so, please send us a message and our team will get back to you as soon as possible.
          </Typography>
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            maxWidth: { xs: '100%', md: 500 },
            width: '100%',
            mt: { xs: 4, md: 0 },
          }}
        >
          {/* Topic Dropdown */}
          <FormControl 
            variant="standard" 
            fullWidth 
            required
            sx={{
              '& .MuiInput-underline:before': { borderBottom: `1px solid ${theme.palette.text.primary}` },
              '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottom: `2px solid ${theme.palette.text.primary}` },
              '& .MuiInput-underline:after': { borderBottom: `2px solid ${theme.palette.text.primary}` },
            }}
          >
            <InputLabel sx={{ color: theme.palette.text.primary }}>Topic</InputLabel>
            <Select
              value={formData.topic}
              onChange={handleSelectChange}
              label="Topic"
              sx={{ color: theme.palette.text.primary }}
            >
              <MenuItem value="Camps">Camps</MenuItem>
              <MenuItem value="Academy">Academy</MenuItem>
              <MenuItem value="Fightwear">Fightwear</MenuItem>
            </Select>
          </FormControl>

          {fields.map((field) => {
            const limit = characterLimits[field as keyof typeof characterLimits];
            const currentLength = formData[field].length;
            const isNearLimit = currentLength > limit * 0.8;
            
            return (
              <Box key={field}>
                <TextField
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  variant="standard"
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={formData[field]}
                  onChange={handleChange(field)}
                  multiline={field === 'message'}
                  rows={field === 'message' ? 4 : 1}
                  InputLabelProps={{ sx: { color: theme.palette.text.primary } }}
                  InputProps={{ disableUnderline: false, sx: { color: theme.palette.text.primary } }}
                  sx={{
                    '& .MuiInput-underline:before': { borderBottom: `1px solid ${theme.palette.text.primary}` },
                    '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottom: `2px solid ${theme.palette.text.primary}` },
                    '& .MuiInput-underline:after': { borderBottom: `2px solid ${theme.palette.text.primary}` },
                  }}
                  fullWidth
                  required
                />
                <Typography
                  variant="caption"
                  sx={{
                    color: isNearLimit ? theme.palette.warning.main : theme.palette.text.secondary,
                    fontSize: '0.75rem',
                    display: 'block',
                    textAlign: 'right',
                    mt: 0.5,
                  }}
                >
                  {currentLength}/{limit}
                </Typography>
              </Box>
            );
          })}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading || !isFormValid()}
              sx={{
                backgroundColor: theme.palette.secondary.main,
                color: theme.palette.primary.contrastText,
                padding: '12px 30px',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                borderRadius: '30px',
                '&:hover': { backgroundColor: theme.palette.secondary.dark },
                '&:disabled': {
                  backgroundColor: theme.palette.grey[400],
                  color: theme.palette.grey[600],
                },
              }}
            >
              {loading ? 'Sending...' : 'Send'}
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Snackbar */}
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
    </Box>
  );
};

export default ContactUs;