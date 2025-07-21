// src/pages/profile.tsx
import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography, useTheme } from '@mui/material';
import PersonalDetails from '../components/PersonalDetails';
import PreviousTrips from '../components/PreviousTrips';
import PreviousPurchases from '../components/PreviousPurchases';
import Pacific_MMA_Logo from '../assets/img/personal_page/pacific_mma.jpg';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useFirebaseAuth } from '../providers/fireBaseAuthProvider';
import { StaticImageData } from 'next/image'; // Import StaticImageData

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`user-info-tabpanel-${index}`}
      aria-labelledby={`user-info-tab-${index}`}
      {...other}
      style={{ width: '100%' }}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `user-info-tab-${index}`,
    'aria-controls': `user-info-tabpanel-${index}`,
  };
}

const UserInfoDetailsPage = () => {
  const theme = useTheme();
  const { user, loading } = useFirebaseAuth();
  const [selectedTab, setSelectedTab] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  if (loading) {
    return (
      <>
        <Header />
        <Box
          sx={{
            height: 'calc(100vh - 80px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: theme.palette.text.secondary,
            backgroundColor: theme.palette.background.default,
            fontFamily: theme.typography.fontFamily,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Loading...
          </Typography>
        </Box>
        <Footer />
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Header />
        <Box
          sx={{
            height: 'calc(100vh - 80px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: theme.palette.text.secondary,
            backgroundColor: theme.palette.background.default,
            fontFamily: theme.typography.fontFamily,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Please log in to see your profile.
          </Typography>
        </Box>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <Box
        sx={{
          bgcolor: theme.palette.background.default,
          color: theme.palette.text.secondary,
          fontFamily: theme.typography.fontFamily,
          minHeight: 'calc(100vh - 80px)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Banner */}
        <Box
          sx={{
            width: '100%',
            height: '40vh',
            minHeight: '250px',
            maxHeight: '600px',
            backgroundColor: theme.palette.primary.main,
            borderBottom: `3px solid ${theme.palette.secondary.main}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            position: 'relative',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
        >
          <Box
            component="img"
            src={(Pacific_MMA_Logo as StaticImageData).src} // Corrected: Access the .src property
            alt="Pacific MMA Logo"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              userSelect: 'none',
            }}
          />
        </Box>

        {/* Tabs */}
        <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
          {/* Sidebar */}
          <Box
            sx={{
              width: { xs: '200px', sm: '220px', md: '250px' },
              flexShrink: 0,
              backgroundColor: theme.palette.primary.main,
              borderRight: `2px solid ${theme.palette.primary.light}`,
            }}
          >
            <Tabs
              orientation="vertical"
              variant="standard"
              value={selectedTab}
              onChange={handleChange}
              aria-label="User Info Tabs"
              sx={{
                height: '100%',
                '& .MuiTabs-indicator': {
                  backgroundColor: theme.palette.secondary.main,
                  width: '4px',
                },
                '& .MuiTab-root': {
                  color: theme.palette.background.paper,
                  textTransform: 'none',
                  fontWeight: theme.typography.button.fontWeight,
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  padding: { xs: '12px 16px', sm: '16px 24px' },
                  alignItems: 'flex-start',
                  minHeight: '60px',
                  transition: 'color 0.3s ease',
                  '&:hover': {
                    color: theme.palette.secondary.main,
                  },
                },
                '& .Mui-selected': {
                  color: theme.palette.secondary.main,
                  fontWeight: 'bold',
                },
              }}
            >
              <Tab label="Personal Details" {...a11yProps(0)} />
              <Tab label="Previous Trips" {...a11yProps(1)} />
              <Tab label="Previous Purchases" {...a11yProps(2)} />
            </Tabs>
          </Box>

          {/* Tab Content */}
          <Box
            sx={{
              flexGrow: 1,
              bgcolor: theme.palette.background.default,
              overflowY: 'auto',
              minWidth: 0,
              '& h1, & h2, & h3, & h4, & h5, & h6': {
                color: theme.palette.text.primary,
              },
              '& .MuiTypography-root': {
                color: theme.palette.text.primary,
              },
              '& .MuiInputLabel-root': {
                color: theme.palette.text.primary,
              },
              '& .MuiFormLabel-root': {
                color: theme.palette.text.primary,
              },
            }}
          >
            <TabPanel value={selectedTab} index={0}>
              <PersonalDetails user={user} />
            </TabPanel>
            <TabPanel value={selectedTab} index={1}>
              <PreviousTrips />
            </TabPanel>
            <TabPanel value={selectedTab} index={2}>
              <PreviousPurchases />
            </TabPanel>
          </Box>
        </Box>
      </Box>

      <Footer />
    </>
  );
};

export default UserInfoDetailsPage;