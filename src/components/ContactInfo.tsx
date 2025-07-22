import React from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

// ✅ Next.js compatible asset import - use public folder path
const teamPhoto = "/assets/img/contactUs_page/contactus-team.jpeg";

const ContactUsInfo = () => {
  const theme = useTheme();

  return (
    <Box sx={{ width: "100%", borderBottom: `5px solid ${theme.palette.secondary.main}`, }}>
      {/* Hero Section */}
      <Box
        sx={{
          width: "100%",
          height: { xs: "40vh", md: "80vh" },
          backgroundImage: `url(${teamPhoto})`, // ✅ Fixed: Direct string usage
          backgroundSize: "cover",
          backgroundPosition: "center top",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.6)",
          }}
        />
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: '1.4rem', sm: '2.5rem', md: '3rem' },
              lineHeight: { xs: 1.4, sm: 1.4 },
              letterSpacing: '1px',
              color: theme.palette.primary.contrastText,
              textTransform: 'none',
              maxWidth: '900px',
              zIndex: 1,
              margin: '0 auto',
              fontFamily: theme.typography.fontFamily,
            }}
          >
          Contact Us
        </Typography>
      </Box>
    </Box>
  );
};

export default ContactUsInfo;