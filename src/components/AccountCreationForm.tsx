import React, { useState, useContext } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  useTheme,
  Card,
  CardContent,
  Divider,
  Checkbox,
  FormControlLabel,
  Tooltip,
  Collapse,
  Grid,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import LockIcon from '@mui/icons-material/Lock';
import { CartContext, CartItem } from '../providers/cartProvider';

const MultiStepForm = (props: any) => {
  const theme = useTheme();
  const [expandedPanels, setExpandedPanels] = useState([0]); // İlk panel açık
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [guestUser, setGuestUser] = useState(false);
  const cartContext = useContext(CartContext);
  const cartItems = cartContext?.state.items || [];
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Form data
  const [formData, setFormData] = useState({
    email: props.email,
    password: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
  });

  // Payment form data
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
  });

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updatePaymentField = (field: string, value: any) => {
    setPaymentData(prev => ({ ...prev, [field]: value }));
  };

  // Kart numarası formatlaması (4'lü gruplar halinde)
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  // Expiry date formatlaması (MM/YY)
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.length <= 19) { // 16 digits + 3 spaces
      updatePaymentField('cardNumber', formatted);
    }
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    if (formatted.length <= 5) { // MM/YY
      updatePaymentField('expiryDate', formatted);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      updatePaymentField('cvv', value);
    }
  };

  const handleAccordionChange = (panelIndex: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    if (isExpanded) {
      setExpandedPanels(prev => [...prev, panelIndex]);
    } else {
      setExpandedPanels(prev => prev.filter(index => index !== panelIndex));
    }
  };

  const handleSaveStep = (stepIndex: number) => {
    // Mevcut paneli kapatıp bir sonrakini aç
    const nextStep = stepIndex + 1;
    if (nextStep < 3) {
      setExpandedPanels(prev => {
        const newPanels = prev.filter(index => index !== stepIndex);
        if (!newPanels.includes(nextStep)) {
          newPanels.push(nextStep);
        }
        return newPanels;
      });
    }
  };

  const handleProceedToPayment = () => {
    if (!agreedToTerms) {
      alert('Please agree to the terms and conditions to proceed.');
      return;
    }

    // Payment validation
    if (!paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv || !paymentData.cardholderName) {
      alert('Please fill in all payment details.');
      return;
    }

    if (guestUser) {
      alert('Processing payment as guest user...');
    } else {
      alert('Processing payment with account...');
    }
  };

  // Form doğrulaması - misafir kullanıcı durumuna göre
  const isFormComplete = () => {
    const basicFieldsComplete = (
      formData.firstName &&
      formData.lastName &&
      formData.address &&
      formData.city &&
      formData.postalCode
    );
    // Misafir kullanıcı ise şifre kontrolü yapmıyoruz
    if (guestUser) {
      return basicFieldsComplete;
    }
    // Normal kullanıcı ise şifre de gerekli
    return basicFieldsComplete && formData.password;
  };

  const isPaymentFormComplete = () => {
    return paymentData.cardNumber && paymentData.expiryDate && paymentData.cvv && paymentData.cardholderName;
  };

  const handleGuestCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGuestUser(e.target.checked);
    // Misafir olarak devam ederse şifreyi temizle
    if (e.target.checked) {
      updateField('password', '');
    }
  };

  const handleTermsCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAgreedToTerms(e.target.checked);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 4,
        width: '100%',
        maxWidth: '1400px',
        // Responsive için mobilde alt alta dizmek için
        flexDirection: { xs: 'column', md: 'row' },
      }}
    >
      {/* Sol taraf - Form, en sola yaslı */}
      <Box
        sx={{
          width: { xs: '100%', md: '70%' },
          minHeight: 'auto',
          paddingRight: { xs: 0, md: '20px' },
          alignSelf: 'flex-start',
        }}
      >
        {/* 1. Section - Email & Personal Info */}
        <Accordion
          expanded={expandedPanels.includes(0)}
          onChange={handleAccordionChange(0)}
          sx={{ width: '100%', mb: 2 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>
              {guestUser ? 'Guest Checkout Info' : 'Email & Personal Info'}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2} sx={{ py: 2 }}>
              <TextField
                label="Email"
                fullWidth
                value={formData.email}
                disabled
                InputLabelProps={{ style: { color: theme.palette.text.primary } }}
              />
              
              {/* Misafir olarak devam et checkbox'ı */}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={guestUser}
                    onChange={handleGuestCheckboxChange}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2" color="text.primary">
                    Continue as guest (no account required)
                  </Typography>
                }
                sx={{ mb: 1 }}
              />
              {/* Şifre alanı - sadece misafir değilse göster */}
              {!guestUser && (
                <TextField
                  label="Password"
                  type="password"
                  fullWidth
                  value={formData.password}
                  onChange={e => updateField('password', e.target.value)}
                  InputLabelProps={{ style: { color: theme.palette.text.primary } }}
                  required
                />
              )}
              <TextField
                label="First Name"
                fullWidth
                value={formData.firstName}
                onChange={e => updateField('firstName', e.target.value)}
                InputLabelProps={{ style: { color: theme.palette.text.primary } }}
                required
              />
              <TextField
                label="Last Name"
                fullWidth
                value={formData.lastName}
                onChange={e => updateField('lastName', e.target.value)}
                InputLabelProps={{ style: { color: theme.palette.text.primary } }}
                required
              />
              
              <Button
                variant="contained"
                onClick={() => handleSaveStep(0)}
                size="small"
                sx={{
                  mt: 1,
                  py: '6px',
                  px: '16px',
                  fontSize: '0.875rem',
                  alignSelf: 'flex-start',
                  width: 'auto'
                }}
              >
                {guestUser ? 'Continue as Guest' : 'Sign Up & Continue'}
              </Button>
            </Stack>
          </AccordionDetails>
        </Accordion>

        {/* 2. Section - Billing Address */}
        <Accordion
          expanded={expandedPanels.includes(1)}
          onChange={handleAccordionChange(1)}
          sx={{ width: '100%', mb: 2 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Billing Address</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2} sx={{ py: 2 }}>
              <TextField
                label="Address"
                fullWidth
                value={formData.address}
                onChange={e => updateField('address', e.target.value)}
                InputLabelProps={{ style: { color: theme.palette.text.primary } }}
                required
              />
              <TextField
                label="City"
                fullWidth
                value={formData.city}
                onChange={e => updateField('city', e.target.value)}
                InputLabelProps={{ style: { color: theme.palette.text.primary } }}
                required
              />
              <TextField
                label="Postal Code"
                fullWidth
                value={formData.postalCode}
                onChange={e => updateField('postalCode', e.target.value)}
                InputLabelProps={{ style: { color: theme.palette.text.primary } }}
                required
              />
              <Button
                variant="contained"
                onClick={() => handleSaveStep(1)}
                size="small"
                sx={{
                  mt: 1,
                  py: '6px',
                  px: '16px',
                  fontSize: '0.875rem',
                  alignSelf: 'flex-start',
                  width: 'auto'
                }}
              >
                Save & Continue
              </Button>
            </Stack>
          </AccordionDetails>
        </Accordion>

        {/* 3. Section - Shipping Info */}
        <Accordion
          expanded={expandedPanels.includes(2)}
          onChange={handleAccordionChange(2)}
          sx={{ width: '100%', mb: 2 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Shipping Info</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ py: 2 }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Shipping form content here - you can add your shipping fields
              </Typography>
              <Button
                variant="contained"
                onClick={() => alert('Complete!')}
                size="large"
              >
                Complete Order
              </Button>
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>

      {/* Sağ taraf - Order Summary */}
      <Box
        sx={{
          width: { xs: '100%', md: '30%' },
          position: { xs: 'relative', md: 'sticky' },
          top: { md: 20 },
          mt: { xs: 4, md: 0 }, // mobilde alt boşluk ver
          marginLeft: { md: '24px' },
        }}
      >
        <Card sx={{ minHeight: 500 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            {cartItems.length > 0 ? (
              <>
                {cartItems.map((item: CartItem, index: number) => (
                  <Box key={`${item.id}-${item.size}-${item.color}`} sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      {/* Sol tarafta: Ürün adı ve altındaki Quantity/Size/Color */}
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          {item.name}
                        </Typography>
                        <Typography variant="caption" color="text.primary" display="block" mt={0.5}>
                          Quantity: {item.quantity} × ${item.price.toFixed(2)}
                        </Typography>
                        {(item.size || item.color) && (
                          <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                            {item.size && (
                              <Typography variant="caption" color="text.primary">
                                Size: {item.size}
                              </Typography>
                            )}
                            {item.color && (
                              <Typography variant="caption" color="text.primary">
                                Color: {item.color}
                              </Typography>
                            )}
                          </Box>
                        )}
                      </Box>
                      {/* Sağ tarafta: Toplam fiyat */}
                      <Typography variant="body2">
                        ${(item.price * item.quantity).toFixed(2)}
                      </Typography>
                    </Box>
                    {/* Fiyatın hemen altında, tam genişlik değil küçük bir görsel */}
                    {item.image && (
                      <Box
                        component="img"
                        src={item.image}
                        alt={item.name}
                        sx={{
                          width: 80,
                          height: 80,
                          objectFit: 'contain',
                          borderRadius: 1,
                          mt: 0.5,
                        }}
                      />
                    )}
                  </Box>
                ))}
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6">Total:</Typography>
                  <Typography variant="h6" color="primary">
                    ${totalPrice.toFixed(2)}
                  </Typography>
                </Box>
              </>
            ) : (
              <Typography variant="body2" color="text.primary" sx={{ mb: 3 }}>
                No items in cart
              </Typography>
            )}

            {/* Checkout durumu göstergesi */}
            {guestUser && (
              <Box sx={{ mb: 2, p: 1, bgcolor: 'info.light', borderRadius: 1 }}>
                <Typography variant="caption" color="info.dark">
                  ✓ Checking out as guest - no account will be created
                </Typography>
              </Box>
            )}

            <Tooltip
              title={!isFormComplete() ? "Please complete all required fields first" : ""}
              placement="top"
              arrow
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={agreedToTerms}
                    onChange={handleTermsCheckboxChange}
                    color="primary"
                    disabled={!isFormComplete()}
                  />
                }
                label={
                  <Typography variant="body2" color={!isFormComplete() ? 'text.disabled' : 'text.primary'}>
                    I have read and agree to the terms and conditions
                  </Typography>
                }
                sx={{ mb: 2 }}
              />
            </Tooltip>

            {/* Payment Form - Smooth Transition */}
            <Collapse in={agreedToTerms} timeout={800}>
              <Card 
                sx={{ 
                  mb: 2, 
                  p: 2, 
                  bgcolor: 'background.default',
                  border: '1px solid',
                  borderColor: 'divider',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CreditCardIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">Payment Details</Typography>
                  <LockIcon sx={{ ml: 'auto', color: 'success.main', fontSize: 16 }} />
                </Box>
                
                <Stack spacing={2}>
                  <TextField
                    label="Cardholder Name"
                    fullWidth
                    value={paymentData.cardholderName}
                    onChange={e => updatePaymentField('cardholderName', e.target.value)}
                    size="small"
                    required
                    sx={{ mt: 3, '& label': { color: theme.palette.text.primary } }}
                  />
                  
                  <TextField
                    label="Card Number"
                    fullWidth
                    value={paymentData.cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="1234 5678 9012 3456"
                    size="small"
                    required
                    inputProps={{ maxLength: 19 }}
                    sx={{ mt: 3, '& label': { color: theme.palette.text.primary } }}
                  />
                  
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <TextField
                        label="MM/YY"
                        fullWidth
                        value={paymentData.expiryDate}
                        onChange={handleExpiryDateChange}
                        placeholder="12/25"
                        size="small"
                        required
                        inputProps={{ maxLength: 5 }}
                        sx={{ mt: 3, '& label': { color: theme.palette.text.primary } }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="CVV"
                        fullWidth
                        value={paymentData.cvv}
                        onChange={handleCvvChange}
                        placeholder="123"
                        size="small"
                        required
                        inputProps={{ maxLength: 4 }}
                        sx={{ mt: 3, '& label': { color: theme.palette.text.primary } }}
                      />
                    </Grid>
                  </Grid>
                </Stack>
              </Card>
            </Collapse>

            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleProceedToPayment}
              disabled={!agreedToTerms || cartItems.length === 0 || !isPaymentFormComplete()}
              sx={{ 
                mt: 1,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 'bold',
                background: isPaymentFormComplete() && agreedToTerms 
                  ? 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)'
                  : undefined,
              }}
            >
              {guestUser ? 'Complete Payment (Guest)' : 'Complete Payment'}
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default MultiStepForm;