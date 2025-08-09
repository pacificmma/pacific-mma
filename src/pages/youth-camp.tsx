// src/pages/youth-camp.tsx
import React, { useState, useMemo, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    useTheme,
    Paper,
    TextField,
    Container,
} from '@mui/material';
import { Theme } from '@mui/material/styles';
import Link from 'next/link';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { destinations as originalDestinations } from '../utils/destinations';
import Header from '../components/Header';
import Footer from '../components/Footer';

const animatedComponents = makeAnimated();

type OptionType = { label: string; value: string };

interface DestinationType {
    country: string;
    title: string;
    description: string;
    nights: string;
    price: number;
    image: string;
    date: string;
    videoUrl: string;
    isSlideshow: boolean;
    whatYouWillEnjoy: string[];
    generalInfo: string[];
    descriptionPage: string;
    gyms: string[];
    disciplines: string[];
}

// Youth Camp hero image
const YouthCampHero = '/assets/img/camp_page/youthCampHero.jpg';

const YouthCampPage = () => {
    const theme = useTheme<Theme>();
    const [selectedLocations, setSelectedLocations] = useState<OptionType[]>([]);
    const [selectedDisciplines, setSelectedDisciplines] = useState<OptionType[]>([]);
    const [selectedGyms, setSelectedGyms] = useState<OptionType[]>([]);
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
    const [startDate, endDate] = dateRange;
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const destinations: DestinationType[] = originalDestinations as DestinationType[];

    const locations = useMemo(() => Array.from(new Set(destinations.map(dest => dest.country))), [destinations]);
    const disciplines = useMemo(() => Array.from(new Set(destinations.flatMap(dest => dest.disciplines))), [destinations]);
    const gyms = useMemo(() => Array.from(new Set(destinations.flatMap(dest => dest.gyms))), [destinations]);

    const filteredDestinations = useMemo(() => {
        return destinations
            .filter(dest => {
                const matchLocation = selectedLocations.length === 0 || selectedLocations.some(loc => loc.value === dest.country);
                const matchDiscipline = selectedDisciplines.length === 0 || selectedDisciplines.some(d => dest.disciplines.includes(d.value));
                const matchGym = selectedGyms.length === 0 || selectedGyms.some(g => dest.gyms.includes(g.value));
                const matchDate =
                    !startDate || !endDate
                        ? true
                        : new Date(dest.date) >= new Date(startDate) && new Date(dest.date) <= new Date(endDate);
                return matchLocation && matchDiscipline && matchGym && matchDate;
            })
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [selectedLocations, selectedDisciplines, selectedGyms, startDate, endDate, destinations]);

    const formatOptions = (options: string[]): OptionType[] => options.map(opt => ({ label: opt, value: opt }));

    const handleMouseEnter = (index: number) => {
        setHoveredIndex(index);
    };

    const handleMouseLeave = () => {
        setHoveredIndex(null);
    };

    return (
        <>
            <Header />
            
            {/* Hero Section */}
            <Box
                sx={{
                    position: 'relative',
                    width: '100%',
                    height: { xs: '60vh', md: '70vh' },
                    backgroundImage: `url(${YouthCampHero})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderBottom: `5px solid ${theme.palette.secondary.main}`,
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        zIndex: 1,
                    }}
                />
                
                <Container
                    sx={{
                        position: 'relative',
                        zIndex: 2,
                        textAlign: 'center',
                        color: theme.palette.primary.contrastText,
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' },
                            lineHeight: { xs: 1.4, sm: 1.4 },
                            letterSpacing: '1px',
                            fontFamily: theme.typography.fontFamily,
                            fontWeight: 'bold',
                            mb: 2,
                        }}
                    >
                        YOUTH MMA CAMP
                    </Typography>
                </Container>
            </Box>

            {/* More Than a Camp Section - Main Background */}
            <Box
                sx={{
                    backgroundColor: theme.palette.primary.main,
                    py: { xs: 3, sm: 4, md: 5 },
                    borderBottom: `6px solid ${theme.palette.secondary.main}`,
                    width: '100%',
                }}
            >
                <Container sx={{ maxWidth: '1200px', px: { xs: 2, sm: 3, md: 4 } }}>
                    <Typography
                        variant="h5"
                        sx={{
                            textAlign: 'center',
                            fontSize: { xs: '1.2rem', sm: '1.8rem', md: '2.2rem' },
                            fontFamily: theme.typography.fontFamily,
                            mb: 3,
                            color: theme.palette.secondary.main,
                            fontWeight: 'bold',
                        }}
                    >
                        PACIFIC MMA YOUTH WARRIORS
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{
                            textAlign: 'center',
                            fontSize: { xs: '1rem', sm: '1.2rem', md: '1.4rem' },
                            fontFamily: theme.typography.fontFamily,
                            color: theme.palette.primary.contrastText,
                            maxWidth: '800px',
                            mx: 'auto',
                            lineHeight: 1.6,
                            fontStyle: 'italic',
                        }}
                    >
                        Where Every Young Warrior's Journey Begins.
                    </Typography>
                    
                    <Typography
                        variant="h4"
                        sx={{
                            textAlign: 'center',
                            color: theme.palette.primary.contrastText,
                            fontFamily: theme.typography.fontFamily,
                            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                            fontWeight: 'bold',
                            mb: 3,
                        }}
                    >
                        More Than a Camp — A Journey of Transformation
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{
                            textAlign: 'center',
                            color: theme.palette.primary.contrastText,
                            fontFamily: theme.typography.fontFamily,
                            fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
                            lineHeight: 1.8,
                            maxWidth: '900px',
                            mx: 'auto',
                        }}
                    >
                        At PACIFIC MMA, we believe young warriors deserve the same world-class experiences as our adult champions. Our Youth MMA Camps combine authentic martial arts training with carefully curated adventures, creating transformative experiences that shape confident, capable, and culturally aware young people.
                    </Typography>
                </Container>
            </Box>

            {/* Filter and Destinations Section */}
            <Box sx={{ padding: '2rem', backgroundColor: theme.palette.background.paper }}>
                <Paper elevation={3} sx={{ p: 3, mb: 5, borderRadius: '16px', backgroundColor: theme.palette.background.default }}>
                    <Typography variant="h5" sx={{ mb: 3, fontWeight: theme.typography.h5.fontWeight, textAlign: 'center', color: theme.palette.text.primary }}>
                        Filter Youth Camp Destinations
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            gap: 3,
                        }}
                    >
                        <Box sx={{ width: '220px' }}>
                            <Typography variant="body2" sx={{ mb: 0.5, color: theme.palette.text.primary }}>Location</Typography>
                            <Select<OptionType, true>
                                closeMenuOnSelect={false}
                                components={animatedComponents}
                                isMulti
                                options={formatOptions(locations)}
                                value={selectedLocations}
                                onChange={(selected) => setSelectedLocations([...selected])}
                            />
                        </Box>

                        <Box sx={{ width: '220px' }}>
                            <Typography variant="body2" sx={{ mb: 0.5, color: theme.palette.text.primary }}>Discipline</Typography>
                            <Select<OptionType, true>
                                closeMenuOnSelect={false}
                                components={animatedComponents}
                                isMulti
                                options={formatOptions(disciplines)}
                                value={selectedDisciplines}
                                onChange={(selected) => setSelectedDisciplines([...selected])}
                            />
                        </Box>

                        <Box sx={{ width: '220px' }}>
                            <Typography variant="body2" sx={{ mb: 0.5, color: theme.palette.text.primary }}>Gym</Typography>
                            <Select<OptionType, true>
                                closeMenuOnSelect={false}
                                components={animatedComponents}
                                isMulti
                                options={formatOptions(gyms)}
                                value={selectedGyms}
                                onChange={(selected) => setSelectedGyms([...selected])}
                            />
                        </Box>

                        <Box sx={{ width: '220px' }}>
                            <Typography variant="body2" sx={{ mb: 0.5, color: theme.palette.text.primary }}>Select Date Range</Typography>
                            <DatePicker
                                selectsRange
                                startDate={startDate}
                                endDate={endDate}
                                onChange={(update: [Date | null, Date | null]) => setDateRange(update)}
                                isClearable={true}
                                customInput={<TextField fullWidth size="small" sx={{ height: '40px', backgroundColor: theme.palette.background.paper, borderRadius: '8px' }} />}
                                popperPlacement="bottom"
                            />
                        </Box>
                    </Box>
                </Paper>

                {filteredDestinations.length === 0 ? (
                    <Typography variant="h6" sx={{ textAlign: 'center', color: theme.palette.text.secondary }}>
                        No youth camp destinations match your criteria.
                    </Typography>
                ) : (
                    filteredDestinations.map((dest, index) => {
                        const isEven = index % 2 === 0;
                        
                        return (
                            <React.Fragment key={dest.country + index}>
                                {index === filteredDestinations.length - 1 && (
                                    <Box
                                        sx={{
                                            backgroundColor: theme.palette.primary.main,
                                            py: { xs: 3, sm: 4, md: 5 },
                                            borderTop: `6px solid ${theme.palette.secondary.main}`,
                                            borderBottom: `6px solid ${theme.palette.secondary.main}`,
                                            textAlign: 'center',
                                            mb: '4rem',
                                            width: '100vw',
                                            position: 'relative',
                                            left: '50%',
                                            right: '50%',
                                            marginLeft: '-50vw',
                                            marginRight: '-50vw',
                                        }}
                                    >
                                        <Container sx={{ maxWidth: '1200px', px: { xs: 2, sm: 3, md: 4 } }}>
                                            <Typography
                                                variant="h4"
                                                sx={{
                                                    color: theme.palette.primary.contrastText,
                                                    fontFamily: theme.typography.fontFamily,
                                                    fontSize: { xs: '1.2rem', sm: '1.8rem', md: '2.2rem' },
                                                    fontWeight: 'bold',
                                                    mb: 2,
                                                }}
                                            >
                                                Limited spots available. Champions are made early.
                                            </Typography>

                                            <Typography
                                                variant="h5"
                                                sx={{
                                                    color: theme.palette.primary.contrastText,
                                                    fontFamily: theme.typography.fontFamily,
                                                    fontSize: { xs: '1rem', sm: '1.4rem', md: '1.8rem' },
                                                    mb: 1,
                                                }}
                                            >
                                                PACIFIC MMA <Box component="span" sx={{ color: theme.palette.secondary.main }}>YOUTH WARRIOR CAMPS</Box>: Where young champions travel, train, and transform.
                                            </Typography>
                                        </Container>
                                    </Box>
                                )}

                                {index === 1 && (
                                    <Box
                                        sx={{
                                            backgroundColor: theme.palette.primary.main,
                                            py: { xs: 3, sm: 4, md: 5 },
                                            borderTop: `6px solid ${theme.palette.secondary.main}`,
                                            borderBottom: `6px solid ${theme.palette.secondary.main}`,
                                            mb: '6rem',
                                            width: '100vw',
                                            position: 'relative',
                                            left: '50%',
                                            right: '50%',
                                            marginLeft: '-50vw',
                                            marginRight: '-50vw',
                                        }}
                                    >
                                        <Container sx={{ maxWidth: '1200px', px: { xs: 2, sm: 3, md: 4 } }}>
                                            <Typography
                                                variant="h4"
                                                sx={{
                                                    textAlign: 'center',
                                                    color: theme.palette.primary.contrastText,
                                                    fontFamily: theme.typography.fontFamily,
                                                    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                                                    fontWeight: 'bold',
                                                    mb: 4,
                                                }}
                                            >
                                                The Youth Warrior Experience
                                            </Typography>
                                            
                                            <Box
                                                sx={{
                                                    display: 'grid',
                                                    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                                                    gap: 4,
                                                    width: '100%',
                                                }}
                                            >
                                                {/* World-Class Training */}
                                                <Box>
                                                    <Typography
                                                        variant="h5"
                                                        sx={{
                                                            color: theme.palette.secondary.main,
                                                            fontFamily: theme.typography.fontFamily,
                                                            fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' },
                                                            fontWeight: 'bold',
                                                            mb: 2,
                                                        }}
                                                    >
                                                        World-Class Training, Kid-Sized Fun:
                                                    </Typography>
                                                    
                                                    <Box component="ul" sx={{ 
                                                        listStyle: 'none', 
                                                        padding: 0,
                                                        '& li': {
                                                            position: 'relative',
                                                            paddingLeft: '20px',
                                                            marginBottom: '8px',
                                                            color: theme.palette.primary.contrastText,
                                                            fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                                                            lineHeight: 1.6,
                                                            '&:before': {
                                                                content: '"•"',
                                                                position: 'absolute',
                                                                left: 0,
                                                                color: theme.palette.secondary.main,
                                                                fontWeight: 'bold',
                                                            }
                                                        }
                                                    }}>
                                                        <li>Brazilian Jiu-Jitsu fundamentals with games and challenges.</li>
                                                        <li>Kickboxing techniques through interactive drills.</li>
                                                        <li>Self-defense skills they'll remember forever.</li>
                                                        <li>Strength and agility training disguised as play.</li>
                                                        <li>Anti-bullying strategies and confidence building.</li>
                                                    </Box>
                                                </Box>

                                                {/* Adventure Beyond the Mats */}
                                                <Box>
                                                    <Typography
                                                        variant="h5"
                                                        sx={{
                                                            color: theme.palette.secondary.main,
                                                            fontFamily: theme.typography.fontFamily,
                                                            fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' },
                                                            fontWeight: 'bold',
                                                            mb: 2,
                                                        }}
                                                    >
                                                        Adventure Beyond the Mats:
                                                    </Typography>
                                                    
                                                    <Box component="ul" sx={{ 
                                                        listStyle: 'none', 
                                                        padding: 0,
                                                        '& li': {
                                                            position: 'relative',
                                                            paddingLeft: '20px',
                                                            marginBottom: '8px',
                                                            color: theme.palette.primary.contrastText,
                                                            fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                                                            lineHeight: 1.6,
                                                            '&:before': {
                                                                content: '"•"',
                                                                position: 'absolute',
                                                                left: 0,
                                                                color: theme.palette.secondary.main,
                                                                fontWeight: 'bold',
                                                            }
                                                        }
                                                    }}>
                                                        <li><strong>Local Expeditions:</strong> Beach training, mountain hikes, cultural site visits.</li>
                                                        <li><strong>Warrior Challenges:</strong> Obstacle courses, team adventures, nature exploration.</li>
                                                        <li><strong>Cultural Immersion:</strong> Meet young martial artists from different backgrounds.</li>
                                                        <li><strong>Championship Experiences:</strong> Visit professional gyms, meet real fighters.</li>
                                                        <li><strong>Travel Skills:</strong> Learn to explore confidently and respectfully.</li>
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </Container>
                                    </Box>
                                )}

                                {index === 3 && (
                                    <Box
                                        sx={{
                                            backgroundColor: theme.palette.primary.main,
                                            py: { xs: 3, sm: 4, md: 5 },
                                            borderTop: `6px solid ${theme.palette.secondary.main}`,
                                            borderBottom: `6px solid ${theme.palette.secondary.main}`,
                                            mb: '6rem',
                                            width: '100vw',
                                            position: 'relative',
                                            left: '50%',
                                            right: '50%',
                                            marginLeft: '-50vw',
                                            marginRight: '-50vw',
                                        }}
                                    >
                                        <Container sx={{ maxWidth: '1200px', px: { xs: 2, sm: 3, md: 4 } }}>
                                            <Typography
                                                variant="h4"
                                                sx={{
                                                    textAlign: 'center',
                                                    color: theme.palette.primary.contrastText,
                                                    fontFamily: theme.typography.fontFamily,
                                                    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                                                    fontWeight: 'bold',
                                                    mb: 3,
                                                }}
                                            >
                                                Safe Adventures, Trusted Supervision
                                            </Typography>
                                            
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    textAlign: 'center',
                                                    color: theme.palette.primary.contrastText,
                                                    fontFamily: theme.typography.fontFamily,
                                                    fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
                                                    mb: 3,
                                                    maxWidth: '800px',
                                                    mx: 'auto',
                                                    lineHeight: 1.8,
                                                }}
                                            >
                                                Every adventure is meticulously planned with safety first:
                                            </Typography>

                                            <Box
                                                sx={{
                                                    display: 'grid',
                                                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr' },
                                                    gap: 3,
                                                    width: '100%',
                                                }}
                                            >
                                                <Box component="ul" sx={{ 
                                                    listStyle: 'none', 
                                                    padding: 0,
                                                    '& li': {
                                                        position: 'relative',
                                                        paddingLeft: '20px',
                                                        marginBottom: '8px',
                                                        color: theme.palette.primary.contrastText,
                                                        fontSize: { xs: '0.9rem', sm: '1rem' },
                                                        lineHeight: 1.6,
                                                        '&:before': {
                                                            content: '"•"',
                                                            position: 'absolute',
                                                            left: 0,
                                                            color: theme.palette.secondary.main,
                                                            fontWeight: 'bold',
                                                        }
                                                    }
                                                }}>
                                                    <li>24/7 attention, protection, and guidance.</li>
                                                    <li>Low instructor-to-student ratio ensuring personalized care.</li>
                                                    <li>Background-checked, certified staff with youth training expertise.</li>
                                                </Box>

                                                <Box component="ul" sx={{ 
                                                    listStyle: 'none', 
                                                    padding: 0,
                                                    '& li': {
                                                        position: 'relative',
                                                        paddingLeft: '20px',
                                                        marginBottom: '8px',
                                                        color: theme.palette.primary.contrastText,
                                                        fontSize: { xs: '0.9rem', sm: '1rem' },
                                                        lineHeight: 1.6,
                                                        '&:before': {
                                                            content: '"•"',
                                                            position: 'absolute',
                                                            left: 0,
                                                            color: theme.palette.secondary.main,
                                                            fontWeight: 'bold',
                                                        }
                                                    }
                                                }}>
                                                    <li>Medical personnel on standby at all activities.</li>
                                                    <li>Comprehensive insurance coverage for complete peace of mind.</li>
                                                    <li>24/7 parent communication and real-time updates.</li>
                                                </Box>

                                                <Box component="ul" sx={{ 
                                                    listStyle: 'none', 
                                                    padding: 0,
                                                    '& li': {
                                                        position: 'relative',
                                                        paddingLeft: '20px',
                                                        marginBottom: '8px',
                                                        color: theme.palette.primary.contrastText,
                                                        fontSize: { xs: '0.9rem', sm: '1rem' },
                                                        lineHeight: 1.6,
                                                        '&:before': {
                                                            content: '"•"',
                                                            position: 'absolute',
                                                            left: 0,
                                                            color: theme.palette.secondary.main,
                                                            fontWeight: 'bold',
                                                        }
                                                    }
                                                }}>
                                                    <li>Age-appropriate activities designed for maximum fun and safety.</li>
                                                </Box>
                                            </Box>
                                        </Container>
                                    </Box>
                                )}

                                {index === 5 && (
                                    <Box
                                        sx={{
                                            backgroundColor: theme.palette.primary.main,
                                            py: { xs: 3, sm: 4, md: 5 },
                                            borderTop: `6px solid ${theme.palette.secondary.main}`,
                                            borderBottom: `6px solid ${theme.palette.secondary.main}`,
                                            mb: '6rem',
                                            width: '100vw',
                                            position: 'relative',
                                            left: '50%',
                                            right: '50%',
                                            marginLeft: '-50vw',
                                            marginRight: '-50vw',
                                        }}
                                    >
                                        <Container sx={{ maxWidth: '1200px', px: { xs: 2, sm: 3, md: 4 } }}>
                                            <Typography
                                                variant="h4"
                                                sx={{
                                                    textAlign: 'center',
                                                    color: theme.palette.primary.contrastText,
                                                    fontFamily: theme.typography.fontFamily,
                                                    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                                                    fontWeight: 'bold',
                                                    mb: 4,
                                                }}
                                            >
                                                Building Tomorrow's Champions
                                            </Typography>
                                            
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    textAlign: 'center',
                                                    color: theme.palette.primary.contrastText,
                                                    fontFamily: theme.typography.fontFamily,
                                                    fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
                                                    mb: 4,
                                                    maxWidth: '800px',
                                                    mx: 'auto',
                                                }}
                                            >
                                                Our youth camps develop:
                                            </Typography>

                                            <Box component="ul" sx={{ 
                                                listStyle: 'none', 
                                                padding: 0,
                                                width: '100%',
                                                maxWidth: '800px',
                                                mx: 'auto',
                                                '& li': {
                                                    position: 'relative',
                                                    paddingLeft: '20px',
                                                    marginBottom: '12px',
                                                    color: theme.palette.primary.contrastText,
                                                    fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                                                    lineHeight: 1.6,
                                                    '&:before': {
                                                        content: '"•"',
                                                        position: 'absolute',
                                                        left: 0,
                                                        color: theme.palette.secondary.main,
                                                        fontWeight: 'bold',
                                                    }
                                                }
                                            }}>
                                                <li><strong>Physical Skills:</strong> Coordination, strength, flexibility, self-defense.</li>
                                                <li><strong>Mental Fortitude:</strong> Focus, discipline, goal-setting, resilience.</li>
                                                <li><strong>Social Intelligence:</strong> Teamwork, leadership, cultural awareness, respect.</li>
                                                <li><strong>Life Skills:</strong> Travel confidence, adventure readiness, problem-solving.</li>
                                                <li><strong>Warrior Values:</strong> Honor, courage, compassion, responsibility.</li>
                                            </Box>
                                        </Container>
                                    </Box>
                                )}

                                <div
                                    style={{ cursor: 'pointer' }}
                                    onMouseEnter={() => handleMouseEnter(index)}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: isEven ? 'row' : 'row-reverse',
                                            alignItems: 'flex-start',
                                            justifyContent: 'space-between',
                                            gap: '3rem',
                                            mb: '6rem',
                                            flexWrap: 'wrap',
                                            [theme.breakpoints.down('md')]: {
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                            },
                                        }}
                                    >
                                        <div style={{ flex: 1 }}>
                                            <Box
                                                component="img"
                                                src={dest.image}
                                                alt={dest.country}
                                                sx={{
                                                    width: '100%',
                                                    borderRadius: '6px',
                                                    objectFit: 'cover',
                                                    maxHeight: '500px',
                                                    boxShadow: '0px 10px 25px rgba(0,0,0,0.15)',
                                                }}
                                            />
                                        </div>

                                        <Box
                                            sx={{
                                                flex: 1,
                                                maxWidth: '500px',
                                                textAlign: isEven ? 'left' : 'right',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'center',
                                                gap: '1.25rem',
                                                pt: '1rem',
                                                [theme.breakpoints.down('md')]: {
                                                    textAlign: 'center',
                                                    alignItems: 'center',
                                                },
                                            }}
                                        >
                                            <div>
                                                <Typography variant="h5" sx={{ fontWeight: theme.typography.h5.fontWeight, letterSpacing: '1px' }}>
                                                    {dest.country.toUpperCase()}
                                                </Typography>
                                            </div>
                                            
                                            <div>
                                                <Typography variant="body1" sx={{ color: theme.palette.text.primary, lineHeight: 1.6 }}>
                                                    {dest.description}
                                                </Typography>
                                            </div>
                                            
                                            <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                                                {dest.nights} — Starting from ${dest.price} — {new Date(dest.date).toLocaleDateString()}
                                            </Typography>
                                            
                                            <div>
                                                <Button
                                                    component={Link}
                                                    href={`/destination/${dest.country.toLowerCase().replace(/\s+/g, '-')}`}
                                                    variant="contained"
                                                    sx={{
                                                        backgroundColor: theme.palette.secondary.main,
                                                        color: theme.palette.primary.contrastText,
                                                        fontWeight: theme.typography.button.fontWeight,
                                                        fontSize: theme.typography.button.fontSize,
                                                        fontFamily: theme.typography.fontFamily,
                                                        borderRadius: '20px',
                                                        padding: '8px 16px',
                                                        minHeight: '40px',
                                                        '&:hover': { backgroundColor: theme.palette.secondary.dark },
                                                    }}
                                                >
                                                    Youth Camp Details
                                                </Button>
                                            </div>
                                        </Box>
                                    </Box>
                                </div>

                            </React.Fragment>
                        );
                    })
                )}
            </Box>

            <Footer />
        </>
    );
};

export default YouthCampPage;