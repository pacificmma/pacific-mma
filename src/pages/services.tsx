import React, { useEffect } from 'react';
import ServicesHeroFeature from '../components/ServicesHero';
import Header from '../components/Header';
import Footer from '../components/Footer';


const ServicesPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
   <>
   <Header />
   <ServicesHeroFeature />
   <Footer />
   </>
  );
};

export default ServicesPage;
