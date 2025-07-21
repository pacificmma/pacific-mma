import React, { useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BrendaWStudents from '../assets/img/academy/brendaWstudents.jpg';
import BrendaWAlone from '../assets/img/academy/brendaWalone.jpg';
import BrendaWTraining from '../assets/img/academy/brendaWtraining.jpg';
import theme from '../theme';

const AcademyPage = () => {
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
                    backgroundImage: `url(${BrendaWStudents})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderBottom: `5px solid ${theme.palette.secondary.main}`,
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
                        color: theme.palette.primary.contrastText,
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
                            color: theme.palette.primary.contrastText,
                            textTransform: 'none',
                            maxWidth: '900px',
                            margin: '0 auto',
                            fontFamily: theme.typography.fontFamily,
                        }}
                    >
                        Pacific MMA Academy
                    </Typography>
                    <Typography variant="h5" sx={{ mb: 3, color: theme.palette.text.secondary }}>
                        A legacy of excellence — training law enforcement, children, and martial artists across disciplines.
                    </Typography>
                </Box>
            </Box>

            {/* About Section */}
            <Box
                sx={{
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
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
                        color: theme.palette.text.primary,
                        textTransform: 'none',
                        maxWidth: '900px',
                        margin: '0 auto',
                        fontFamily: theme.typography.fontFamily,
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
                    alignItems: 'stretch', // Ensures children stretch to fill the container
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    borderTop: `5px solid ${theme.palette.secondary.main}`,
                    p: { xs: 3, md: 6 },
                    minHeight: { xs: 'auto', md: '400px' }, // Consistent minHeight for both sections
                }}
            >
                <Box
                    component="img"
                    src={BrendaWAlone}
                    alt="Brenda Alone"
                    sx={{
                        width: { xs: '100%', md: '50%' },
                        height: '100%', // Ensures image stretches to fill the container height
                        objectFit: 'cover', // Maintains aspect ratio while filling the area
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
                        minHeight: '100%', // Ensures text container matches the section height
                    }}
                >
                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: theme.palette.primary.contrastText }}>
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
                    alignItems: 'stretch', // Ensures children stretch to fill the container
                    backgroundColor: theme.palette.background.paper,
                    borderTop: `5px solid ${theme.palette.secondary.main}`,
                    color: theme.palette.text.primary,
                    p: { xs: 3, md: 6 },
                    minHeight: { xs: 'auto', md: '400px' }, // Consistent minHeight for both sections
                }}
            >
                <Box
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        minHeight: '100%', // Ensures text container matches the section height
                    }}
                >
                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: theme.palette.text.primary }}>
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
                    src={BrendaWTraining}
                    alt="Brenda Training"
                    sx={{
                        width: { xs: '100%', md: '50%' }, // Adjusted xs width to 100% for consistency on mobile
                        height: '100%', // Matches Brenda Alone Section for equal height
                        objectFit: 'cover', // Ensures image fills the area without distortion
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
