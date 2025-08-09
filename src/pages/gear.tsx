// src/pages/gear.tsx
import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Typography,
  Grid,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Divider,
  useTheme,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useMediaQuery,
  Stack,
  IconButton,
  ButtonGroup,
  Alert,
  Snackbar,
  Slide,
  Badge, // eslint-disable-line @typescript-eslint/no-unused-vars
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FilterListIcon from '@mui/icons-material/FilterList';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Items } from '../utils/Items';
import { useRouter } from 'next/router';
import { CartContext } from '../providers/cartProvider';
import { StaticImageData } from 'next/image';
const GearPageHeroPhoto = '/assets/img/services_page/gi_belt.jpg';

interface ItemType {
  id: string;
  item: string;
  title: string;
  description: string;
  image: string | StaticImageData; // Updated: image can be string or StaticImageData
  sizes: string[];
  colors: string[];
  price: number;
}

type FilterType = {
  size: string[];
  color: string[];
  category: string[];
};

interface ProductSelection {
  [key: string]: {
    selectedSize: string;
    selectedColor: string;
  };
}

interface NotificationState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
}

// Fixed transition component with proper TypeScript interface
const SlideTransition = React.forwardRef<
  unknown,
  TransitionProps & {
    children: React.ReactElement;
  }
>(function SlideTransition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const uniqueValues = <T, K extends keyof T>(arr: T[], key: K): string[] => {
  const flat = arr.flatMap(item => item[key]);
  const set = new Set<string>();
  flat.forEach(value => {
    if (Array.isArray(value)) {
      value.forEach(v => set.add(v));
    } else if (typeof value === 'string') {
      set.add(value);
    }
  });
  return Array.from(set);
};

const getColorHex = (color: string) => {
  const colorMap: { [key: string]: string } = {
    'White': '#FFFFFF',
    'Black': '#000000',
    'Blue': '#2196F3',
    'Red': '#F44336',
    'Green': '#4CAF50',
    'Gray': '#9E9E9E',
    'Navy': '#1A237E',
    'Brown': '#795548',
    'Yellow': '#FFEB3B',
    'Pink': '#E91E63',
    'Purple': '#9C27B0',
    'Orange': '#FF9800',
  };
  return colorMap[color] || '#CCCCCC';
};

const GearPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [filters, setFilters] = useState<FilterType>({ size: [], color: [], category: [] });
  const [filteredItems, setFilteredItems] = useState<ItemType[]>(Items as ItemType[]); // Cast Items to ItemType[]
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [productSelections, setProductSelections] = useState<ProductSelection>({});
  const [notification, setNotification] = useState<NotificationState>({
    open: false,
    message: '',
    severity: 'success'
  });
  
  const router = useRouter();
  const cartContext = useContext(CartContext);

  // Check if there are active filters
  const hasActiveFilters = filters.size.length > 0 || filters.color.length > 0 || filters.category.length > 0;

  // Calculate total items in cart
  const totalCartItems = cartContext?.state?.items?.reduce((total, item) => total + item.quantity, 0) || 0; // eslint-disable-line @typescript-eslint/no-unused-vars

  useEffect(() => {
    let updated = [...Items] as ItemType[]; // Cast Items to ItemType[]
    if (filters.size.length)
      updated = updated.filter(item => filters.size.some(size => item.sizes.includes(size)));
    if (filters.color.length)
      updated = updated.filter(item => filters.color.some(color => item.colors.includes(color)));
    if (filters.category.length)
      updated = updated.filter(item => filters.category.includes(item.item));
    setFilteredItems(updated);
  }, [filters]);

  const handleCheckbox = (type: keyof FilterType, value: string) => {
    setFilters(prev => {
      const updated = prev[type].includes(value)
        ? prev[type].filter(v => v !== value)
        : [...prev[type], value];
      return { ...prev, [type]: updated };
    });
  };

  const clearFilters = () => {
    setFilters({ size: [], color: [], category: [] });
  };

  const handleSizeSelection = (itemId: string, size: string) => {
    setProductSelections(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        selectedSize: size
      }
    }));
  };

  const handleColorSelection = (itemId: string, color: string) => {
    setProductSelections(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        selectedColor: color
      }
    }));
  };

  const showNotification = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const handleGoToCart = () => { // eslint-disable-line @typescript-eslint/no-unused-vars
    router.push('/cart');
  };

  const handleAddToCart = (item: ItemType) => {
    if (!cartContext) {
      showNotification('Cart access unavailable. Please try again.', 'error');
      return;
    }
    
    const selection = productSelections[item.id];
    if (!selection?.selectedSize || !selection?.selectedColor) {
      showNotification('Please select both size and color before adding to cart.', 'warning');
      return;
    }
  
    cartContext.addItem({
      id: `${item.id}-${selection.selectedSize}-${selection.selectedColor}`,
      name: item.title,
      price: item.price,
      quantity: 1,
      size: selection.selectedSize,
      color: selection.selectedColor,
      image: typeof item.image === 'object' ? item.image.src : item.image, // Ensure image is string for cart context
    });
  
    showNotification(
      `${item.title} added to cart!`, 
      'success'
    );
  
    // Reset selections after adding to cart
    setProductSelections(prev => ({
      ...prev,
      [item.id]: {
        selectedSize: '',
        selectedColor: ''
      }
    }));
  };

  const sizes = uniqueValues(Items, 'sizes');
  const colors = uniqueValues(Items, 'colors');
  const categories = uniqueValues(Items, 'item');

  const FilterContent = () => (
    <Box>
      {/* Category Filter */}
      <Accordion defaultExpanded sx={{ boxShadow: 'none', '&:before': { display: 'none' } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 0 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Category
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 0 }}>
          <FormGroup>
            {categories.map(cat => (
              <FormControlLabel
                key={cat}
                control={
                  <Checkbox 
                    checked={filters.category.includes(cat)}
                    onChange={() => handleCheckbox('category', cat)}
                    sx={{
                      color: theme.palette.grey[400],
                      '&.Mui-checked': {
                        color: theme.palette.primary.main,
                      },
                    }}
                  />
                }
                label={<Typography variant="body2">{cat}</Typography>}
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      <Divider sx={{ my: 2 }} />

      {/* Size Filter */}
      <Accordion defaultExpanded sx={{ boxShadow: 'none', '&:before': { display: 'none' } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 0 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Size
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 0 }}>
          <FormGroup>
            {sizes.map(size => (
              <FormControlLabel
                key={size}
                control={
                  <Checkbox 
                    checked={filters.size.includes(size)}
                    onChange={() => handleCheckbox('size', size)}
                    sx={{
                      color: theme.palette.grey[400],
                      '&.Mui-checked': {
                        color: theme.palette.primary.main,
                      },
                    }}
                  />
                }
                label={<Typography variant="body2">{size}</Typography>}
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      <Divider sx={{ my: 2 }} />

      {/* Color Filter */}
      <Accordion defaultExpanded sx={{ boxShadow: 'none', '&:before': { display: 'none' } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 0 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Color
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 0 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1 }}>
            {colors.map(color => (
              <Box
                key={color}
                onClick={() => handleCheckbox('color', color)}
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: getColorHex(color),
                  border: color === 'White' ? '1px solid #e0e0e0' : '1px solid transparent',
                  cursor: 'pointer',
                  position: 'relative',
                  '&:hover': {
                    transform: 'scale(1.1)',
                  },
                  ...(filters.color.includes(color) && {
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: -2,
                      left: -2,
                      right: -2,
                      bottom: -2,
                      border: `2px solid ${theme.palette.primary.main}`,
                      borderRadius: '50%',
                    }
                  })
                }}
                title={color}
              />
            ))}
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <Box sx={{ mt: 3 }}>
          <Button 
            onClick={clearFilters}
            variant="outlined"
            size="small"
            fullWidth
          >
            Clear All Filters
          </Button>
        </Box>
      )}
    </Box>
  );

  return (
    <Box sx={{ backgroundColor: theme.palette.background.paper }}>
      <Header />

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={handleCloseNotification}
        TransitionComponent={SlideTransition}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ mt: 8 }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ 
            width: '100%',
            '& .MuiAlert-icon': {
              fontSize: '1.5rem'
            }
          }}
          icon={
            notification.severity === 'success' ? <CheckCircleIcon fontSize="inherit" /> :
            notification.severity === 'error' ? <ErrorIcon fontSize="inherit" /> :
            undefined
          }
        >
          {notification.message}
        </Alert>
      </Snackbar>

      {/* Hero */}
      <Box
        sx={{
          height: { xs: '50vh', md: '60vh' },
          backgroundImage: `url(${GearPageHeroPhoto})`, // Corrected
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: theme.palette.primary.contrastText,
          textAlign: 'center',
          borderBottom: `6px solid ${theme.palette.secondary.main}`,
        }}
      >
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 'bold', 
            textShadow: '2px 2px 4px #000',
            fontSize: { xs: '2rem', md: '3rem' }
          }}
        >
          Explore Our Premium Gear
        </Typography>
      </Box>

      {/* Mobile Filter Bar */}
      {isMobile && (
        <Box sx={{ p: 2, backgroundColor: '#fff', borderBottom: '1px solid #e0e0e0' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              {filteredItems.length} results
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                startIcon={<FilterListIcon />}
                onClick={() => setMobileFilterOpen(true)}
              >
                Filters
              </Button>
            </Stack>
          </Stack>
        </Box>
      )}

      {/* Mobile Filter Dialog */}
      <Dialog
        open={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        fullScreen={isMobile}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Filters</Typography>
            <IconButton 
              onClick={() => setMobileFilterOpen(false)}
              sx={{ 
                color: theme.palette.grey[500],
                '&:hover': { 
                  backgroundColor: theme.palette.grey[100] 
                }
              }}
            >
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <FilterContent />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMobileFilterOpen(false)} variant="contained" fullWidth>
            Apply Filters ({filteredItems.length} items)
          </Button>
        </DialogActions>
      </Dialog>

      {/* Main Content */}
      <Grid container spacing={4} px={{ xs: 2, md: 4 }} py={6}>
        {/* Desktop Left Panel */}
        {!isMobile && (
          <Grid item md={3}>
            <Box sx={{ 
              backgroundColor: 'transparent', 
              p: 0
            }}>
              <FilterContent />
            </Box>
          </Grid>
        )}

        {/* Product Grid */}
        <Grid item xs={12} md={isMobile ? 12 : 9}>
          {!isMobile && hasActiveFilters && (
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5">
                {filteredItems.length} results for &quot;Premium Gear&quot;
              </Typography>
            </Box>
          )}

          <Grid container spacing={3}>
            {filteredItems.map(item => (
              <Grid item xs={12} sm={6} md={isMobile ? 6 : 4} key={item.id}>
                <motion.div whileHover={{ scale: 1.03 }}>
                  <Box
                    sx={{
                      borderRadius: '12px',
                      overflow: 'hidden',
                      backgroundColor: '#fff',
                      boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
                      textAlign: 'left',
                      '&:hover': {
                        boxShadow: '0px 8px 24px rgba(0,0,0,0.15)',
                      }
                    }}
                  >
                    <Box sx={{ position: 'relative' }}>
                      <Box
                        component="img"
                        src={typeof item.image === 'object' ? item.image.src : item.image} // Corrected
                        alt={item.title}
                        sx={{ width: '100%', height: '300px', objectFit: 'cover' }}
                      />
                    </Box>
                    <Box sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Typography variant="caption" color="text.primary" sx={{ textTransform: 'uppercase' }}>
                          {item.item}
                        </Typography>
                      </Box>
                      <Typography variant="body1" fontWeight="medium" sx={{ mt: 0.5, mb: 1 }}>
                        {item.title}
                      </Typography>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
                          Size:
                        </Typography>
                        <ButtonGroup size="small" variant="outlined">
                          {item.sizes.map(size => (
                            <Button
                              key={size}
                              onClick={() => handleSizeSelection(item.id, size)}
                              variant={productSelections[item.id]?.selectedSize === size ? 'contained' : 'outlined'}
                              sx={{ 
                                minWidth: '40px',
                                fontSize: '0.75rem'
                              }}
                            >
                              {size}
                            </Button>
                          ))}
                        </ButtonGroup>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
                          Color:
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                          {item.colors.map(color => (
                            <Box
                              key={color}
                              onClick={() => handleColorSelection(item.id, color)}
                              sx={{
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                backgroundColor: getColorHex(color),
                                border: color === 'White' ? '1px solid #e0e0e0' : '1px solid transparent',
                                cursor: 'pointer',
                                position: 'relative',
                                '&:hover': {
                                  transform: 'scale(1.1)',
                                },
                                ...(productSelections[item.id]?.selectedColor === color && {
                                  '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    top: -3,
                                    left: -3,
                                    right: -3,
                                    bottom: -3,
                                    border: `2px solid ${theme.palette.primary.main}`,
                                    borderRadius: '50%',
                                  }
                                })
                              }}
                              title={color}
                            />
                          ))}
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" fontWeight="bold">
                          €{item.price}
                        </Typography>
                        <IconButton 
                          onClick={() => handleAddToCart(item)}
                          sx={{ 
                            color: (!productSelections[item.id]?.selectedSize || !productSelections[item.id]?.selectedColor) 
                              ? theme.palette.action.disabled 
                              : theme.palette.action.active,
                            '&:hover': { 
                              color: (!productSelections[item.id]?.selectedSize || !productSelections[item.id]?.selectedColor) 
                                ? theme.palette.action.disabled 
                                : theme.palette.primary.main 
                            }
                          }}
                          disabled={!productSelections[item.id]?.selectedSize || !productSelections[item.id]?.selectedColor}
                        >
                          <ShoppingCartIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {filteredItems.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                No products found matching your filters.
              </Typography>
              <Button variant="contained" onClick={clearFilters}>
                Clear All Filters
              </Button>
            </Box>
          )}
        </Grid>
      </Grid>

      <Footer />
    </Box>
  );
};

export default GearPage;