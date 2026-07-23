// frontend/src/Components/User/pages/homecontent/Homepage.jsx
//
// Rewritten landing page. Same data sources as before (getdoctor slice, static
// department list) but restructured around one job: get a visitor to either
// find a doctor or book an appointment within the first screen.

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Stack,
  Typography,
  Button,
  Card,
  CardContent,
  Avatar,
  Chip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { getdoctor } from "../../slices/getDoctor";
import { palette } from "../../../../theme";

// ---- Signature element: an ECG "pulse line" instead of a generic blob/gradient ----
const PulseLine = ({ color = palette.amber, height = 64 }) => (
  <Box
    component="svg"
    viewBox="0 0 600 100"
    sx={{ width: "100%", height, display: "block" }}
    preserveAspectRatio="none"
  >
    <polyline
      points="0,50 90,50 115,15 140,85 165,50 230,50 250,30 270,70 290,50 600,50"
      fill="none"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <animate
        attributeName="stroke-dasharray"
        from="0,1000"
        to="1000,0"
        dur="2.6s"
        begin="0s"
        fill="freeze"
      />
    </polyline>
  </Box>
);

const STEPS = [
  { n: "01", title: "Choose a specialist", body: "Filter by expertise and see real availability before you commit to a doctor." },
  { n: "02", title: "Pick a time", body: "Book the date and slot that works for you — no phone calls, no waiting on hold." },
  { n: "03", title: "See your doctor", body: "Show up (or join by video) and your consultation, invoice and history stay in one place." },
];

const DEPARTMENTS = [
  "Anesthesiology & Critical Care",
  "Clinical Biochemistry",
  "Dermatology",
  "Microbiology",
  "Ophthalmology",
  "Cardiology",
];

const Homepage = () => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const dispatch = useDispatch();
  const { doctor } = useSelector((state) => state.doctor);

  useEffect(() => {
    dispatch(getdoctor());
  }, [dispatch]);

  const spotlightDoctors = (doctor?.doctors || []).slice(0, 3);

  return (
    <Box sx={{ bgcolor: "background.default" }}>
      {/* ---------------- Hero ---------------- */}
      <Container maxWidth="lg" sx={{ pt: { xs: 6, md: 10 }, pb: { xs: 6, md: 8 } }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Chip
              label="Health Haven Hospital"
              size="small"
              sx={{ mb: 2, bgcolor: "primary.main", color: "#fff", fontWeight: 600 }}
            />
            <Typography variant="h1" sx={{ fontSize: { xs: 36, md: 52 }, lineHeight: 1.08, mb: 2 }}>
              Care that fits your schedule, not the other way around.
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", fontSize: 18, mb: 4, maxWidth: 480 }}>
              Find a specialist, book a real appointment slot, and track your
              visits, invoices and prescriptions — all from one dashboard.
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 5 }}>
              <Button
                component={RouterLink}
                to="/doctor"
                variant="contained"
                color="secondary"
                size="large"
                endIcon={<ArrowForwardIcon />}
              >
                Find a doctor
              </Button>
              <Button component={RouterLink} to="/services" variant="outlined" size="large" sx={{ borderColor: "primary.main", color: "primary.main" }}>
                See our services
              </Button>
            </Stack>

            <PulseLine />
            <Stack direction="row" spacing={4} sx={{ mt: 2 }}>
              <Box>
                <Typography variant="h4" sx={{ fontSize: 28 }}>24/7</Typography>
                <Typography variant="body2" color="text.secondary">Ambulance dispatch</Typography>
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontSize: 28 }}>{doctor?.doctors?.length || "—"}</Typography>
                <Typography variant="body2" color="text.secondary">Specialists on call</Typography>
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontSize: 28 }}>3 min</Typography>
                <Typography variant="body2" color="text.secondary">Avg. booking time</Typography>
              </Box>
            </Stack>
          </Grid>

          {/* Quick-book card — the page's actual job, front and center */}
          <Grid item xs={12} md={6}>
            <Card sx={{ bgcolor: "primary.main", color: "#fff", borderRadius: 4, p: { xs: 3, md: 4 } }}>
              <Typography variant="h5" sx={{ mb: 1 }}>Book in under a minute</Typography>
              <Typography variant="body2" sx={{ opacity: 0.85, mb: 3 }}>
                Sign in to see live availability, or browse our doctors first.
              </Typography>
              <Stack spacing={1.5}>
                {STEPS.map((s) => (
                  <Stack key={s.n} direction="row" spacing={2} alignItems="flex-start">
                    <Typography sx={{ fontFamily: "Fraunces, serif", color: palette.amber, fontWeight: 600, minWidth: 28 }}>
                      {s.n}
                    </Typography>
                    <Box>
                      <Typography sx={{ fontWeight: 600 }}>{s.title}</Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>{s.body}</Typography>
                    </Box>
                  </Stack>
                ))}
              </Stack>
              <Button
                component={RouterLink}
                to="/login"
                variant="contained"
                color="secondary"
                fullWidth
                sx={{ mt: 3 }}
              >
                Sign in to book
              </Button>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* ---------------- Departments ---------------- */}
      <Box sx={{ bgcolor: "background.paper", borderTop: 1, borderBottom: 1, borderColor: "divider", py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{ fontSize: { xs: 26, md: 32 }, mb: 4 }}>
            Departments
          </Typography>
          <Grid container spacing={2}>
            {DEPARTMENTS.map((name) => (
              <Grid item xs={12} sm={6} md={4} key={name}>
                <Card sx={{ p: 2.5, height: "100%" }}>
                  <Typography sx={{ fontWeight: 600 }}>{name}</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ---------------- Doctor spotlight (real data, not placeholder copy) ---------------- */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ fontSize: { xs: 26, md: 32 } }}>Meet a few of our doctors</Typography>
          <Button component={RouterLink} to="/doctor" endIcon={<ArrowForwardIcon />}>
            View all
          </Button>
        </Stack>
        <Grid container spacing={3}>
          {spotlightDoctors.length === 0 &&
            [1, 2, 3].map((i) => (
              <Grid item xs={12} sm={4} key={i}>
                <Card sx={{ p: 3, textAlign: "center" }}>
                  <Avatar sx={{ width: 64, height: 64, mx: "auto", mb: 2 }} />
                  <Typography color="text.secondary">Loading…</Typography>
                </Card>
              </Grid>
            ))}
          {spotlightDoctors.map((d) => (
            <Grid item xs={12} sm={4} key={d._id}>
              <Card sx={{ p: 3, textAlign: "center", height: "100%" }}>
                <Avatar src={d.image} alt={d.name} sx={{ width: 72, height: 72, mx: "auto", mb: 2 }} />
                <Typography sx={{ fontWeight: 600 }}>{d.name}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {(d.expertise || []).join(", ")}
                </Typography>
                <Button component={RouterLink} to={`/form/${d._id}`} size="small" variant="outlined">
                  Book appointment
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* ---------------- Closing CTA ---------------- */}
      <Box sx={{ bgcolor: "primary.main", color: "#fff", py: { xs: 6, md: 8 } }}>
        <Container maxWidth="md" sx={{ textAlign: "center" }}>
          <Typography variant="h3" sx={{ fontSize: { xs: 26, md: 34 }, mb: 2 }}>
            Need an ambulance right now?
          </Typography>
          <Typography sx={{ opacity: 0.85, mb: 3 }}>
            Emergency dispatch is one form away — no login required.
          </Typography>
          <Button component={RouterLink} to="/ambulance-booking" variant="contained" color="secondary" size="large">
            Request an ambulance
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default Homepage;