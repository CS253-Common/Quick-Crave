// import React, { useState } from 'react';
// import { FaTrash } from 'react-icons/fa';
// import '../../styles/Canteen/discount_management.css';

// const DiscountManagement = () => {
//     // State variables for form inputs
//     const [discountType, setDiscountType] = useState('percentage');
//     const [menuItems, setMenuItems] = useState('');
//     const [discountValue, setDiscountValue] = useState('');
//     const [validUntil, setValidUntil] = useState('');
    
//     // Coupon form states
//     const [couponCode, setCouponCode] = useState('');
//     const [couponValue, setCouponValue] = useState('');
//     const [minOrderValue, setMinOrderValue] = useState('');
//     const [usageLimit, setUsageLimit] = useState('');
//     const [couponValidUntil, setCouponValidUntil] = useState('');
    
//     // Handler for creating discount
//     const handleCreateDiscount = (e) => {
//         e.preventDefault();
//         // Implementation would handle discount creation
//         console.log('Creating discount...');
//     };
    
//     // Handler for creating coupon
//     const handleCreateCoupon = (e) => {
//         e.preventDefault();
//         // Implementation would handle coupon creation
//         console.log('Creating coupon...');
//     };
    
//     // Handler for generating random coupon code
//     const generateRandomCode = () => {
//         const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
//         let code = '';
//         for (let i = 0; i < 8; i++) {
//             code += chars.charAt(Math.floor(Math.random() * chars.length));
//         }
//         setCouponCode(code);
//     };

//     return (
//         <div className="discount-management-container">
//             {/* Header */}
//             <header className="discount-header">
//                 <div className="logo-container">
//                     <img src="/images/logo.png" alt="Quick Crave Logo" className="logo-image" />
//                     <h1 className="logo-text">
//                         <span className="red-text">Quick</span> <span className="crave-text">Crave</span>
//                     </h1>
//                 </div>
//                 <div className="user-info">
//                     <div className="notification-icon">
//                         <span className="notification-count">2</span>
//                     </div>
//                     <div className="user-profile">Manager</div>
//                 </div>
//             </header>

//             {/* Page Title */}
//             <div className="page-title">
//                 <h2>Discount & Coupon Management</h2>
//                 <p className="subtitle">Create and manage discounts and coupons for your menu items</p>
//             </div>

//             {/* Stats Cards */}
//             <div className="stats-container">
//                 <div className="stat-card">
//                     <div className="stat-info">
//                         <h3>Active Discounts</h3>
//                         <span className="stat-value">12</span>
//                     </div>
//                     <div className="stat-icon discount-icon"></div>
//                 </div>
//                 <div className="stat-card">
//                     <div className="stat-info">
//                         <h3>Active Coupons</h3>
//                         <span className="stat-value">8</span>
//                     </div>
//                     <div className="stat-icon coupon-icon"></div>
//                 </div>
//                 <div className="stat-card">
//                     <div className="stat-info">
//                         <h3>Total Savings Given</h3>
//                         <span className="stat-value">$12,450</span>
//                     </div>
//                     <div className="stat-icon savings-icon"></div>
//                 </div>
//             </div>

//             {/* Main Content */}
//             <div className="discount-content">
//                 {/* Create New Discount Section */}
//                 <div className="form-section">
//                     <h3>Create New Discount</h3>
//                     <form onSubmit={handleCreateDiscount}>
//                         <div className="form-group">
//                             <label>Select Items</label>
//                             <div className="select-wrapper">
//                                 <select 
//                                     value={menuItems} 
//                                     onChange={(e) => setMenuItems(e.target.value)}
//                                 >
//                                     <option value="">Select menu items</option>
//                                     <option value="burger">Burger</option>
//                                     <option value="pizza">Pizza</option>
//                                     <option value="pasta">Pasta</option>
//                                 </select>
//                             </div>
//                         </div>
                        
//                         <div className="form-group">
//                             <label>Discount Type</label>
//                             <div className="radio-group">
//                                 <label className={`radio-label ${discountType === 'percentage' ? 'selected' : ''}`}>
//                                     <input 
//                                         type="radio" 
//                                         name="discountType" 
//                                         value="percentage" 
//                                         checked={discountType === 'percentage'} 
//                                         onChange={() => setDiscountType('percentage')}
//                                     />
//                                     Percentage
//                                 </label>
//                                 <label className={`radio-label ${discountType === 'fixed' ? 'selected' : ''}`}>
//                                     <input 
//                                         type="radio" 
//                                         name="discountType" 
//                                         value="fixed" 
//                                         checked={discountType === 'fixed'} 
//                                         onChange={() => setDiscountType('fixed')} 
//                                     />
//                                     Fixed Amount
//                                 </label>
//                             </div>
//                         </div>
                        
//                         <div className="form-group">
//                             <label>Discount Value</label>
//                             <input 
//                                 type="text" 
//                                 placeholder="Enter value" 
//                                 value={discountValue} 
//                                 onChange={(e) => setDiscountValue(e.target.value)} 
//                             />
//                         </div>
                        
//                         <div className="form-group">
//                             <label>Valid until</label>
//                             <input 
//                                 type="date" 
//                                 value={validUntil} 
//                                 onChange={(e) => setValidUntil(e.target.value)} 
//                             />
//                         </div>
                        
//                         <button type="submit" className="btn-create-discount">Create Discount</button>
//                     </form>
//                 </div>

//                 {/* Create New Coupon Section */}
//                 <div className="form-section">
//                     <h3>Create New Coupon</h3>
//                     <form onSubmit={handleCreateCoupon}>
//                         <div className="form-group">
//                             <label>Coupon Code</label>
//                             <div className="code-input-group">
//                                 <input 
//                                     type="text" 
//                                     placeholder="Enter code" 
//                                     value={couponCode} 
//                                     onChange={(e) => setCouponCode(e.target.value)} 
//                                 />
//                                 <button 
//                                     type="button" 
//                                     className="btn-generate" 
//                                     onClick={generateRandomCode}
//                                 >
//                                     Generate
//                                 </button>
//                             </div>
//                         </div>
                        
//                         <div className="form-group">
//                             <label>Discount Value</label>
//                             <input 
//                                 type="text" 
//                                 placeholder="Enter value" 
//                                 value={couponValue} 
//                                 onChange={(e) => setCouponValue(e.target.value)} 
//                             />
//                         </div>
                        
//                         <div className="form-group">
//                             <label>Minimum Order Value</label>
//                             <input 
//                                 type="text" 
//                                 placeholder="Enter minimum value" 
//                                 value={minOrderValue} 
//                                 onChange={(e) => setMinOrderValue(e.target.value)} 
//                             />
//                         </div>
                        
//                         <div className="form-group">
//                             <label>Usage Limit</label>
//                             <input 
//                                 type="text" 
//                                 placeholder="Enter limit" 
//                                 value={usageLimit} 
//                                 onChange={(e) => setUsageLimit(e.target.value)} 
//                             />
//                         </div>
                        
//                         <div className="form-group">
//                             <label>Valid until</label>
//                             <input 
//                                 type="date" 
//                                 value={couponValidUntil} 
//                                 onChange={(e) => setCouponValidUntil(e.target.value)} 
//                             />
//                         </div>
                        
//                         <button type="submit" className="btn-create-coupon">Create Coupon</button>
//                     </form>
//                 </div>
//             </div>

//             {/* Active Discounts and Coupons Sections */}
//             <div className="active-items-container">
//                 {/* Active Discounts */}
//                 <div className="active-section">
//                     <h3>Active Discounts</h3>
//                     <div className="active-items">
//                         <div className="active-item">
//                             <div className="item-details">
//                                 <h4>Burger Combo</h4>
//                                 <p>20% off</p>
//                                 <p className="valid-date">Valid till Mar 25, 2025</p>
//                             </div>
//                             <button className="btn-delete"><FaTrash /></button>
//                         </div>
                        
//                         <div className="active-item">
//                             <div className="item-details">
//                                 <h4>Pizza Special</h4>
//                                 <p>$5.00 off</p>
//                                 <p className="valid-date">Valid till Mar 25, 2025</p>
//                             </div>
//                             <button className="btn-delete"><FaTrash /></button>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Active Coupons */}
//                 <div className="active-section">
//                     <h3>Active Coupons</h3>
//                     <div className="active-items">
//                         <div className="active-item">
//                             <div className="item-details">
//                                 <h4>WELCOME50</h4>
//                                 <p>50% off up to $50</p>
//                                 <p className="valid-date">Min order: $100 | Uses left: 45</p>
//                             </div>
//                             <button className="btn-delete"><FaTrash /></button>
//                         </div>
                        
//                         <div className="active-item">
//                             <div className="item-details">
//                                 <h4>SPECIAL25</h4>
//                                 <p>25% off up to $75</p>
//                                 <p className="valid-date">Min order: $200 | Uses left: 35</p>
//                             </div>
//                             <button className="btn-delete"><FaTrash /></button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default DiscountManagement; 