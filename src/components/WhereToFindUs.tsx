import React, { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";

// ✅ Next.js compatible asset import - use public folder path
const contactBg = "/assets/img/home_page/photo-4-hero.jpg";

const WhereToFindUs = () => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");

  // 🔧 FIX: Proper typing for handleChange (16:32, 16:48)
  const handleChange = (field: keyof typeof formData) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setResponseMsg("");
    try {
      const res = await fetch("https://d4s73kniab.execute-api.us-west-2.amazonaws.com/contactUs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setResponseMsg("✅ Your message has been sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setResponseMsg(`❌ Error: ${data.message}`);
      }
    } catch (error: unknown) {
      // 🔧 FIX: Proper error typing (39:21)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setResponseMsg(`❌ Error sending message: ${errorMessage}`);
    }
    setLoading(false);
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Yazı Alanı */}
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          p: { xs: 4, md: 6 },
          textAlign: "center",
          borderBottom: `5px solid ${theme.palette.secondary.main}`,
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", mb: 2, color: theme.palette.primary.main }}
        >
          Join Us On A Journey
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: "800px", mx: "auto", lineHeight: 1.8 }}>
          Do you have questions about our tours, academy, or products? Are you interested in
          joining our global network of top trainers and world-class gyms? We are here to help
          guide you, support your passion, and offer you unforgettable experiences.
          Step onto the mat, challenge yourself, and become part of a community dedicated to
          growth, mastery, and adventure.
          Send us a message — let&apos;s start this journey together and make sure you get nothing
          but the best.
        </Typography>
      </Box>

      {/* Form Alanı */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          minHeight: "70vh",
          backgroundImage: `url(${contactBg})`, // ✅ Direct string usage
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "4rem 2rem",
        }}
      >
        {/* Overlay */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
          }}
        />

        {/* Form */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            maxWidth: "600px",
          }}
        >
          <TextField
            fullWidth
            placeholder="NAME"
            variant="standard"
            value={formData.name}
            onChange={handleChange("name")}
            InputProps={{ style: { color: "white", fontSize: "1.1rem" } }}
            sx={{
              mb: 3,
              "& .MuiInput-underline:before": { borderBottom: "1px solid white" },
              "& .MuiInput-underline:hover:before": { borderBottom: "2px solid white" },
            }}
          />
          <TextField
            fullWidth
            placeholder="EMAIL ADDRESS"
            variant="standard"
            value={formData.email}
            onChange={handleChange("email")}
            InputProps={{ style: { color: "white", fontSize: "1.1rem" } }}
            sx={{
              mb: 3,
              "& .MuiInput-underline:before": { borderBottom: "1px solid white" },
              "& .MuiInput-underline:hover:before": { borderBottom: "2px solid white" },
            }}
          />
          <TextField
            fullWidth
            placeholder="MESSAGE"
            variant="standard"
            multiline
            rows={4}
            value={formData.message}
            onChange={handleChange("message")}
            InputProps={{ style: { color: "white", fontSize: "1.1rem" } }}
            sx={{
              mb: 3,
              "& .MuiInput-underline:before": { borderBottom: "1px solid white" },
              "& .MuiInput-underline:hover:before": { borderBottom: "2px solid white" },
            }}
          />

          <Button
            variant="outlined"
            onClick={handleSubmit}
            disabled={loading}
            sx={{
              borderColor: theme.palette.primary.contrastText,
              color: theme.palette.primary.contrastText,
              padding: "12px 40px",
              fontSize: "1.1rem",
              fontWeight: "bold",
              letterSpacing: "2px",
              width: "100%",
              "&:hover": {
                backgroundColor: theme.palette.primary.contrastText,
                color: theme.palette.primary.main,
              },
            }}
          >
            {loading ? "SENDING..." : "SUBMIT"}
          </Button>

          {responseMsg && (
            <Typography
              variant="body2"
              sx={{ mt: 2, color: "white", textAlign: "center" }}
            >
              {responseMsg}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default WhereToFindUs;