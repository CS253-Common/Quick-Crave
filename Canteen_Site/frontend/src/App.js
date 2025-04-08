import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import CanteenVerification from './pages/CanteenRequestVerification';

// {/*CUSTOMER IMPORTS*/}
import CustomerHome from './pages/Customer/CustomerHome';
import CustomerProfile from './pages/Customer/CustomerProfile';
import FoodCanteenListing from './pages/Customer/FoodCanteenListing';
import CanteenListing from './pages/Customer/CanteenListing';
import CanteenDetails from './pages/Customer/CanteenDetails';
import Cart from './pages/Customer/Cart';
import CustomerHistory from './pages/Customer/CustomerHistory';
import ReservationBooking from './pages/Customer/ReservationBooking';
import FavouriteFoods from './pages/Customer/FavouriteFoods';
import OtpPage from './pages/Customer/CustomerOTPPage';

// Canteen Manager Pages
import CanteenManagerProfile from './pages/Canteen/Profile/CanteenManagerProfile';
import CanteenManagerHome from './pages/Canteen/CanteenManagerHome';
import MenuManagement from './pages/Canteen/Menu/MenuManagement';
import OrderQueue from './pages/Canteen/Orders/OrderQueue';
import DiscountManagement from './pages/Canteen/Discounts/DiscountManagement';
import ReservationManagement from './pages/Canteen/Reservations/ReservationManagement';
import CanteenStatistics from './pages/Canteen/Statistics/CanteenStatistics';

function App() {
    const [selectedCanteen, setSelectedCanteen] = useState(null);
    return (
        <Router>
            <Routes>
                {/* Authentication Routes */}

                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/otp" element={<OtpPage />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* CUSTOMER ROUTES */}
                <Route path="/customer-home" element={<CustomerHome />} />
                <Route path="/customer-profile" element={<CustomerProfile />} />
                <Route path="/food-canteen-listing" element={<FoodCanteenListing setSelectedCanteen={setSelectedCanteen}/>} />
                <Route path="/canteen-listing" element={<CanteenListing setSelectedCanteen={setSelectedCanteen}/>} />
                <Route path="/canteen-details" element={<CanteenDetails canteen={selectedCanteen}/>} />
                <Route path="/customer-history" element={<CustomerHistory />} />
                <Route path="/reservation-booking" element={<ReservationBooking />} />
                <Route path="/favourite-foods" element={<FavouriteFoods />} />
                <Route path="/cart" element={<Cart />} />

                {/* Canteen Manager Routes */}
                <Route path="/canteen-manager-home" element={<CanteenManagerHome />}/>
                <Route path="/canteen-manager-profile" element={<CanteenManagerProfile />}/>
                <Route path="/canteen-menu-management" element={<MenuManagement />}/>
                <Route path="/manage-orders" element={<OrderQueue />}/>
                <Route path="/manage-discounts" element={<DiscountManagement />}/>
                <Route path="/manage-reservations" element={<ReservationManagement />}/>
                <Route path="/canteen-statistics" element={<CanteenStatistics />}/>
            </Routes>
        </Router>
    );
}

export default App;