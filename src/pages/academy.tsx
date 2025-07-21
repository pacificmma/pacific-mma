// src/pages/academy.tsx
import React, { useEffect } from 'react';
import { Box, Typography, Button, useTheme } from '@mui/material'; // useTheme imported
import Header from '../components/Header';
import Footer from '../components/Footer';
import BrendaWStudents from '../assets/img/academy/brendaWstudents.jpg';
import BrendaWAlone from '../assets/img/academy/brendaWalone.jpg';
import BrendaWTraining from '../assets/img/academy/brendaWtraining.jpg';
import theme from '../theme'; // Corrected import path for theme
import { StaticImageData } from 'next/image'; // Import StaticImageData

const AcademyPage = () => {
    // theme is already available via useTheme hook
    // If you need the theme object globally outside of a component,
    // you would typically import it directly or pass it down.
    // For component usage, useTheme() is standard.
    const currentTheme = useTheme(); // Use currentTheme variable for clarity

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <Header />

            {/* Hero Section */}
            <Box
                sx={{
                    width: '100%',
                    minHeight: '70vh',
                    backgroundImage: `url(${(BrendaWStudents as StaticImageData).src})`, // Corrected
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderBottom: `5px solid ${currentTheme.palette.secondary.main}`,
                    position: 'relative',
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0,0,0,0.6)',
                    }}
                />
                <Box
                    sx={{
                        zIndex: 1,
                        color: currentTheme.palette.primary.contrastText,
                        textAlign: 'center',
                        p: 2,
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            fontSize: { xs: '1.4rem', sm: '2.5rem', md: '3rem' },
                            lineHeight: { xs: 1.4, sm: 1.4 },
                            letterSpacing: '1px',
                            color: currentTheme.palette.primary.contrastText,
                            textTransform: 'none',
                            maxWidth: '900px',
                            margin: '0 auto',
                            fontFamily: currentTheme.typography.fontFamily,
                        }}
                    >
                        Pacific MMA Academy
                    </Typography>
                    <Typography variant="h5" sx={{ mb: 3, color: currentTheme.palette.text.secondary }}>
                        A legacy of excellence — training law enforcement, children, and martial artists across disciplines.
                    </Typography>
                </Box>
            </Box>

            {/* About Section */}
            <Box
                sx={{
                    backgroundColor: currentTheme.palette.background.paper,
                    color: currentTheme.palette.text.primary,
                    p: { xs: 3, md: 6 },
                    textAlign: 'center',
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        fontSize: { xs: '1.4rem', sm: '2.5rem', md: '3rem' },
                        lineHeight: { xs: 1.4, sm: 1.4 },
                        letterSpacing: '1px',
                        color: currentTheme.palette.text.primary,
                        textTransform: 'none',
                        maxWidth: '900px',
                        margin: '0 auto',
                        fontFamily: currentTheme.typography.fontFamily,
                    }}
                >
                    About Brenda King
                </Typography>
                <Typography variant="body1" sx={{ maxWidth: '800px', mx: 'auto', lineHeight: 1.8 }}>
                    Located in Redwood City, CA, Pacific MMA Academy ranks among the TOP 20 Bay Area martial arts schools.
                    We offer top-tier classes in Brazilian Jiu-Jitsu, STX Kickboxing, Jeet Kune Do, Kali-Escrima, and a
                    remarkable children’s program. Our renowned Striking Coach, Brenda King, brings over 30 years of experience,
                    holding certifications under Guro Dan Inosanto, Sensei Eric Paulson, and Guro Daniel Sullivan.
                </Typography>
            </Box>

            {/* Brenda Alone Section */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: 'stretch',
                    backgroundColor: currentTheme.palette.primary.main,
                    color: currentTheme.palette.primary.contrastText,
                    borderTop: `5px solid ${currentTheme.palette.secondary.main}`,
                    p: { xs: 3, md: 6 },
                    minHeight: { xs: 'auto', md: '400px' },
                }}
            >
                <Box
                    component="img"
                    src={(BrendaWAlone as StaticImageData).src} // Corrected
                    alt="Brenda Alone"
                    sx={{
                        width: { xs: '100%', md: '50%' },
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '12px',
                        mb: { xs: 3, md: 0 },
                        mr: { md: 4 },
                    }}
                />
                <Box
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        minHeight: '100%',
                    }}
                >
                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: currentTheme.palette.primary.contrastText }}>
                        Brenda's Martial Arts Journey
                    </Typography>
                    <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                        Brenda is not only a coach but a lifelong student of the arts. She’s authorized to teach Jeet Kune Do and Filipino
                        Martial Arts under Guro Dan Inosanto, a Pro Coach in Combat Submission Wrestling under Sensei Eric Paulson, and a
                        Purple Belt in Brazilian Jiu-Jitsu. Brenda’s rich background ensures every class is packed with authentic techniques
                        and modern applications.
                    </Typography>
                </Box>
            </Box>

            {/* Training Atmosphere Section */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column-reverse', md: 'row' },
                    alignItems: 'stretch',
                    backgroundColor: currentTheme.palette.background.paper,
                    borderTop: `5px solid ${currentTheme.palette.secondary.main}`,
                    color: currentTheme.palette.text.primary,
                    p: { xs: 3, md: 6 },
                    minHeight: { xs: 'auto', md: '400px' },
                }}
            >
                <Box
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        minHeight: '100%',
                    }}
                >
                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: currentTheme.palette.text.primary }}>
                        A Space for All Ages
                    </Typography>
                    <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                        Our academy is a trusted training ground for law enforcement, corporate teams, and children alike. We offer specialized
                        self-defense programs tailored for companies like Twitter, Scandinavian Airlines, and the US Navy Sea Cadets.
                        Whether you're stepping on the mat for fitness, competition, or personal growth, you’ll find an encouraging
                        and inclusive community here.
                    </Typography>
                </Box>
                <Box
                    component="img"
                    src={(BrendaWTraining as StaticImageData).src} // Corrected
                    alt="Brenda Training"
                    sx={{
                        width: { xs: '100%', md: '50%' },
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '12px',
                        mb: { xs: 3, md: 0 },
                        ml: { md: 4 },
                    }}
                />
            </Box>

            <Footer />
        </>
    );
};

export default AcademyPage;