// src/components/HeroShop.tsx
import React from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useRouter } from 'next/router';

const giImage = '/assets/img/home_page/gi.jpg';
const rashGuardImage = '/assets/img/home_page/shirt.jpg';
const glovesImage = '/assets/img/home_page/gloves.jpg';

interface ShopItem {
  src: string; // ✅ Changed from StaticImageData to string for Next.js public assets
  alt: string;
  price: string;
  description: string;
}

const HeroShop = () => {
  const theme = useTheme();
  const router = useRouter();

  const shopItems: ShopItem[] = [
    { src: giImage, alt: "Gi", price: "$120", description: "Premium Brazilian Jiu-Jitsu Gi" },
    { src: rashGuardImage, alt: "Rashguard", price: "$50", description: "High-Quality Rashguard" },
    { src: glovesImage, alt: "Gloves", price: "$80", description: "MMA Pro Gloves" },
  ];

  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: { xs: 3, sm: 4, md: 5 },
        px: { xs: 2, sm: 3, md: 4 },
        backgroundColor: theme.palette.primary.main,
        borderTop: `6px solid ${theme.palette.secondary.main}`,
      }}
    >
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          maxWidth: '1400px',
          width: '100%',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' },
            lineHeight: { xs: 1.4, sm: 1.4 },
            letterSpacing: '1px',
            color: theme.palette.primary.contrastText,
            textTransform: 'none',
            maxWidth: '900px',
            margin: '0 auto',
            fontFamily: theme.typography.fontFamily,
          }}
        >
          Fightwear 
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: theme.palette.primary.contrastText,
            maxWidth: '800px',
            mb: 4,
            fontSize: '1.1rem',
            fontFamily: theme.typography.fontFamily,
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
          }}
        >
          Brazilian Jiu-Jitsu (Gi and No-Gi), Wrestling, Judo, Muay Thai, and Boxing. At PACIFIC MMA, we blend top-tier materials with elegant, functional design—engineered for peak performance, crafted for durability and style.
        </Typography>

        {/* Ürün Kartları - Mobile Slide, Desktop Grid */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: { xs: 'flex-start', md: 'center' },
            gap: { xs: '15px', sm: '15px', md: '20px' },
            width: { xs: '100%', md: '85%', lg: '80%' },
            margin: '0 auto',
            position: 'relative',
            zIndex: 2,
            flexDirection: 'row',
            mt: { xs: 1, md: 0 },
            overflowX: { xs: 'auto', md: 'visible' },
            overflowY: 'hidden',
            px: { xs: 2, md: 0 },
            scrollSnapType: { xs: 'x mandatory', md: 'none' },
            WebkitOverflowScrolling: 'touch',
            '&::-webkit-scrollbar': {
              display: { xs: 'none', md: 'block' },
            },
            scrollbarWidth: 'none',
            mb: 2,
          }}
        >
          {shopItems.map((item, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: { xs: '75vw', sm: '65vw', md: '100%' },
                minWidth: { xs: '280px', sm: '320px', md: 'auto' },
                flex: { xs: '0 0 auto', md: 1 },
                mb: { xs: 0, md: 0 },
                scrollSnapAlign: { xs: 'center', md: 'none' },
              }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '16px',
                  boxShadow: '0px 8px 18px rgba(0, 0, 0, 0.15)',
                  width: '100%',
                }}
              >
                <Box
                  component="img"
                  src={item.src}
                  alt={item.alt}
                  sx={{
                    width: '100%',
                    height: { xs: '400px', sm: '450px', md: '400px' },
                    objectFit: 'cover',
                    borderRadius: '16px',
                    transition: 'transform 0.3s ease',
                    '&:hover': { transform: 'scale(1.08)' },
                  }}
                />

                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'rgba(0, 0, 0, 0.7)',
                    color: theme.palette.primary.contrastText,
                    p: { xs: 2, md: 2.5 },
                    textAlign: 'center',
                    transition: 'opacity 0.3s ease',
                    borderBottomLeftRadius: '16px',
                    borderBottomRightRadius: '16px',
                  }}
                >
                  <Typography 
                    variant="h6" 
                    fontWeight="bold" 
                    sx={{ 
                      fontFamily: theme.typography.fontFamily,
                      fontSize: { xs: '1.1rem', md: '1.25rem' },
                      mb: 0.5
                    }}
                  >
                    {item.alt}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontFamily: theme.typography.fontFamily,
                      fontSize: { xs: '0.85rem', md: '0.9rem' },
                      mb: 1
                    }}
                  >
                    {item.description}
                  </Typography>
                  <Typography 
                    variant="h6" 
                    fontWeight="bold" 
                    sx={{ 
                      color: theme.palette.secondary.main,
                      fontFamily: theme.typography.fontFamily,
                      fontSize: { xs: '1.2rem', md: '1.3rem' },
                      mb: 1
                    }}
                  >
                    {item.price}
                  </Typography>
                  <IconButton 
                    sx={{ 
                      color: theme.palette.primary.contrastText,
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      '&:hover': {
                        backgroundColor: theme.palette.secondary.main,
                        color: theme.palette.primary.contrastText,
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <ShoppingCartIcon />
                  </IconButton>
                </Box>
              </motion.div>
            </Box>
          ))}
        </Box>

        {/* Mobile Scroll Indicator */}
        <Box
          sx={{
            display: { xs: 'flex', md: 'none' },
            justifyContent: 'center',
            gap: 1,
            mt: 2,
            mb: 2,
          }}
        >
          {shopItems.map((_, index) => (
            <Box
              key={index}
              sx={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: theme.palette.secondary.main,
                opacity: 0.5,
                transition: 'opacity 0.3s',
              }}
            />
          ))}
        </Box>

        <Button
        variant="contained"
        sx={{
          backgroundColor: theme.palette.secondary.main,
          color: theme.palette.primary.contrastText,
          padding: '12px 30px',
          mb:'1rem',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          fontFamily: theme.typography.fontFamily,
          borderRadius: '30px',
          '&:hover': { backgroundColor: theme.palette.secondary.dark, color: 'white' },
        }}
          onClick={() => (router.push('/gear'))}
        >
          Visit Store
        </Button>
      </Box>
    </Box>
  );
};

export default HeroShop;