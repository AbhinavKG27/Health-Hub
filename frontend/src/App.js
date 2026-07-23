import { Box } from "@mui/material";
import Navbar from "./Components/User/Navbar/Navbar";
import { Routes, Route } from "react-router-dom";
import Footer from "./Components/User/Footer/Footer";
import Report from "./Components/User/pages/Report";
import "./App.css";
import LoginForm from "./Components/User/Login/Login";
import SignUpForm from "./Components/User/Login/Signin";
import Screen from "./Components/User/pages/homecontent/Homepage";
import Contact from "./Components/User/pages/Contact";
import Services from "./Components/User/pages/Services";
import About from "./Components/User/pages/About/About";
import Doctor from "./Components/User/pages/Doctor/Doctor";
import PrivateRoutes from "./Privateroutes";
import DoctorPrivateRoute from "./DoctorprivateRoute";
import Form from "./Components/User/pages/Doctor/Form";
import Doctorlogin from "./Components/User/Login/Doctorlogin";
import Dashboard from "./Components/Admin/Dashboard";
import PagenotFound from "./Components/User/pages/PagenotFound";
import Appointment from "./Components/User/pages/Doctor/Appointment";
import Room from "./Components/User/pages/Doctor/Room";
import DDashboard from "./Components/Doctor/Dashboard";
import UserProfile from "./Components/User/pages/userProfile";
import AmbulanceBooking from "./Components/User/pages/Ambulance";

function App() {
  const token = localStorage.getItem("jwt");
  const is_admin = token && localStorage.getItem("is_admin") === "true";
  const is_doctor = token && localStorage.getItem("is_doctor") === "true";

  return (
    <Box className="app-shell">
      {is_doctor ? (
        <DoctorPrivateRoute>
          <DDashboard />
        </DoctorPrivateRoute>
      ) : is_admin ? (
        <Dashboard />
      ) : (
        <>
          <Navbar />
          <Box className="app-content">
            <Routes>
              <Route path="/" element={<Screen />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/SignUp" element={<SignUpForm />} />
              <Route path="/services" element={<Services />} />
              <Route path="/about" element={<About />} />
              <Route path="/doctor" element={<Doctor />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/doctorlogin" element={<Doctorlogin />} />

              <Route element={<PrivateRoutes />}>
                <Route path="/form/:id" element={<Form />} />
                <Route path="/appointment" element={<Appointment />} />
                <Route path="/room/:roomID" element={<Room />} />
                <Route path="/ambulance-booking" element={<AmbulanceBooking />} />
                <Route path="/report/:id" element={<Report />} />
                <Route path="/userprofile" element={<UserProfile />} />
              </Route>

              <Route path="*" element={<PagenotFound />} />
            </Routes>
          </Box>
          <Footer />
        </>
      )}
    </Box>
  );
}

export default App;