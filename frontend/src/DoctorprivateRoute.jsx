import { Navigate, Outlet } from 'react-router-dom'

const DoctorPrivateRoute = ({ children }) => {
    const token = localStorage.getItem("jwt");
    const isDoctor = localStorage.getItem("is_doctor") === "true";

    if (!token || !isDoctor) {
        return <Navigate to="/doctorlogin" replace />;
    }

    return children || <Outlet />;
}

export default DoctorPrivateRoute