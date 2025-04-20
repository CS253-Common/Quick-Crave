import React, { useState, useEffect, useRef } from 'react'; // Add useRef here
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaBars, FaTimes, FaUser, FaHome, FaHistory, FaHeart, FaCog, FaSignOutAlt, FaUserCircle, FaCamera, FaEdit, FaLock, FaClipboardList, FaUtensils, FaHamburger, FaCalendarCheck } from 'react-icons/fa';
import '../../styles/Customer/customer_profile.css';
import '../../styles/Components/customer_sidemenu.css';
import { FaPlus, FaArrowRight } from 'react-icons/fa';
axios.defaults.withCredentials = true;

const RazorpayButton = ({ onPaymentSuccess, onPaymentFailure }) => {
    const buttonRef = useRef(null);
    const [isRazorpayLoading, setIsRazorpayLoading] = useState(false);

    useEffect(() => {
        // Delay script loading by 5 seconds (5000ms)
        const timeoutId = setTimeout(() => {
            const handlePaymentResponse = (event) => {
                console.log(event);
                if (event.detail && event.detail.status === 'paid') {
                    // Payment was successful
                    onPaymentSuccess(event.detail);
                } else {
                    // Payment failed
                    onPaymentFailure(event.detail || {});
                }
            };

            if (buttonRef.current) {
                const script = document.createElement('script');
                script.src = "https://checkout.razorpay.com/v1/payment-button.js";
                script.async = true;
                script.dataset.payment_button_id = "pl_QEyVU9sw9iwQJg";

                console.log(buttonRef);

                // Set loading handlers
                script.onload = () => setIsRazorpayLoading(false);
                script.onerror = () => setIsRazorpayLoading(false);

                // Add event listeners for Razorpay response
                window.addEventListener('rzp.payment.success', handlePaymentResponse);
                window.addEventListener('rzp.payment.failed', handlePaymentResponse);

                // Remove any previous content (if needed) and attach the script
                buttonRef.current.innerHTML = '';
                buttonRef.current.appendChild(script);

                // Cleanup function
                return () => {
                    if (buttonRef.current?.contains(script)) {
                        buttonRef.current.removeChild(script);
                    }
                    window.removeEventListener('rzp.payment.success', handlePaymentResponse);
                    window.removeEventListener('rzp.payment.failed', handlePaymentResponse);
                };
            }
        }, 5000);

        // Clear the timeout if component is unmounted
        return () => clearTimeout(timeoutId);
    }, [onPaymentSuccess, onPaymentFailure]);

    return isRazorpayLoading ? (
        <div>Loading payment button...</div>
    ) : (
        <form ref={buttonRef} />
    );
};


// const RazorpayButton = ({ onPaymentSuccess, onPaymentFailure }) => {
//     const buttonRef = useRef(null);
//     const [isRazorpayLoading, setIsRazorpayLoading] = useState(false);
  
//     useEffect(() => {

//         // console.log("payment ho rha hai");

//         const handlePaymentResponse = (event) => {
//             console.log(event);
//             if (event.detail && event.detail.status === 'paid') {
//                 // Payment was successful
//                 onPaymentSuccess(event.detail);
//             } else {
//                 // Payment failed
//                 onPaymentFailure(event.detail || {});
//             }
//         };

//         if (buttonRef.current) {

//             const script = document.createElement('script');
//             script.src = "https://checkout.razorpay.com/v1/payment-button.js";
//             script.async = true;
//             script.dataset.payment_button_id = "pl_QEyVU9sw9iwQJg";

//             console.log(buttonRef);

//             // Set loading handlers
//             script.onload = () => setIsRazorpayLoading(false);
//             script.onerror = () => setIsRazorpayLoading(false);

//             // Add event listener for Razorpay response
//             window.addEventListener('rzp.payment.success', handlePaymentResponse);
//             window.addEventListener('rzp.payment.failed', handlePaymentResponse);

//             buttonRef.current.innerHTML = '';
//             buttonRef.current.appendChild(script);
  
//             return () => {
//                 if (buttonRef.current?.contains(script)) {
//                     buttonRef.current.removeChild(script);
//                 }
//                 // Clean up event listeners
//                 window.removeEventListener('rzp.payment.success', handlePaymentResponse);
//                 window.removeEventListener('rzp.payment.failed', handlePaymentResponse);
//             };
//         }
//     }, [onPaymentSuccess, onPaymentFailure]);
  
//     return isRazorpayLoading ? (
//         <div>Loading payment button...</div>
//     ) : (
//         <form ref={buttonRef}/>
//     );
// };

const CustomerProfile = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [profileImage, setProfileImage] = useState('/images/user_default.png');
    const [imageUrl, setImageUrl] = useState("");
    const [uploading, setUploading] = useState(false)
    const [isLoading, setIsLoading] = useState(false);
    const [userDetails, setUserDetails] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [Wallet,setWallet] = useState(0);
    const CLOUD_NAME = "dg08t3wkg"; // Replace with your Cloudinary cloud name
    const UPLOAD_PRESET = "foodimage"; // Replace with your unsigned upload preset
    const BACKEND_API = "/customer-update-profilephoto"; // Backend API to save the image
    const [editForm, setEditForm] = useState({
        name: '',
        email: '',
        phone_number: '',
        address: '',
    });
    const [transactions, setTransactions] = useState([]);
    const handlePaymentSuccess = async (paymentDetails) => {
        try {
            setIsLoading(true);
            // Extract amount from payment details (you may need to adjust this based on actual response structure)
            const amount = paymentDetails.amount / 100; // Convert from paise to rupees
            
            // console.log(amount);

            // Call backend API to update wallet balance
            const response = await axios.post(
                'http://localhost:4000/customer/customer-update-wallet',
                { amount }
            );
            
            console.log(response);

            if (response.data.success) {
                showNotification(`Payment successful! ₹${amount} added to your wallet`, 'success');
                
                // Update local wallet balance
                setWallet(prev => {
                    const newBalance = prev + amount;
                    sessionStorage.setItem('wallet_balance', newBalance.toString());
                    return newBalance;
                });
                
                // Refresh user details
                FetchDetails();
            } else {
                showNotification(response.data.message || 'Wallet update failed', 'error');
            }
        } catch (error) {
            console.error("Error updating wallet:", error);
            showNotification('Error updating wallet balance', 'error');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handlePaymentFailure = (paymentDetails) => {
        console.error("Payment failed:", paymentDetails);
        showNotification('Payment failed. Please try again.', 'error');
    };

    useEffect(() => {
    // Fetch wallet balance from sessionStorage if available
    const storedBalance = sessionStorage.getItem('wallet_balance');
    if (storedBalance) {
        setWallet(parseFloat(storedBalance));
    }

  // Fetch user details
    FetchDetails();
    }, []);

    const handleUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
    
        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET);
    
        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            );
            const data = await response.json();
            
            // Update the profile image
            setImageUrl(data.secure_url);
            setProfileImage(data.secure_url); // Set image for immediate rendering
            sessionStorage.setItem('img_url', data.secure_url);

            
            // Send image URL to backend
            await axios.post("http://localhost:4000/customer/customer-update-profilephoto", {
                img_url : data.secure_url
            });
    
            console.log("Image URL sent to backend:", data.secure_url);
        } catch (error) {
            console.error("Upload failed:", error);
        } finally {
            setUploading(false);
        }
    };
    
    const FetchDetails = async () => {
        try {
            setIsLoading(true);
            console.log("Loading user data..."); 
            const result = await axios.post(
                'http://localhost:4000/customer/customer-view-profile'
            );
            console.log("fetched")
            if (result.data && result.data.success) {
                setUserDetails(result.data.profile);
                setEditForm({
                    name: result.data.profile.name,
                    email: result.data.profile.email,
                    phone_number: result.data.profile.phone_number,
                    address: result.data.profile.address,
                });
                console.log("Data:", result.data.profile);

                const My_balance = result.data.profile.wallet_balance ; 
            
                setWallet(My_balance);
            }
        } catch (error) {
            console.error("Error fetching user details:", error);
        } finally {
            setIsLoading(false);
        }


       //fetching transaction history
        try {
            setIsLoading(true);
            const response = await axios.post(
                'http://localhost:4000/customer/fetch-transactions' 
            );

            // console.log(response.data);
            
            if (response.data.status === "success") {
                // Transform the backend data to match your frontend structure
                const formattedTransactions = response.data.transactions.map(transaction => ({
                    id: transaction.transaction_id,
                    type: transaction.order_id === 0 ? 'Wallet Top-up' : 'Food Order',
                    amount: Math.abs(transaction.amount), // Remove negative sign
                    date: new Date(transaction.time).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                    }),
                    isCredit: transaction.amount > 0 // Positive amount = credit
                }));
                
                setTransactions(formattedTransactions);
            } else {
                showNotification('Failed to load transaction history', 'error');
            }
        } catch (error) {
            console.error("Error fetching transaction history:", error);
            showNotification('Error loading transaction history', 'error');
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {

        // Fetch wallet balance from sessionStorage if available
        const storedBalance = sessionStorage.getItem('wallet_balance');
        if (storedBalance) {
            setWallet(parseFloat(storedBalance));
        }

        FetchDetails();
    }, []);

    // useEffect(()=>{
    //     FetchWallet()
    // })
    
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
        showNotification('Profile photo change functionality will be implemented soon!', 'info');
        return;
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
    
    // Handle edit form changes
    const formatPhoneNumber = (number) => {
        return number.replace(/\D/g, '').slice(-10).trim(); // Remove non-digits & trim spaces
    };
    
    const handleEditChange = (e) => {
        let { name, value } = e.target;
        
        // Trim spaces for all input fields
        // value = value.trim();
        
        // Apply phone number formatting
        if (name === "phone_number") {
            value = formatPhoneNumber(value);
        }
        
        setEditForm(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const response = await axios.post(
                'http://localhost:4000/customer/customer-update-profile',
                editForm
            );
            
            // console.log(response);
            if (response.data.success) {
                // console.log('if me hai');
                showNotification('Profile updated successfully!', 'success');
                setShowEditModal(false);
                FetchDetails(); // Refresh the data
            } else {
                // console.log('else me hai');
                showNotification(response.data.message || 'Failed to update profile', 'error');
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            showNotification('Error updating profile', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddMoney = () => {
        // Implement add money logic
        console.log("Add money clicked");
      };
      
      // Then add these to your buttons:
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const navigate = useNavigate();
    
    // Handle password form changes
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Submit edited profile

    // Submit password change
    const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    // Trim all values
    // const trimmedCurrentPassword = currentPassword.trim();
    // const trimmedNewPassword = newPassword.trim();
    // const trimmedConfirmPassword = confirmPassword.trim();

    // Validate passwords match
    if (newPassword !== confirmPassword) {
        showNotification('New passwords do not match', 'error');
        return;
    }

    // Validate password length & complexity
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
        showNotification('Password must be at least 8 characters long, contain one uppercase letter, one number, and one special character', 'error');
        return;
    }

    // Prevent using the same password again
    if (newPassword === currentPassword) {
        showNotification('New password cannot be the same as the current password', 'error');
        return;
    }

    console.log(newPassword) ; 
    console.log(confirmPassword) ; 

    try {
        setIsLoading(true);
        const response = await axios.post(
            'http://localhost:4000/customer/customer-change-password',
            {
                currentPassword: currentPassword,
                newPassword: newPassword
            }
        );
        console.log(response) ; 
        if (response.data.success) {
            showNotification('Password changed successfully! Logging you out...', 'success');

            // Clear localStorage or sessionStorage
            localStorage.removeItem('token');  // If you store auth token in localStorage
            sessionStorage.clear();  // Clear all session storage data

            // Redirect to login page after 2 seconds
            setTimeout(() => {
                navigate('/login');  
            }, 2000);
        } else {
            showNotification(response.data.message || 'Failed to change password', 'error');
        }
    } catch (error) {
        console.error("Error changing password:", error);
        showNotification('Error changing password', 'error');
    } finally {
        setIsLoading(false);
    }
};


    // Handle logout
    const handleLogout = () => {
        navigate('/login');
    };

    return (
        <div className="cp-home-container">
            
            {/* Edit Profile Modal */}
            {showEditModal && (
                <div className="cp-modal-overlay">
                    <div className="cp-modal">
                        <div className="cp-modal-header">
                            <h2>Edit Profile</h2>
                            <button className="cp-modal-close" onClick={() => setShowEditModal(false)}>
                                <FaTimes />
                            </button>
                        </div>
                        <form onSubmit={handleEditSubmit}>
                            <div className="cp-form-group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={editForm.name}
                                    onChange={handleEditChange}
                                    required
                                />
                            </div>
                            {/* <div className="cp-form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={editForm.email}
                                    onChange={handleEditChange}
                                    required
                                />
                            </div> */}
                            <div className="cp-form-group">
                                <label>Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone_number"
                                    value={editForm.phone_number}
                                    onChange={handleEditChange}
                                    required
                                />
                            </div>
                            <div className="cp-form-group">
                                <label>Address</label>
                                <textarea
                                    name="address"
                                    value={editForm.address}
                                    onChange={handleEditChange}
                                    required
                                />
                            </div>
                            <div className="cp-modal-actions">
                                <button type="button" className="cp-modal-cancel" onClick={() => setShowEditModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="cp-modal-submit" disabled={isLoading}>
                                    {isLoading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Change Password Modal */}
            {showPasswordModal && (
                <div className="cp-modal-overlay">
                    <div className="cp-modal">
                        <div className="cp-modal-header">
                            <h2>Change Password</h2>
                            <button className="cp-modal-close" onClick={() => setShowPasswordModal(false)}>
                                <FaTimes />
                            </button>
                        </div>
                        <form onSubmit={handlePasswordSubmit}>
                            <div className="cp-form-group">
                                <label>Current Password</label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={passwordForm.currentPassword}
                                    onChange={handlePasswordChange}
                                    required
                                />
                            </div>
                            <div className="cp-form-group">
                                <label>New Password</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={passwordForm.newPassword}
                                    onChange={handlePasswordChange}
                                    required
                                />
                            </div>
                            <div className="cp-form-group">
                                <label>Confirm New Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordForm.confirmPassword}
                                    onChange={handlePasswordChange}
                                    required
                                />
                            </div>
                            <div className="cp-modal-actions">
                                <button type="button" className="cp-modal-cancel" onClick={() => setShowPasswordModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="cp-modal-submit" disabled={isLoading}>
                                    {isLoading ? 'Updating...' : 'Update Password'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Rest of your existing code remains exactly the same */}
            {isMenuOpen && <div className="cp-side-menu-overlay" onClick={closeMenu}></div>}
            
            <div className={`cs-side-menu ${isMenuOpen ? 'active' : ''}`}>
                <div className="cs-side-menu-header">
                    <button className="cs-close-menu-btn" onClick={toggleMenu}>
                        <FaTimes />
                    </button>
                    <div className="cs-menu-user-info">
                        <div className="cs-menu-user-avatar">
                        <img 
                            src={imageUrl || sessionStorage.getItem('img_url') || '/images/user_default.png'} 
                            alt="User Avatar" 
                            onError={(e) => { e.target.onerror = null; e.target.src = '/images/user_default.png' }} 
                        />

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
                <div className="cp-top-nav" >
                    <button className="cs-menu-btn" onClick={toggleMenu}>
                            <img src="/images/side_menu.png" alt="Menu Logo" className="cs-menu-logo" />
                    </button>
                    <Link to="/customer-home" className="logo-link">
              <div className="logo-container">
                  <img src="/images/logo.png" alt="Quick Crave Logo" className="logo-image" />
                  <h1 className="logo-text">
                      <span className="red-text">Quick</span> <span className="yellow-text">Crave</span>
                  </h1>
              </div>
            </Link>
                    <div className="bhosda">
                    </div>
                </div>


                <div className="cp-profile-container">
                    <div className="cp-profile-header">
                        <h1><FaUserCircle /> Customer Profile</h1>
                    </div>
                    
                    <div className="cp-profile-info-container">
                    <div className="cp-profile-photo">
                        <div className="cp-profile-image-container">
                            <img 
                                src={sessionStorage.getItem('img_url')} 
                                alt="User Avatar" 
                                onError={(e) => { e.target.onerror = null; e.target.src = '/images/user_default.png' }} 
                            />
                            <label className="cp-change-photo-btn">
                                <input 
                                    type="file" 
                                    onChange={handleUpload} 
                                    accept="image/*" 
                                    style={{ display: 'none' }}
                                />
                                {uploading ? (
                                    <div className="cp-uploading-overlay">
                                        <p>Uploading...</p>
                                    </div>
                                ) : (
                                    <FaCamera className="cp-camera-icon" />
                                )}
                                {/* <p>Image API Link: <a href={imageUrl} target="_blank" rel="noopener noreferrer">{imageUrl}</a></p> */}
                            </label>
                        </div>
                    </div>
                        
                        <div className="cp-profile-details">
                            <div className="cp-profile-field">
                                <span className="cp-profile-field-label">Name</span>
                                <div className="cp-profile-field-value">{userDetails['name']}</div>
                            </div>
                            <div className="cp-profile-field">
                                <span className="cp-profile-field-label">Username</span>
                                <div className="cp-profile-field-value">{userDetails['username']}</div>
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
                                <button 
                                    className="cp-profile-btn cp-edit-profile-btn" 
                                    onClick={() => setShowEditModal(true)}
                                >
                                    <FaEdit /> Edit Profile
                                </button>
                                <button 
                                    className="cp-profile-btn cp-change-password-btn" 
                                    onClick={() => setShowPasswordModal(true)}
                                >
                                    <FaLock /> Change Password
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="wallet-section">
                    <div className="wallet-balance">
                        <h3>Wallet Balance</h3>
                        <p className="balance-amount">₹{Wallet}</p>
                        <p className="balance-status">Available</p>
                    </div>
                    {/* // Usage in your component */}
                    <div className="wallet-actions">
                        {/* <div className="wallet-action-btn add-money">
                            <RazorpayButton />
                        </div> */}
                        <div className="wallet-action-btn add-money">
                            <RazorpayButton 
                                onPaymentSuccess={handlePaymentSuccess}
                                onPaymentFailure={handlePaymentFailure}
                            />
                        </div>
                    </div>
                </div>

                {/* <form><script src="https://checkout.razorpay.com/v1/payment-button.js" data-payment_button_id="pl_QEyVU9sw9iwQJg" async> </script> </form> */}
                <div className="transaction-history-section">
                    <h3>Transaction History</h3>
                    <div className="transaction-list">
                        {transactions.map((transaction) => (
                            <div key={transaction.id} className="transaction-item">
                                <div className="transaction-details">
                                    <span className="transaction-type">{transaction.type}</span>
                                    <span className="transaction-date">{transaction.date}</span>
                                </div>
                                <div className={`transaction-amount ${transaction.isCredit ? 'transaction-credit' : 'transaction-debit'}`}>
                                    {transaction.isCredit ? '+' : '-'} ₹{transaction.amount}
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="view-all-transactions">View All Transactions</button>
                </div>

                <div className="cp-recent-orders">
                    <h2>Recent Orders</h2>
                    
                    <div className="cp-order-stats">
                        <div className="cp-stat-card cp-total-orders">
                            <div className="cp-stat-icon">
                                <FaClipboardList />
                            </div>
                            <div className="cp-stat-number">{userDetails['total_orders']}</div>
                            <div className="cp-stat-label">Total Orders</div>
                        </div>
                        
                        <div className="cp-stat-card cp-food-delivery">
                            <div className="cp-stat-icon">
                                <FaUtensils />
                            </div>
                            <div className="cp-stat-number">{userDetails['food_delivery']}</div>
                            <div className="cp-stat-label">Food Delivery</div>
                        </div>
                        
                        <div className="cp-stat-card cp-dineout">
                            <div className="cp-stat-icon">
                                <FaHamburger />
                            </div>
                            <div className="cp-stat-number">{userDetails['dineout']}</div>
                            <div className="cp-stat-label">Dineout</div>
                        </div>
                        
                        <div className="cp-stat-card cp-reservations">
                            <div className="cp-stat-icon">
                                <FaCalendarCheck />
                            </div>
                            <div className="cp-stat-number">{userDetails['total_reservations']}</div>
                            <div className="cp-stat-label">Reservations</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerProfile;