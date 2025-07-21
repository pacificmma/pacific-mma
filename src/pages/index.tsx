import React, { useEffect } from 'react';
import Header from '../components/Header';
import HeroWVideo from '../components/HeroWVideo';
import DestinationSlider from '../components/DestinationsSlider';
import HeroWServices from '../components/HeroWServices';
import HeroWPartners from '../components/HeroWPartners';
import HeroWTrainers from '../components/HeroWTrainer';
import EventCalendar from '../components/EventCalender';
import HeroShop from '../components/HeroShop';
import Footer from '../components/Footer';
import ContactUs from '../components/ContactUS';
import YouthCamp from '../components/YouthCamp';
import { Box } from '@mui/material';

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <Header />
      <HeroWVideo />
      <Box sx={{ width: '100%', overflow: 'hidden', position: 'relative' }}>
        <DestinationSlider />
      </Box>
      <HeroWServices />
      <HeroWPartners />
      <HeroWTrainers />
      <EventCalendar />
      <YouthCamp />
      <HeroShop />
      <ContactUs />
      <Footer />
    </>
  );
};

export default Home;
