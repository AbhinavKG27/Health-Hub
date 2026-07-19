import { Grid, Box} from "@mui/material";
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
      


    <Grid container >
       {is_doctor ? (
        <Grid item xs={12}>
         <DoctorPrivateRoute>
          <DDashboard />
         </DoctorPrivateRoute>
        </Grid>
      ):is_admin ? (
        <Grid item xs={12}>
          <Dashboard />
        </Grid>
      ) : (
        <>
          <Grid item xs={12} >
            <Navbar sx={{ backgroundColor:"#acb2bd"}} />
          </Grid>
          <Grid item xs={12} sx={{ minHeight: '80vh' , backgroundColor:"#dcfcec",  }}>
          <Box>
              <Routes>
                <Route path="/" Component={Screen} />
              <Route path="/contact" Component={Contact} />
               <Route path="/SignUp" Component={SignUpForm} />
                <Route path="/services" Component={Services} />
            <Route path="/about" Component={About} />
                <Route path="/doctor" Component={Doctor} />


                <Route path="/login" Component={LoginForm} />
                <Route path="/doctorlogin" Component={Doctorlogin} />
 
{/* scope of private routes */}
                <Route Component={PrivateRoutes}>
              <Route path="/form/:id" Component={Form} />
                 <Route path="/appointment" Component={Appointment} />
                 <Route path="/room/:roomID" Component={Room} />
                 <Route path="/ambulance-booking" Component={AmbulanceBooking} />
                 <Route path="/report/:id" Component={Report} />
                  <Route path="/userprofile" Component={UserProfile} />
                </Route>
{/* scope of private routes */}
                
                <Route path="*" Component={PagenotFound} />
               </Routes>
           </Box>
          </Grid>
          <Grid item xs={12} sx={{height:'10vh'}}>
            <Footer />
          </Grid>
        </>
      )}
    </Grid>
  );
};




export default App;