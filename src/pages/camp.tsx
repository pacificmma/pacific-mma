import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CampHeroWPhoto from '../components/CampPageHeroWithPhoto';
import Destinations from '../components/Destinations';


const CampPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <Header />
      <CampHeroWPhoto/>
      <Destinations />
      <Footer />
    </>
  );
};

export default CampPage;
