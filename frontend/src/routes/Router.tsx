import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Landing from '../pages/landing';
import Login from '../pages/auth/Login';
import Dashboard from '../pages/Dashboard';
import PrivateRoute from '../components/router/PrivateRoute';
import Details from '../pages/Details';
import Register from '../pages/auth/Register';
import TestAuth from '../pages/auth/TestAuth';


const Router = () => {
    return(
            <BrowserRouter>
                <Routes>
                    {/* // Public Routes  */}
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/test" element={<TestAuth/>} />

                    {/* //Private Routes */}
                    <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                    <Route path="/inspection/:id" element={<PrivateRoute><Details/></PrivateRoute>}/>
                </Routes>
            </BrowserRouter>
    );
}

export default Router;