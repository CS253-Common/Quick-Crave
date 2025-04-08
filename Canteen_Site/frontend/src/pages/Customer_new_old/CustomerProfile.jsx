import React, { useState, useEffect, use } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaBars, FaTimes, FaUser, FaHome, FaHistory, FaHeart, FaCog, FaSignOutAlt, FaUserCircle, FaCamera, FaEdit, FaLock, FaClipboardList, FaUtensils, FaHamburger, FaCalendarCheck } from 'react-icons/fa';
import '../../styles/Customer/customer_profile.css';
import '../../styles/Components/customer_sidemenu.css';

const CustomerProfile = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [profileImage, setProfileImage] = useState('/images/user_default.png');
    const [isLoading, setIsLoading] = useState(false);
    const [userDetails, setUserDetails] = useState([]);
    const navigate = useNavigate();

    const FetchDetails = async () => {
        try {
            setIsLoading(true);
            console.log("Loading user data..."); 
            const result = await axios.post(
                'http://localhost:4000/customer/customer-view-profile',
                {},  // Empty request body
                {
                    withCredentials: true, // Ensures cookies are sent with the request
                }
            );
            console.log("fetched")
            if (result.data && result.data.success) {
                setUserDetails(result.data.profile);
                console.log("Data:", result.data.profile);
            }
        } catch (error) {
            console.error("Error fetching user details:", error);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        FetchDetails();
    }, []);

    // const FetchDetails = async () => {
    //     try {
    //         setIsLoading(true);
    //         console.log("Loading user data...");
    
    //         const result = await axios.post('http://localhost:4000/customer/customer-view-profile');
    
    //         if (result.data && result.data.success) {
    //             const profileData = result.data.profile;
                
    //             setUserDetails({
    //                 name: profileData.name,
    //                 username: profileData.username,
    //                 email: profileData.email,
    //                 phone_number: profileData.phone_number,
    //                 wallet_balance: profileData.wallet_balance,
    //                 total_orders: profileData.total_orders,
    //                 food_delivery: profileData.food_delivery,
    //                 dineout: profileData.dineout,
    //                 total_reservations: profileData.total_reservations,
    //             });
    
    //             console.log("Fetched user details:", profileData);
    //         } else {
    //             console.error("Error: Profile fetch unsuccessful", result.data.message);
    //         }
    //     } catch (error) {
    //         console.error("Error fetching user details:", error);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    // useEffect(() =>{
    //     FetchDetails();
    // },[]);


    // Toggle side menu
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Close menu when clicking outside
    const closeMenu = (e) => {
        if (!e.target.closest('.cp-side-menu') && !e.target.closest('.cp-menu-btn')) {
            setIsMenuOpen(false);
        }
    };

    // Handle profile image change
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.match('image.*')) {
                showNotification('Please select an image file', 'error');
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                showNotification('Please select an image smaller than 5MB', 'error');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                setProfileImage(e.target.result);
                showNotification('Profile photo updated successfully!', 'success');
                // Here you would typically save to your backend or state management
            };
            reader.readAsDataURL(file);
        }
    };

    // Show notification
    const showNotification = (message, type = 'success') => {
        const notification = document.createElement('div');
        notification.className = `cp-notification cp-${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 3000);
    };

    // Handle logout
    const handleLogout = () => {
        // Clear user session
        // userDetails[em('current_user');
        navigate('/login');
    };

    return (
        <div className="cp-home-container">
            {/* Side Menu Overlay */}
            {isMenuOpen && <div className="cp-side-menu-overlay" onClick={closeMenu}></div>}
            
            {/* Side Menu */}
            <div className={`cs-side-menu ${isMenuOpen ? 'active' : ''}`}>
                <div className="cs-side-menu-header">
                    <button className="cs-close-menu-btn" onClick={toggleMenu}>
                        <FaTimes />
                    </button>
                    <div className="cs-menu-user-info">
                        <div className="cs-menu-user-avatar">
                            <img src={userDetails['img_url']} alt="User Avatar" onError={(e) => { e.target.onerror = null; e.target.src = '/images/user_default.png' }} />
                        </div>
                        <div className="cs-menu-user-details">
                            <h3 className="cs-menu-user-name">{userDetails['name']}</h3>
                            <p className="cs-menu-user-email">{userDetails['email']}</p>
                        </div>
                    </div>
                </div>
                <div className="cs-side-menu-content">
                    <ul className="cs-menu-items">
                        <li className="cs-menu-item">
                            <Link to="/customer-home"><FaHome /> Home </Link>
                        </li>
                        <li className="cs-menu-item active">
                            <Link to="/customer-profile"><FaUser /> Profile </Link>
                        </li>
                        <li className="cs-menu-item">
                            <Link to="/customer-history"><FaHistory /> Order History </Link>
                        </li>
                        <li className="cs-menu-item">
                            <Link to="/customer-favorites"><FaHeart /> Favorites </Link>
                        </li>
                        <li className="cs-menu-item">
                            <Link to="/customer-settings"><FaCog /> Settings </Link>
                        </li>
                        <li className="cs-menu-item">
                            <Link to="/login"><FaSignOutAlt /> Logout </Link>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="cp-main-content">
                {/* Top Navigation Bar */}
                <div className="cp-top-nav" >
                    <button className="cs-menu-btn" onClick={toggleMenu}>
                            <img src="/images/side_menu.png" alt="Menu Logo" className="cs-menu-logo" /> {/* Add your logo here */}
                    </button>
                    <div className="cp-logo">
                        <img src="/images/logo.png" alt="Quick Crave Logo" className="logo-image" />
                        <h1 className="logo-text">
                            <p1 className="red-text">Quick</p1> <p1 className="yellow-text">Crave</p1>
                        </h1>
                    </div>
                    <div className="bhosda">
                        {/* <Link to="/customer-profile" className="user-avatar" id="userAvatar"> */}
                            {/* <img src={userDetails['img_url')} alt="User Avatar" onError={(e) => { e.target.onerror = null; e.target.src = '/images/user_default.png' }} /> */}
                        {/* </Link> */}
                    </div>
                </div>

                {/* Profile Container */}
                <div className="cp-profile-container">
                    <div className="cp-profile-header">
                        <h1><FaUserCircle /> Customer Profile</h1>
                    </div>
                    
                    <div className="cp-profile-info-container">
                        <div className="cp-profile-photo">
                            <img src={userDetails['img_url']} alt="User Avatar" onError={(e) => { e.target.onerror = null; e.target.src = '/images/user_default.png' }} />
                            <label className="cp-change-photo-btn">
                                <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                                <FaCamera />
                            </label>
                        </div>
                        
                        <div className="cp-profile-details">
                            <div className="cp-profile-field">
                                <span className="cp-profile-field-label">Name</span>
                                <div className="cp-profile-field-value">{userDetails['name']}</div>
                            </div>
                            
                            <div className="cp-profile-field">
                                <span className="cp-profile-field-label">Email</span>
                                <div className="cp-profile-field-value">{userDetails['email']}</div>
                            </div>
                            
                            <div className="cp-profile-field">
                                <span className="cp-profile-field-label">Phone Number</span>
                                <div className="cp-profile-field-value">{userDetails['phone_number']}</div>
                            </div>
                            
                            <div className="cp-profile-field">
                                <span className="cp-profile-field-label">Address</span>
                                <div className="cp-profile-field-value">{userDetails['address']}</div>
                            </div>
                            
                            <div className="cp-profile-actions">
                                <button className="cp-profile-btn cp-edit-profile-btn" onClick={() => showNotification('Edit profile functionality will be implemented soon!', 'info')}>
                                    <FaEdit /> Edit Profile
                                </button>
                                <button className="cp-profile-btn cp-change-password-btn" onClick={() => showNotification('Change password functionality will be implemented soon!', 'info')}>
                                    <FaLock /> Change Password
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Recent Orders Section */}
                <div className="cp-recent-orders">
                    <h2>Recent Orders</h2>
                    
                    <div className="cp-order-stats">
                        <div className="cp-stat-card cp-total-orders">
                            <div className="cp-stat-icon">
                                <FaClipboardList />
                            </div>
                            <div className="cp-stat-number">12</div>
                            <div className="cp-stat-label">Total Orders</div>
                        </div>
                        
                        <div className="cp-stat-card cp-food-delivery">
                            <div className="cp-stat-icon">
                                <FaUtensils />
                            </div>
                            <div className="cp-stat-number">8</div>
                            <div className="cp-stat-label">Food Delivery</div>
                        </div>
                        
                        <div className="cp-stat-card cp-dineout">
                            <div className="cp-stat-icon">
                                <FaHamburger />
                            </div>
                            <div className="cp-stat-number">3</div>
                            <div className="cp-stat-label">Dineout</div>
                        </div>
                        
                        <div className="cp-stat-card cp-reservations">
                            <div className="cp-stat-icon">
                                <FaCalendarCheck />
                            </div>
                            <div className="cp-stat-number">1</div>
                            <div className="cp-stat-label">Reservations</div>
                        </div>
                    </div>
                </div>
                
                {/* Favorite Restaurants Section */}
                <div className="cp-favorite-restaurants">
                    <h2>Favorite Restaurants</h2>
                    <div className="cp-restaurant-list">
                        <p>You haven't added any favorite restaurants yet.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerProfile;