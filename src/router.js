import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Main from "./pages/Main";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import OrderHistory from "./pages/OrderHistory";
import Profile from "./pages/Profile";
import OrderDetailWrapper from "./pages/OrderDetail";
import Payment from "./pages/Payment";

import Navbar from "./components/Navbar";

import { isAuthenticated } from "./services/auth";

const PrivateRoute = ({ element }) => {
    return isAuthenticated() ? element : <Navigate to="/login" replace />;
};

const RouterComponent = () => (
    <Router>
        <Navbar />
        <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
            <Route path="/shop" element={<PrivateRoute element={<Shop />} />} />
            <Route path="/cart" element={<PrivateRoute element={<Cart />} />} />
            <Route path="/payment/:orderId" element={<PrivateRoute element={<Payment />} />} />
            <Route path="/orders" element={<PrivateRoute element={<OrderHistory />} />} />
            <Route path="/order/:id" element={<PrivateRoute element={<OrderDetailWrapper />} />} />
            <Route path="/user" element={<PrivateRoute element={<Profile />} />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    </Router>
);

export default RouterComponent;