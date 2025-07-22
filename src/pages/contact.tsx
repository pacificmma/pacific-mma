import React, { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import ContactUsInfo from "../components/ContactInfo";
import WhereToFindUs from "../components/WhereToFindUs";

const ContactUs = () => {
    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Header />
        <ContactUsInfo />
        <WhereToFindUs />
        <Footer />
      </motion.div>
    );
  };
  
  export default ContactUs;