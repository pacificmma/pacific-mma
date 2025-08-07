// src/pages/academy.tsx
import React, { useEffect } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ClassCalendar from '../components/ClassCalendar';

// ✅ FIXED: Use public folder paths instead of imports
const BrendaWStudents = '/assets/img/academy/brendaWstudents.jpg';
const BrendaWAlone = '/assets/img/academy/brendaWalone.jpg';
const BrendaWTraining = '/assets/img/academy/brendaWtraining.jpg';

const AcademyPage = () => {
    const currentTheme = useTheme();

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
                    height: { xs: '50vh', md: '60vh' },
                    backgroundImage: `url(${BrendaWStudents})`, // ✅ Direct string usage
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
                    remarkable children&apos;s program. Our renowned Striking Coach, Brenda King, brings over 30 years of experience,
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
                    src={BrendaWAlone} // ✅ Direct string usage
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
                        Brenda&apos;s Martial Arts Journey
                    </Typography>
                    <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                        Brenda is not only a coach but a lifelong student of the arts. She&apos;s authorized to teach Jeet Kune Do and Filipino
                        Martial Arts under Guro Dan Inosanto, a Pro Coach in Combat Submission Wrestling under Sensei Eric Paulson, and a
                        Purple Belt in Brazilian Jiu-Jitsu. Brenda&apos;s rich background ensures every class is packed with authentic techniques
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
                        Whether you&apos;re stepping on the mat for fitness, competition, or personal growth, you&apos;ll find an encouraging
                        and inclusive community here.
                    </Typography>
                </Box>
                <Box
                    component="img"
                    src={BrendaWTraining} // ✅ Direct string usage
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

            {/* Class Schedule Section */}
            <Box
                sx={{
                    backgroundColor: currentTheme.palette.primary.main,
                    color: currentTheme.palette.primary.contrastText, // Changed to contrastText for better visibility
                    borderTop: `5px solid ${currentTheme.palette.secondary.main}`,
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
                        color: currentTheme.palette.primary.contrastText, // Changed to contrastText
                        textTransform: 'none',
                        maxWidth: '900px',
                        margin: '0 auto 2rem auto',
                        fontFamily: currentTheme.typography.fontFamily,
                    }}
                >
                    Class Schedule
                </Typography>
                <Typography 
                    variant="body1" 
                    sx={{ 
                        maxWidth: '800px', 
                        mx: 'auto', 
                        lineHeight: 1.8,
                        mb: 4,
                        color: currentTheme.palette.primary.contrastText // Changed to contrastText
                    }}
                >
                    Join our comprehensive training program with classes designed for all skill levels. 
                    From beginner-friendly sessions to advanced techniques, discover the perfect class for your martial arts journey.
                </Typography>
            </Box>
            
            {/* Class Calendar with separate background */}
            <Box
                sx={{
                    backgroundColor: currentTheme.palette.background.default,
                    color: currentTheme.palette.text.primary,
                    py: { xs: 3, md: 6 },
                }}
            >
                <ClassCalendar
                    showInstructor={true}
                    showCapacity={true}
                    allowNavigation={true}
                    onClassClick={(classData) => {
                        // You can add modal logic here if needed
                    }}
                    onDateChange={(date) => {
                        // You can track week changes here if needed
                    }}
                />
            </Box>

            <Footer />
        </>
    );
};

export default AcademyPage;