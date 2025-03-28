import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import CanteenVerification from './pages/Canteen_Request_Verification';


import CustomerHome from './pages/Customer/CustomerHome';
import CustomerProfile from './pages/Customer/CustomerProfile';
import CanteenManagerProfile from './pages/Canteen/Profile/CanteenManagerProfile';
import CanteenManagerHome from './pages/Canteen/CanteenManagerHome';
import MenuManagement from './pages/Canteen/Menu/MenuManagement';
import OrderQueue from './pages/Canteen/Orders/OrderQueue';
import DiscountManagement from './pages/Canteen/Discounts/DiscountManagement';
import ReservationManagement from './pages/Canteen/Reservations/ReservationManagement';
import CanteenStatistics from './pages/Canteen/Statistics/CanteenStatistics';

function App() {
    return (
        <Router>
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/canteen-verification" element={<CanteenVerification />} />

                    
                    <Route path="/customer-home" element={<CustomerHome />} />
                    <Route path="/customer-profile" element={<CustomerProfile />} />

                    <Route path="/canteen-manager-home" element={<CanteenManagerHome />}/>
                    <Route path="/canteen-manager-profile" element={<CanteenManagerProfile />}/>
                    <Route path="/canteen-menu-management" element={<MenuManagement />}/>
                    <Route path="/manage-orders" element={<OrderQueue />}/>
                    <Route path="/manage-discounts" element={<DiscountManagement />}/>
                    <Route path="/manage-reservations" element={<ReservationManagement />}/>
                    <Route path="/canteen-statistics" element={<CanteenStatistics />}/>
                    

                    

                </Routes>
            </div>
        </Router>
    );
}

export default App;