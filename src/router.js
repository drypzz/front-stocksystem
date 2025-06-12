import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Dashboard from './pages/Dashboard';
import Main from './pages/Main';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Register from './pages/Register';
import Shop from './pages/Shop';

import Navbar from './components/Navbar';

import { isAuthenticated } from './services/auth';

const PrivateRoute = ({ element }) => {
    return isAuthenticated() ? element : <Navigate to="/login" replace />;
};

const RouterComponent = () => (
    <Router>
        <Navbar />
        <Routes>
            <Route path='/' element={<Main />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
            <Route path='/shop' element={<PrivateRoute element={<Shop />} />} />
            <Route path='*' element={<NotFound />} />
        </Routes>
    </Router>
);

export default RouterComponent;
