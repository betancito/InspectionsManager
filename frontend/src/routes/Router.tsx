import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Landing from '../pages/landing';
import Login from '../pages/auth/Login';
import Dashboard from '../pages/Dashboard';
import PrivateRoute from '../components/router/PrivateRoute';



const Router = () => {
    return(
        <BrowserRouter>
            <Routes>
                {/* // Public Routes  */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />

                {/* //Private Routes */}
                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            </Routes>
        </BrowserRouter>
    );
}

export default Router;