import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Button,
  useTheme,
  useMediaQuery,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Drawer,
  Divider
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../slices/Loginslice";
import logo from "../assets/logo.png";

const navItems = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Doctors", to: "/doctor" },
  { label: "Contact", to: "/contact" },
  { label: "Ambulance", to: "/ambulance-booking" }
];

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMatch = useMediaQuery(theme.breakpoints.down("md"));
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const open = Boolean(anchorEl);
  const item = localStorage.getItem("jwt");
  const is_admin = localStorage.getItem("is_admin");

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handlelog = () => {
    dispatch(logout());
    navigate("/");
  };

  const NavLinks = () => (
    <>
      {navItems.map((item) => (
        <Button
          key={item.to}
          component={Link}
          to={item.to}
          sx={{
            color: "#102033",
            fontWeight: 600,
            px: 1.6,
            borderRadius: 999,
            textTransform: "none"
          }}
        >
          {item.label}
        </Button>
      ))}
    </>
  );

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: "rgba(255,255,255,0.72)",
        backdropFilter: "blur(18px)",
        borderBottom: "1px solid rgba(16,32,51,0.08)"
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", gap: 2 }}>
        <Box
          component={Link}
          to="/"
          sx={{ display: "flex", alignItems: "center", gap: 1.2 }}
        >
          <Box
            component="img"
            src={logo}
            alt="Health Hub"
            sx={{ width: 52, height: 52, borderRadius: "50%" }}
          />
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Box sx={{ fontWeight: 800, color: "#102033", lineHeight: 1 }}>
              Health Hub
            </Box>
            <Box sx={{ fontSize: 12, color: "#5b6b7f" }}>
              Modern healthcare
            </Box>
          </Box>
        </Box>

        {isMatch ? (
          <>
            <IconButton onClick={() => setDrawerOpen(true)} sx={{ color: "#102033" }}>
              <MenuIcon />
            </IconButton>

            <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
              <Box sx={{ width: 280, p: 2 }}>
                <Box sx={{ fontWeight: 800, mb: 2 }}>Health Hub</Box>
                <List>
                  {navItems.map((item) => (
                    <ListItem key={item.to} disablePadding>
                      <ListItemButton component={Link} to={item.to} onClick={() => setDrawerOpen(false)}>
                        <ListItemText primary={item.label} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
                <Divider sx={{ my: 1.5 }} />
                {!item ? (
                  <>
                    <ListItem disablePadding>
                      <ListItemButton component={NavLink} to="/login" onClick={() => setDrawerOpen(false)}>
                        <ListItemText primary="User Login" />
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton component={NavLink} to="/doctorlogin" onClick={() => setDrawerOpen(false)}>
                        <ListItemText primary="Doctor Login" />
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton component={Link} to="/SignUp" onClick={() => setDrawerOpen(false)}>
                        <ListItemText primary="Sign Up" />
                      </ListItemButton>
                    </ListItem>
                  </>
                ) : (
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => { handlelog(); setDrawerOpen(false); }}>
                      <ListItemText primary="Logout" />
                    </ListItemButton>
                  </ListItem>
                )}
              </Box>
            </Drawer>
          </>
        ) : (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
            <NavLinks />

            {item && is_admin === "false" ? (
              <>
                <Tooltip title={localStorage.getItem("user") || "Account"}>
                  <IconButton onClick={handleClick} sx={{ ml: 1 }}>
                    <Avatar sx={{ width: 38, height: 38 }} />
                  </IconButton>
                </Tooltip>

                <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                  <MenuItem component={NavLink} to="/appointment" onClick={handleClose}>
                    Appointment
                  </MenuItem>
                  <MenuItem component={NavLink} to="/userprofile" onClick={handleClose}>
                    Profile
                  </MenuItem>
                  <MenuItem onClick={handlelog}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  variant="outlined"
                  component={NavLink}
                  to="/login"
                  sx={{ borderRadius: 999, textTransform: "none", fontWeight: 700 }}
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  component={Link}
                  to="/SignUp"
                  sx={{ borderRadius: 999, textTransform: "none", fontWeight: 700 }}
                >
                  Sign Up
                </Button>
              </>
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;