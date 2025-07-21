import React from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import giImage from '../../assets/img/home_page/gi.jpg';
import rashGuardImage from '../../assets/img/home_page/shirt.jpg';
import glovesImage from '../../assets/img/home_page/gloves.jpg';
import { useNavigate } from 'react-router-dom';

const HeroShop = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '65vh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 1, md: 2 },
        backgroundColor: theme.palette.primary.main,
        borderTop: `5px solid ${theme.palette.secondary.main}`,
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
            fontSize: { xs: '1.4rem', sm: '2.5rem', md: '3rem' },
            lineHeight: { xs: 1.4, sm: 1.4 },
            letterSpacing: '1px',
            color: theme.palette.primary.contrastText,
            textTransform: 'none',
            maxWidth: '900px',
            margin: '0 auto',
            fontFamily: theme.typography.fontFamily,
          }}
        >
          Shop Gear
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
          Visit our shop to explore our collection of apparel (Gi, NoGi) and equipment for mixed martial arts. Pacific MMA combines high-quality materials with beautiful and functional aesthetics.
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 4,
            mb: 2,
          }}
        >
          {[
            { src: giImage, alt: "Gi", price: "$120", description: "Premium Brazilian Jiu-Jitsu Gi" },
            { src: rashGuardImage, alt: "Rashguard", price: "$50", description: "High-Quality Rashguard" },
            { src: glovesImage, alt: "Gloves", price: "$80", description: "MMA Pro Gloves" },
          ].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              style={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '16px',
                boxShadow: '0px 8px 18px rgba(0, 0, 0, 0.15)',
              }}
            >
              <Box
                component="img"
                src={item.src}
                alt={item.alt}
                sx={{
                  width: '100%',
                  height: '400px',
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
                  background: 'rgba(0, 0, 0, 0.6)',
                  color: theme.palette.primary.contrastText,
                  p: 2,
                  textAlign: 'center',
                  transition: 'opacity 0.3s ease',
                }}
              >
                <Typography variant="h6" fontWeight="bold" sx={{ fontFamily: theme.typography.fontFamily }}>{item.alt}</Typography>
                <Typography variant="body2" sx={{ fontFamily: theme.typography.fontFamily }}>{item.description}</Typography>
                <Typography variant="h6" fontWeight="bold" sx={{ color: theme.palette.primary.contrastText, fontFamily: theme.typography.fontFamily }}>{item.price}</Typography>
                <IconButton sx={{ color: theme.palette.primary.contrastText, mt: 1 }}>
                  <ShoppingCartIcon />
                </IconButton>
              </Box>
            </motion.div>
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
          onClick={() => (window.location.href = '/gear')}
        >
          Visit Shop
        </Button>
      </Box>
    </Box>
  );
};

export default HeroShop;