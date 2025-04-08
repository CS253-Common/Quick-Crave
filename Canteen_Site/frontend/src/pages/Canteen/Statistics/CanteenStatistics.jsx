import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaChartBar, FaUtensils, FaShoppingCart, FaUsers, FaTimes, FaSignOutAlt, FaCog, FaBars } from 'react-icons/fa';
import '../../../styles/Canteen/Statistics/canteen_statistics.css';
import canteenService from '../../../services/canteenService';


const CanteenStatistics = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeTimeFrame, setActiveTimeFrame] = useState('weekly');
    const [chartData, setChartData] = useState([]);
    
    // User data state for sidebar
    const [userData, setUserData] = useState({
        name: sessionStorage.getItem('name') || 'Canteen Manager',
        email: sessionStorage.getItem('email') || 'manager@quickcrave.com'
    });

    // Active time frame state for order analytics
    const [activeOrderTimeFrame, setActiveOrderTimeFrame] = useState('weekly');
    const [orderChartData, setOrderChartData] = useState([]);

    // Loading and error states for API data
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Separate loading states for different data sections
    const [cardsLoading, setCardsLoading] = useState(true);
    const [graphsLoading, setGraphsLoading] = useState(true);
    const [popularItemsLoading, setPopularItemsLoading] = useState(true);
    const [recentOrdersLoading, setRecentOrdersLoading] = useState(true);

    // Statistics data for cards
    const [statisticsData, setStatisticsData] = useState({
        totalSales: '₹0',
        totalSalesGrowth: '₹0 from last month',
        totalOrders: 0,
        totalOrdersGrowth: '0 from last month',
        avgOrderValue: '₹0',
        avgOrderGrowth: '₹0 from last month',
        totalCustomers: 0,
        totalCustomersGrowth: '0 from last month',
    });

    // Popular items and recent orders state
    const [popularItems, setPopularItems] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);

    // Graph data for analytics
    const [graphData, setGraphData] = useState({
        monthly: {
            sales: [],
            orders: []
        },
        yearly: {
            sales: [],
            orders: []
        }
    });

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Fetch cards and graphs data
    useEffect(() => {
        const fetchCardAndGraphData = async () => {
            setCardsLoading(true);
            setGraphsLoading(true);

            try {
                // Fetch statistics data for cards
                const statsData = await canteenService.getStatisticsData();
                if (statsData) {
                    setStatisticsData({
                        totalSales: `₹${statsData.curr_month.total_sales.toLocaleString()}`,
                        totalSalesGrowth: `+₹${statsData.delta.sales.toLocaleString()} from last month`,
                        totalOrders: statsData.curr_month.total_orders,
                        totalOrdersGrowth: `+${statsData.delta.orders} from last month`,
                        avgOrderValue: `₹${statsData.curr_month.avg_order_value.toFixed(2)}`,
                        avgOrderGrowth: `+₹${statsData.delta.avg_order_value.toFixed(2)} from last month`,
                        totalCustomers: statsData.curr_month.total_customers,
                        totalCustomersGrowth: `+${statsData.delta.customers} from last month`,
                    });
                    setCardsLoading(false);
                }

                // Fetch graph data for analytics
                const graphs = await canteenService.getGraphsData();
                
                // Process the graph data according to actual backend format
                if (graphs) {
                    // Convert the single monthly and yearly objects to arrays if needed
                    const monthlyData = Array.isArray(graphs.monthly) ? graphs.monthly : [graphs.monthly];
                    const yearlyData = Array.isArray(graphs.yearly) ? graphs.yearly : [graphs.yearly];
                    
                    // Format data for setting to state
                    setGraphData({
                        monthly: {
                            sales: monthlyData.map(item => ({
                                date: item.order_date,
                                day: new Date(item.order_date).getDate(),
                                amount: parseFloat(item.total_sales || 0)
                            })),
                            orders: monthlyData.map(item => ({
                                date: item.order_date,
                                day: new Date(item.order_date).getDate(),
                                count: parseInt(item.total_orders || 0)
                            }))
                        },
                        yearly: {
                            sales: yearlyData.map(item => {
                                // Handle month data - could be month_num (1-12) or a date
                                let monthName;
                                if (item.month_num) {
                                    // Month is 1-indexed in the database
                                    const monthIndex = (parseInt(item.month_num) - 1) % 12;
                                    monthName = new Date(2025, monthIndex, 1).toLocaleString('default', { month: 'short' });
                                } else if (item.order_date) {
                                    monthName = new Date(item.order_date).toLocaleString('default', { month: 'short' });
                                } else {
                                    monthName = '';
                                }
                                
                                return {
                                    month: monthName,
                                    amount: parseFloat(item.total_sales || 0)
                                };
                            }),
                            orders: yearlyData.map(item => {
                                // Handle month data - could be month_num (1-12) or a date
                                let monthName;
                                if (item.month_num) {
                                    // Month is 1-indexed in the database
                                    const monthIndex = (parseInt(item.month_num) - 1) % 12;
                                    monthName = new Date(2025, monthIndex, 1).toLocaleString('default', { month: 'short' });
                                } else if (item.order_date) {
                                    monthName = new Date(item.order_date).toLocaleString('default', { month: 'short' });
                                } else {
                                    monthName = '';
                                }
                                
                                return {
                                    month: monthName,
                                    count: parseInt(item.total_orders || 0)
                                };
                            })
                        }
                    });
                    
                    console.log("Processed graph data:", {
                        monthly: monthlyData,
                        yearly: yearlyData
                    });
                    
                    setGraphsLoading(false);
                }

                setError(null); // Clear any errors
            } catch (err) {
                console.error('Error fetching statistics data:', err);
                // setError('Failed to fetch main statistics data. Using sample data instead.');
                const sampleStats = {
                    totalSales: '₹50,000', // you might generate these dynamically if needed
                    totalSalesGrowth: '+₹5,000 from last month',
                    totalOrders: 250,
                    totalOrdersGrowth: '+15 from last month',
                    avgOrderValue: '₹200',
                    avgOrderGrowth: '+₹10 from last month',
                    totalCustomers: 150,
                    totalCustomersGrowth: '+20 from last month',
                };
                
                setStatisticsData(sampleStats);
                // Use sampleData as fallback
                const sampleMonthly = [];
                const sampleYearly = [];
                
                // Generate sample data
                const today = new Date();
                for (let i = 29; i >= 0; i--) {
                    const date = new Date(today);
                    date.setDate(date.getDate() - i);
                    
                    sampleMonthly.push({
                        order_date: date.toISOString(),
                        total_sales: Math.floor(Math.random() * 1500) + 1000,
                        total_orders: Math.floor(Math.random() * 40) + 20
                    });
                }
                
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                for (let i = 0; i < 12; i++) {
                    sampleYearly.push({
                        month_num: i + 1,
                        total_sales: Math.floor(Math.random() * 40000) + 30000,
                        total_orders: Math.floor(Math.random() * 1000) + 800
                    });
                }
                
                // Set sample data to state
                setGraphData({
                    monthly: {
                        sales: sampleMonthly.map(item => ({
                            date: item.order_date,
                            day: new Date(item.order_date).getDate(),
                            amount: item.total_sales
                        })),
                        orders: sampleMonthly.map(item => ({
                            date: item.order_date,
                            day: new Date(item.order_date).getDate(),
                            count: item.total_orders
                        }))
                    },
                    yearly: {
                        sales: sampleYearly.map(item => ({
                            month: months[item.month_num - 1],
                            amount: item.total_sales
                        })),
                        orders: sampleYearly.map(item => ({
                            month: months[item.month_num - 1],
                            count: item.total_orders
                        }))
                    }
                });
                setError(null);
            } finally {
                setCardsLoading(false);
                setGraphsLoading(false);
            }
        };

        fetchCardAndGraphData();
    }, []);

    // Fetch popular items using trending picks API
    useEffect(() => {
        const fetchPopularItems = async () => {
            setPopularItemsLoading(true);
            try {
                const trendingData = await canteenService.getTrendingPicks();
                if (trendingData && trendingData.items) {
                    setPopularItems(trendingData.items);
                }
                else{
                    console.warn('No trending items found in the response');
                    setPopularItems([
                        { dish_id: 1, dish_name: 'Tandoori Chicken', img_url: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80', total_quantity: 45 },
                        { dish_id: 2, dish_name: 'French Fries', img_url: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80', total_quantity: 38 },
                        { dish_id: 3, dish_name: 'Burger', img_url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80', total_quantity: 32 },
                        { dish_id: 4, dish_name: 'Peanut Butter Sandwich', img_url: 'https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80', total_quantity: 30 },
                        { dish_id: 5, dish_name: 'Biryani', img_url: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80', total_quantity: 28 }
                    ]);
                }
            } catch (err) {
                console.error('Error fetching popular items:', err);
                setPopularItems([
                    { dish_id: 1, dish_name: 'Tandoori Chicken', img_url: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80', total_quantity: 45 },
                    { dish_id: 2, dish_name: 'French Fries', img_url: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80', total_quantity: 38 },
                    { dish_id: 3, dish_name: 'Burger', img_url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80', total_quantity: 32 },
                    { dish_id: 4, dish_name: 'Peanut Butter Sandwich', img_url: 'https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80', total_quantity: 30 },
                    { dish_id: 5, dish_name: 'Biryani', img_url: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80', total_quantity: 28 }
                ]);
            } finally {
                setPopularItemsLoading(false);
            }
        };

        fetchPopularItems();
    }, []);

    // Fetch recent orders from order queue API
    useEffect(() => {
        const fetchRecentOrders = async () => {
            setRecentOrdersLoading(true);
            try {
                const orderQueueData = await canteenService.getOrderQueue();
                if (orderQueueData && Array.isArray(orderQueueData)) {
                    // Sort orders by date (newest first) and take the top 5
                    const sortedOrders = [...orderQueueData].sort((a, b) => {
                        return new Date(b.created_at) - new Date(a.created_at);
                    }).slice(0, 5);
                    
                    setRecentOrders(sortedOrders);
                }
            } catch (err) {
                console.error('Error fetching recent orders:', err);
            } finally {
                setRecentOrdersLoading(false);
            }
        };

        fetchRecentOrders();

        const intervalId = setInterval(fetchRecentOrders, 30000);

        // Cleanup the interval on unmount.
        return () => clearInterval(intervalId);

    }, []);

    // Process graph data when activeTimeFrame changes
    useEffect(() => {
        if (graphData) {
            const monthlySales = graphData?.monthly?.sales || [];
            const yearlySales = graphData?.yearly?.sales || [];

            if (activeTimeFrame === 'weekly') {
                const last7Days = monthlySales.slice(-7);
                setChartData(formatWeeklyData(last7Days, 'sales'));
            } else if (activeTimeFrame === 'monthly') {
                const formattedData = monthlySales.map(item => ({
                    day: item.day?.toString() || '',
                    date: `${item.day || ''} ${new Date(item.date || Date.now()).toLocaleString('default', { month: 'short' })}`,
                    sales: item.amount || 0,
                }));
                setChartData(formattedData);
            } else if (activeTimeFrame === 'yearly') {
                const formattedData = yearlySales.map(item => ({
                    month: item.month || '',
                    day: item.month || '',
                    date: item.month || '',
                    sales: item.amount || 0,
                }));
                setChartData(formattedData);
            }
        }
    }, [activeTimeFrame, graphData]);

    // Process graph data when activeOrderTimeFrame changes
    useEffect(() => {
        if (graphData) {
            const monthlyOrders = graphData?.monthly?.orders || [];
            const yearlyOrders = graphData?.yearly?.orders || [];

            if (activeOrderTimeFrame === 'weekly') {
                const last7Days = monthlyOrders.slice(-7);
                setOrderChartData(formatWeeklyData(last7Days, 'orders'));
            } else if (activeOrderTimeFrame === 'monthly') {
                const formattedData = monthlyOrders.map(item => ({
                    day: item.day?.toString() || '',
                    date: `${item.day || ''} ${new Date(item.date || Date.now()).toLocaleString('default', { month: 'short' })}`,
                    orders: item.count || 0,
                }));
                setOrderChartData(formattedData);
            } else if (activeOrderTimeFrame === 'yearly') {
                const formattedData = yearlyOrders.map(item => ({
                    month: item.month || '',
                    day: item.month || '',
                    date: item.month || '',
                    orders: item.count || 0,
                }));
                setOrderChartData(formattedData);
            }
        }
    }, [activeOrderTimeFrame, graphData]);

    // Helper function to format weekly data from API response
    const formatWeeklyData = (data, type) => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        return data.map(item => {
            const date = new Date(item.date);
            const dayName = days[date.getDay()];
            
            if (type === 'sales') {
                return {
                    day: dayName,
                    date: `${dayName}\n${date.getDate()}/${date.getMonth() + 1}`,
                    sales: item.amount
                };
            } else {
                return {
                    day: dayName,
                    date: `${dayName}\n${date.getDate()}/${date.getMonth() + 1}`,
                    orders: item.count
                };
            }
        });
    };

    // Helper function to get status text based on status number
    const getStatusText = (status) => {
        const statusMap = {
            0: 'Rejected',
            1: 'Pending',
            2: 'Waiting',
            3: 'Cooking',
            4: 'Ready'
        };
        return statusMap[status] || 'Unknown';
    };

    // Render the chart based on active timeframe
    const renderChart = () => {
        if (graphsLoading) {
            return <div className="loading-indicator">Loading chart data...</div>;
        }
        
        if (error || !chartData || chartData.length === 0) {
            return <div className="error-message">Unable to load chart data</div>;
        }
        
        const maxValue = Math.max(...chartData.map(item => item.sales || 0));
        const barMaxHeight = 180; // Maximum bar height in pixels
        
        return (
            <div className="chart">
                <div className="chart-bars">
                    {chartData.map((item, index) => {
                        const barHeight = ((item.sales || 0) / maxValue) * barMaxHeight;
                        return (
                            <div className="chart-bar-container" key={index}>
                                <div className="chart-bar-tooltip">₹{(item.sales || 0).toLocaleString()}</div>
                                <div 
                                    className="chart-bar" 
                                    style={{ 
                                        '--full-height': `${barHeight}px`,
                                        height: `${barHeight}px`,
                                        backgroundColor: index % 2 === 0 ? 
                                            `rgba(229, 57, 53, ${0.7 + ((item.sales || 0) / maxValue) * 0.3})` : 
                                            `rgba(229, 57, 53, ${0.5 + ((item.sales || 0) / maxValue) * 0.5})`
                                    }}
                                ></div>
                                <div className="chart-bar-label">
                                    {activeTimeFrame === 'weekly' ? (item.date ? item.date.split('\n')[0] : item.day) : 
                                     activeTimeFrame === 'monthly' ? item.day :
                                     item.month}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    // Render the order chart based on active timeframe
    const renderOrderChart = () => {
        if (graphsLoading) {
            return <div className="loading-indicator">Loading chart data...</div>;
        }
        
        if (error || !orderChartData || orderChartData.length === 0) {
            return <div className="error-message">Unable to load chart data</div>;
        }
        
        const maxValue = Math.max(...orderChartData.map(item => item.orders || 0));
        const barMaxHeight = 180; // Maximum bar height in pixels
        
        return (
            <div className="chart">
                <div className="chart-bars">
                    {orderChartData.map((item, index) => {
                        const barHeight = ((item.orders || 0) / maxValue) * barMaxHeight;
                        return (
                            <div className="chart-bar-container" key={index}>
                                <div className="chart-bar-tooltip">{(item.orders || 0)} orders</div>
                                <div 
                                    className="chart-bar" 
                                    style={{ 
                                        '--full-height': `${barHeight}px`,
                                        height: `${barHeight}px`,
                                        backgroundColor: index % 2 === 0 ? 
                                            `rgba(25, 118, 210, ${0.7 + ((item.orders || 0) / maxValue) * 0.3})` : 
                                            `rgba(25, 118, 210, ${0.5 + ((item.orders || 0) / maxValue) * 0.5})`
                                    }}
                                ></div>
                                <div className="chart-bar-label">
                                    {activeOrderTimeFrame === 'weekly' ? (item.date ? item.date.split('\n')[0] : item.day) : 
                                     activeOrderTimeFrame === 'monthly' ? item.day :
                                     item.month}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="statistics-container">
            {/* Side Menu Overlay */}
            <div 
                className={`cm-side-menu-overlay ${isMenuOpen ? 'active' : ''}`} 
                onClick={toggleMenu}
            ></div>

            {/* Side Menu */}
            <div className={`cm-side-menu ${isMenuOpen ? 'active' : ''}`}>
                <div className="cm-side-menu-header">
                    <button className="cm-close-menu-btn" onClick={toggleMenu}>
                        <i className="fas fa-times"></i>
                    </button>
                    <div className="cm-menu-user-info">
                        <Link to="/canteen-manager-profile" className="cm-menu-user-avatar-link">
                            <div className="cm-menu-user-avatar">
                                <img src="/images/business_avatar.png" alt="Business Avatar" onError={(e) => { e.target.src = '/images/user_default.png' }} />
                            </div>
                        </Link>
                        <div className="cm-menu-user-details">
                            <h3 className="cm-menu-user-name">{userData.name}</h3>
                            <p className="cm-menu-user-email">{userData.email}</p>
                        </div>
                    </div>
                </div>
                <div className="cm-side-menu-content">
                    <ul className="cm-menu-items">
                        <li className="cm-menu-item">
                            <Link to="/canteen-manager-home"><i className="fas fa-home"></i> Dashboard</Link>
                        </li>
                        <li className="cm-menu-item">
                            <Link to="/canteen-manager-profile"><i className="fas fa-user"></i> Profile</Link>
                        </li>
                        <li className="cm-menu-item">
                            <Link to="/canteen-menu-management"><i className="fas fa-utensils"></i> Menu Management</Link>
                        </li>
                        <li className="cm-menu-item">
                            <Link to="/manage-orders"><i className="fas fa-clipboard-list"></i> Order Queue</Link>
                        </li>
                        <li className="cm-menu-item">
                            <Link to="/manage-discounts"><i className="fas fa-tags"></i> Discounts</Link>
                        </li>
                        <li className="cm-menu-item">
                            <Link to="/manage-reservations"><i className="fas fa-calendar-alt"></i> Reservations</Link>
                        </li>
                        <li className="cm-menu-item active">
                            <Link to="/canteen-statistics"><i className="fas fa-chart-line"></i> Statistics</Link>
                        </li>
                        <li className="cm-menu-item">
                            <Link to="/login"><i className="fas fa-sign-out-alt"></i> Logout</Link>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Main Content */}
            <div className="statistics-main-content">
                {/* Header */}
                <header className="statistics-header">
                    <div className="left-section">
                        <button className="menu-toggle-btn" onClick={toggleMenu}>
                            <img src="/images/side_menu.png" alt="Menu Logo" className="menu-logo" />
                        </button>
                        <div className="logo-container">
                            <Link to="/canteen-manager-home" className="logo-link">
                                <img src="/images/logo.png" alt="Quick Crave Logo" className="logo-image" />
                                <div className="logo-text">
                                    <span className="red-text">Quick</span> 
                                    <span className="yellow-text">Crave</span>
                                </div>
                            </Link>
                        </div>
                    </div>
                    <div className="user-profile">
                        <Link to="/canteen-manager-profile" className="user-avatar-link">
                        <img 
                                src="/images/business_avatar.png" 
                                alt={userData.name} 
                            className="profile-image"
                            onError={(e) => { e.target.src = '/images/user_default.png' }} 
                        />
                            <span className="user-name">{userData.name}</span>
                        </Link>
                        <div className="notification-bell">
                            <span className="notification-indicator"></span>
                        </div>
                    </div>
                </header>

                {/* Statistics Content */}
                <div className="statistics-content">
                    {/* Stats Cards */}
                    <div className="stats-cards">
                        {cardsLoading ? (
                            <div className="loading-container">
                                <div className="loading-spinner"></div>
                                <p>Loading statistics...</p>
                            </div>
                        ) : error ? (
                            <div className="error-container">
                                <p className="error-message">{error}</p>
                                <button onClick={() => window.location.reload()} className="retry-button">
                                    Retry
                                </button>
                            </div>
                        ) : (
                            <>
                        <div className="stat-card">
                            <div className="stat-header">
                                <h3>Total Sales</h3>
                                        <div className="icon money-icon">₹</div>
                            </div>
                            <div className="stat-value">{statisticsData.totalSales}</div>
                            <div className="stat-growth positive">
                                <span className="arrow">↑</span> {statisticsData.totalSalesGrowth}
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-header">
                                <h3>Total Orders</h3>
                                <div className="icon orders-icon">⊙</div>
                            </div>
                            <div className="stat-value">{statisticsData.totalOrders}</div>
                            <div className="stat-growth positive">
                                <span className="arrow">↑</span> {statisticsData.totalOrdersGrowth}
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-header">
                                <h3>Avg. Order Value</h3>
                                <div className="icon avg-icon">⌀</div>
                            </div>
                            <div className="stat-value">{statisticsData.avgOrderValue}</div>
                            <div className="stat-growth positive">
                                <span className="arrow">↑</span> {statisticsData.avgOrderGrowth}
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-header">
                                <h3>Total Customers</h3>
                                <div className="icon customers-icon">☺</div>
                            </div>
                            <div className="stat-value">{statisticsData.totalCustomers}</div>
                            <div className="stat-growth positive">
                                <span className="arrow">↑</span> {statisticsData.totalCustomersGrowth}
                            </div>
                        </div>
                            </>
                        )}
                    </div>

                    {/* Sales Analytics */}
                    <div className="analytics-section">
                        <div className="analytics-header">
                            <h2>Sales Analytics</h2>
                            <div className="time-filters">
                                <button 
                                    className={`time-filter ${activeTimeFrame === 'weekly' ? 'active' : ''}`}
                                    onClick={() => setActiveTimeFrame('weekly')}
                                >
                                    Last Week
                                </button>
                                <button 
                                    className={`time-filter ${activeTimeFrame === 'monthly' ? 'active' : ''}`}
                                    onClick={() => setActiveTimeFrame('monthly')}
                                >
                                    Last Month
                                </button>
                                <button 
                                    className={`time-filter ${activeTimeFrame === 'yearly' ? 'active' : ''}`}
                                    onClick={() => setActiveTimeFrame('yearly')}
                                >
                                    Last Year
                                </button>
                            </div>
                        </div>
                        <div className="chart-container">
                            {renderChart()}
                        </div>
                    </div>

                    {/* Order Analytics */}
                    <div className="analytics-section">
                        <div className="analytics-header">
                            <h2>Order Analytics</h2>
                            <div className="time-filters">
                                <button 
                                    className={`time-filter ${activeOrderTimeFrame === 'weekly' ? 'active' : ''}`}
                                    onClick={() => setActiveOrderTimeFrame('weekly')}
                                >
                                    Last Week
                                </button>
                                <button 
                                    className={`time-filter ${activeOrderTimeFrame === 'monthly' ? 'active' : ''}`}
                                    onClick={() => setActiveOrderTimeFrame('monthly')}
                                >
                                    Last Month
                                </button>
                                <button 
                                    className={`time-filter ${activeOrderTimeFrame === 'yearly' ? 'active' : ''}`}
                                    onClick={() => setActiveOrderTimeFrame('yearly')}
                                >
                                    Last Year
                                </button>
                            </div>
                        </div>
                        <div className="chart-container">
                            {renderOrderChart()}
                        </div>
                    </div>

                    {/* Bottom Sections */}
                    <div className="bottom-sections">
                        {/* Popular Items */}
                        <div className="popular-items-section">
                            <h2>Popular Items</h2>
                            <div className="items-list">
                                {popularItemsLoading ? (
                                    <div className="loading-spinner-small"></div>
                                ) : error ? (
                                    <p className="error-text">Failed to load popular items</p>
                                ) : popularItems.length > 0 ? (
                                    popularItems.map((item, index) => (
                                    <div className="item-card" key={item.dish_id}>
                                        <div className="item-image">
                                            <img 
                                                src={item.img_url || `https://via.placeholder.com/50x50/f5f5f5/e53935?text=${encodeURIComponent(item.dish_name)}`} 
                                                alt={item.dish_name}
                                                onError={(e) => {
                                                    e.target.src = `https://via.placeholder.com/50x50/f5f5f5/e53935?text=${encodeURIComponent(item.dish_name)}`;
                                                }}
                                            />
                                        </div>
                                        <div className="item-details">
                                            <h3>{item.dish_name}</h3>
                                            <p>{item.total_quantity} orders</p>
                                        </div>
                                        {/* <div className="item-price">₹{(item.price || 0).toFixed(2)}</div> */}
                                    </div>
                                    ))
                                ) : (
                                    <p className="no-data-text">No popular items to display</p>
                                )}
                            </div>
                        </div>

                        {/* Recent Orders */}
                        <div className="recent-orders-section">
                            <h2>Recent Orders</h2>
                            <div className="orders-list">
                                {recentOrdersLoading ? (
                                    <div className="loading-spinner-small"></div>
                                ) : error ? (
                                    <p className="error-text">Failed to load recent orders</p>
                                ) : recentOrders.length > 0 ? (
                                    recentOrders.map((order, index) => (
                                    <div className="order-card" key={index}>
                                        <div className="order-user">
                                            <img 
                                                src={`https://via.placeholder.com/40x40/f5f5f5/e53935?text=${encodeURIComponent(order.customer_name.charAt(0))}`} 
                                                alt={order.customer_name}
                                                onError={(e) => {
                                                    e.target.src = `https://via.placeholder.com/40x40/f5f5f5/e53935?text=${encodeURIComponent(order.customer_name.charAt(0))}`;
                                                }}
                                            />
                                            <div className="user-order-details">
                                                <h3>{order.customer_name}</h3>
                                                <p>{order.dishes.length} items • ₹{order.final_amount.toFixed(2)}</p>
                                            </div>
                                        </div>
                                        <div className={`order-status.${getStatusText(order.status).toLowerCase()}`}>
                                            {getStatusText(order.status)}
                                        </div>
                                    </div>
                                    ))
                                ) : (
                                    <p className="no-data-text">No recent orders to display</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CanteenStatistics;