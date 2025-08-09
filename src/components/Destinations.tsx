// src/components/Destinations.tsx
import React, { useState, useMemo } from 'react';
import {
    Box,
    Typography,
    Button,
    useTheme,
    Paper,
    TextField,
} from '@mui/material';
import { Theme } from '@mui/material/styles';
import Link from 'next/link';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { destinations as originalDestinations } from '../utils/destinations';

const animatedComponents = makeAnimated();

type OptionType = { label: string; value: string };

// ✅ FIXED: Updated interface for Next.js string paths
interface DestinationType {
    country: string;
    title: string;
    description: string;
    nights: string;
    price: number;
    image: string; // ✅ Changed from StaticImageData to string
    date: string;
    videoUrl: string;
    isSlideshow: boolean;
    whatYouWillEnjoy: string[];
    generalInfo: string[];
    descriptionPage: string;
    gyms: string[];
    disciplines: string[];
}

const Destinations = () => {
    const theme = useTheme<Theme>();
    const [selectedLocations, setSelectedLocations] = useState<OptionType[]>([]);
    const [selectedDisciplines, setSelectedDisciplines] = useState<OptionType[]>([]);
    const [selectedGyms, setSelectedGyms] = useState<OptionType[]>([]);
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
    const [startDate, endDate] = dateRange;
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    // ✅ FIXED: No casting needed now - types match
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
        <Box sx={{ padding: '2rem', backgroundColor: theme.palette.background.paper }}>
            <Paper elevation={3} sx={{ p: 3, mb: 5, borderRadius: '16px', backgroundColor: theme.palette.background.default }}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: theme.typography.h5.fontWeight, textAlign: 'center', color: theme.palette.text.primary }}>
                    Filter Destinations
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
                    No destinations match your criteria.
                </Typography>
            ) : (
                filteredDestinations.map((dest, index) => {
                    const isEven = index % 2 === 0;
                    const isHovered = hoveredIndex === index;
                    
                    return (
                        <div
                            key={dest.country + index}
                            style={{ cursor: 'pointer' }}
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
                                <div
                                    style={{ flex: 1 }}
                                >
                                    <Box
                                        component="img"
                                        src={dest.image} // ✅ FIXED: Direct string usage (no .src needed)
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
                                            Find Out More
                                        </Button>
                                    </div>
                                </Box>
                            </Box>
                        </div>
                    );
                })
            )}
        </Box>
    );
};

export default Destinations;