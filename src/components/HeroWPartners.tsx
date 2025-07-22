// src/components/HeroWPartners.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  useTheme,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { gsap } from 'gsap';

// ✅ Next.js compatible asset imports - use public folder paths
const trainingImage = '/assets/img/home_page/training_1.jpg';
const strikingImage = '/assets/img/home_page/striking_1.jpg';
const grapplingImage = '/assets/img/home_page/grappling.jpg';

interface AccordionItem {
  title: string;
  items: string[];
  image: string; // ✅ Changed from StaticImageData to string for Next.js public assets
}

const HeroWPartners = () => {
  const theme = useTheme();
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const [activeAccordion, setActiveAccordion] = useState<number | null>(0);

  const gyms = [
    'Alliance MMA Gym',
    'American Kickboxing Academy',
    'American Top Team',
    'Brazilian Top Team',
    'Cruz MMA',
    'El Nino Training Center',
    'Eric Paulson`s CSW Academy',
    'Pacific MMA Academy',
    'Team Alpha Male',
    'Tiger Muay Thai',
    'UFC Gyms',
    'World Team USA',
  ];

  const strikingItems = ['Rise Combat Sports', 'Tiger Muay Thai', 'Woodenman Muay Thai'];
  const grapplingItems = [
    'CJ Judo',
    'Gracie Barra Jiu Jitsu',
    'Nakano Judo Academy',
    'Ralph Gracie Jiu Jitsu',
    'United Wrestling Academy',
  ];

  const accordionData: AccordionItem[] = [
    {
      title: 'Mixed Martial Arts',
      items: gyms,
      image: trainingImage,
    },
    {
      title: 'Striking',
      items: strikingItems,
      image: strikingImage,
    },
    {
      title: 'Grappling',
      items: grapplingItems,
      image: grapplingImage,
    },
  ];

  useEffect(() => {
    gsap.fromTo(
      sectionRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1.5, ease: 'power2.out' }
    );
  }, []);

  useEffect(() => {
    if (imageRef.current) {
      gsap.fromTo(
        imageRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 1, ease: 'power2.out' }
      );
    }
  }, [activeAccordion]);

  const handleAccordionChange = (index: number) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  return (
    <Box
      ref={sectionRef}
      sx={{
        position: 'relative',
        p: { xs: 2, md: 4 },
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        overflow: 'hidden',
        fontFamily: theme.typography.fontFamily,
        borderTop: `5px solid ${theme.palette.secondary.main}`,
        borderBottom: `5px solid ${theme.palette.secondary.main}`,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2rem',
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box
            ref={imageRef}
            component="img"
            src={accordionData[activeAccordion !== null ? activeAccordion : 0].image} // ✅ Fixed: Direct string access, no .src property needed
            alt={accordionData[activeAccordion !== null ? activeAccordion : 0].title}
            sx={{
              width: '100%',
              maxWidth: '500px',
              borderRadius: 2,
              boxShadow: 3,
              transition: 'opacity 0.3s ease, transform 0.3s ease',
            }}
          />
        </Box>

        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: '1.4rem', sm: '2.5rem', md: '3rem' },
              lineHeight: { xs: 1.4, sm: 1.4 },
              letterSpacing: '1px',
              color: theme.palette.text.primary,
              textTransform: 'none',
              maxWidth: '900px',
              margin: '0 auto',
              fontFamily: theme.typography.fontFamily,
            }}
          >
            Train With The Best
          </Typography>

          {accordionData.map((accordion, index) => (
            <Accordion
              key={index}
              expanded={activeAccordion === index}
              onChange={() => handleAccordionChange(index)}
              sx={{
                backgroundColor: theme.palette.primary.main,
                mb: 1,
                color: theme.palette.primary.contrastText,
                boxShadow: 2,
                fontFamily: theme.typography.fontFamily,
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: theme.palette.primary.contrastText }} />}
              >
                <Typography
                  sx={{
                    color: theme.palette.primary.contrastText,
                    fontWeight: 'bold',
                    fontFamily: theme.typography.fontFamily,
                  }}
                >
                  {accordion.title}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {accordion.items.map((item, itemIndex) => (
                    <ListItem key={itemIndex} disableGutters>
                      <Typography
                        sx={{
                          fontFamily: theme.typography.fontFamily,
                          color: theme.palette.primary.contrastText,
                        }}
                      >
                        {`• ${item}`}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Box>

      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: theme.palette.secondary.main,
            color: theme.palette.primary.contrastText,
            padding: '12px 30px',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            fontFamily: theme.typography.fontFamily,
            borderRadius: '30px',
            '&:hover': { backgroundColor: theme.palette.secondary.dark, color: 'white' },
          }}
        >
          Learn More
        </Button>
      </Box>
    </Box>
  );
};

export default HeroWPartners;