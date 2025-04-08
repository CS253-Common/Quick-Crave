import React, {useState} from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
// import CanteenVerification from './pages/CanteenRequestVerification';

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

// {/*CANTEEN MANAGER IMPORTS*/}
// import CanteenManagerHome from './pages/Canteen/CanteenManagerHome';
// import CanteenManagerProfile from './pages/Canteen/CanteenManagerProfile';
// import CanteenStatistics from './pages/Canteen/CanteenStatistics';
// import DiscountManagement from './pages/Canteen/DiscountManagement';
// import OrderQueue from './pages/Canteen/OrderQueue';
// import ReservationManagement from './pages/Canteen/ReservationManagement';

function App() {
    const [selectedCanteen, setSelectedCanteen] = useState(null);
    return (
        <Router>
            <div style={{ textAlign: 'center', marginTop: '0px' }}>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/otp" element={<OtpPage />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    {/* <Route path="/canteen-verification" element={<CanteenVerification />} /> */}

                    {/* CUSTOMER ROUTES */}
                    <Route path="/customer-home" element={<CustomerHome setSelectedCanteen={setSelectedCanteen}/>} />
                    <Route path="/customer-profile" element={<CustomerProfile />} />
                    <Route path="/food-canteen-listing" element={<FoodCanteenListing setSelectedCanteen={setSelectedCanteen}/>} />
                    <Route path="/canteen-listing" element={<CanteenListing setSelectedCanteen={setSelectedCanteen}/>} />
                    <Route path="/canteen-details" element={<CanteenDetails canteen={selectedCanteen}/>} />
                    <Route path="/customer-history" element={<CustomerHistory />} />
                    <Route path="/reservation-booking" element={<ReservationBooking canteen={selectedCanteen}/>} />
                    <Route path="/favourite-foods" element={<FavouriteFoods />} />
                    <Route path="/cart" element={<Cart />} />

                    {/* CANTEEN MANAGER ROUTES */}
                    {/* <Route path="/canteen-manager-home" element={<CanteenManagerHome />} />
                    <Route path="/canteen-manager-profile" element={<CanteenManagerProfile />} />
                    <Route path="/canteen-statistics" element={<CanteenStatistics />} />
                    <Route path="/canteen-discount-management" element={<DiscountManagement />} />
                    <Route path="/canteen-order-queue" element={<OrderQueue />} />
                    <Route path="/canteen-reservation-management" element={<ReservationManagement />} /> */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;