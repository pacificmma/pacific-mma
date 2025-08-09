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
                    height: { xs: '400px', sm: '500px', md: '600px', lg: '650px' },
                    minHeight: { xs: '50vh', md: '60vh' },
                    maxHeight: { xs: '80vh', md: '70vh' },
                    backgroundImage: `url(${BrendaWStudents})`, // ✅ Direct string usage
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
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
                        PACIFIC MMA ACADEMY
                    </Typography>
                </Box>
            </Box>

            {/* Brenda Alone Section */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: 'stretch',
                    backgroundColor: currentTheme.palette.background.paper,
                    color: currentTheme.palette.primary.contrastText,
                    borderTop: `6px solid ${currentTheme.palette.secondary.main}`,
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
                        color: currentTheme.palette.primary.dark
                    }}
                >
                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: currentTheme.palette.primary.dark, fontStyle: 'italic', }}>
                        Where Every Warrior’s Journey Begins
                    </Typography>
                    <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                        PACIFIC MMA ACADEMY isn’t just where we teach martial arts—it’s where legendary lineage meets modern excellence. Under the masterful guidance of Chief Instructor Brenda King, we carry forward the teachings of martial arts royalty directly to you.
                    </Typography>
                </Box>
            </Box>

            {/* Training Atmosphere Section */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column-reverse', md: 'row' },
                    alignItems: 'stretch',
                    backgroundColor: currentTheme.palette.primary.main,
                    borderTop: `6px solid ${currentTheme.palette.secondary.main}`,
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
                        color: currentTheme.palette.text.secondary,
                    }}
                >
                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                        Legendary Lineage, Unmatched Excellence
                    </Typography>
                    <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                        Train under Brenda King, whose martial arts journey traces directly to the source. As a certified instructor under Erik Paulson (legendary MMA fighter and founder of CSW Academy), Rigan Machado (Brazilian Jiu-Jitsu coral belt), and Dan Inosanto (Bruce Lee’s protégé and JKD authority), Brenda brings you techniques passed down from the masters themselves. This isn’t just instruction—it’s the preservation and evolution of martial arts history.
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, mt: 2 }}>
                        The PACIFIC MMA ACADEMY Difference
                    </Typography>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 2 }}>
                        Our comprehensive curriculum encompasses:
                    </Typography>
                    <Box component="ul" sx={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0,
                        '& li': {
                            position: 'relative',
                            paddingLeft: '24px',
                            marginBottom: '12px',
                            lineHeight: 1.8,
                            color: currentTheme.palette.text.secondary,
                            '&:before': {
                                content: '"•"',
                                position: 'absolute',
                                left: 0,
                                color: currentTheme.palette.secondary.main,
                                fontWeight: 'bold',
                            }
                        }
                    }}>
                        <li><strong>Brazilian Jiu-Jitsu</strong> - Direct Machado lineage and technique.</li>
                        <li><strong>MMA & Shooto</strong> - Erik Paulson's proven CSW system.</li>
                        <li><strong>JKD</strong> - Authentic Inosanto methodology.</li>
                        <li><strong>Muay Thai & Kickboxing</strong> - Championship-tested striking.</li>
                        <li><strong>Submission Wrestling</strong> - Where all arts converge.</li>
                    </Box>
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

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: 'stretch',
                    backgroundColor: currentTheme.palette.background.paper,
                    color: currentTheme.palette.primary.contrastText,
                    borderTop: `6px solid ${currentTheme.palette.secondary.main}`,
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
                        color: currentTheme.palette.primary.dark
                    }}
                >
                    <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                        When legends visit the Bay Area, they train here. When champions need West Coast preparation, they choose PACIFIC MMA ACADEMY. When Silicon Valley executives seek transformation, their journey begins on our mats.
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 2, mt: 2 }}>
                        Your Path to Greatness
                    </Typography>
                    <Box component="ul" sx={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0,
                        '& li': {
                            position: 'relative',
                            paddingLeft: '24px',
                            marginBottom: '12px',
                            lineHeight: 1.8,
                            color: currentTheme.palette.primary.dark,
                            '&:before': {
                                content: '"•"',
                                position: 'absolute',
                                left: 0,
                                color: currentTheme.palette.secondary.main,
                                fontWeight: 'bold',
                            }
                        }
                    }}>
                        <li><strong>World-class group classes</strong> built on decades of proven methodology.</li>
                        <li><strong>Specialized coaching</strong> from instructors who embody martial arts history.</li>
                        <li><strong>Private sessions</strong> that fast-track your development.</li>
                        <li><strong>Youth classes</strong> instilling warrior values and lifetime discipline.</li>
                        <li><strong>Direct pathway</strong> to our exclusive PACIFIC MMA CAMPS worldwide.</li>
                    </Box>
                </Box>
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column-reverse', md: 'row' },
                    alignItems: 'stretch',
                    backgroundColor: currentTheme.palette.primary.main,
                    borderTop: `6px solid ${currentTheme.palette.secondary.main}`,
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
                        color: currentTheme.palette.text.secondary,
                    }}
                >
                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, }}>
                        Join the Pacific Warriors
                    </Typography>
                    <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                        At PACIFIC MMA ACADEMY, you’re not just learning techniques—you’re becoming part of a martial arts legacy that stretches from Bruce Lee, Karl Gotch, Satoru Sayama, and Yorinaga Nakamura to today’s MMA champions. Our facility at 1300 Elmer Street, Belmont, California, is where tradition meets innovation.
                    </Typography>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, fontStyle: 'italic' }}>
                        Train with history. Transform your future. The Pacific warrior legacy continues with you
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
            {/* <Box
                id="schedule"
                sx={{
                    backgroundColor: currentTheme.palette.background.paper,
                    color: currentTheme.palette.primary.dark, // Changed to contrastText for better visibility
                    borderTop: `6px solid ${currentTheme.palette.secondary.main}`,
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
                        color: currentTheme.palette.primary.dark, // Changed to contrastText
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
                        color: currentTheme.palette.primary.dark // Changed to contrastText
                    }}
                >
                    Join our comprehensive training program with classes designed for all skill levels.
                    From beginner-friendly sessions to advanced techniques, discover the perfect class for your martial arts journey.
                </Typography>
            </Box> */}

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