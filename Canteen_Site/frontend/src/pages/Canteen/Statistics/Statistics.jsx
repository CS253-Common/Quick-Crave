import React, { useState, useEffect } from 'react';
import canteenService from '../../../services/canteenService';
import './statistics.css';

const Statistics = () => {
    const [popularOrders, setPopularOrders] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                setLoading(true);
                // Fetch both popular and recent orders using the canteenService
                const [popularData, recentData] = await Promise.all([
                    canteenService.getPopularOrders(),
                    canteenService.getRecentOrders()
                ]);

                setPopularOrders(popularData);
                setRecentOrders(recentData);
                setError(null);
            } catch (err) {
                console.error('Error fetching statistics:', err);
                setError('Failed to load statistics data');
            } finally {
                setLoading(false);
            }
        };

        fetchStatistics();
    }, []);

    if (loading) {
        return <div className="statistics-loading">Loading statistics...</div>;
    }

    if (error) {
        return <div className="statistics-error">{error}</div>;
    }

    return (
        <div className="statistics-container">
            <div className="popular-orders-section">
                <h2>Popular Orders</h2>
                <div className="popular-orders-grid">
                    {popularOrders.map((item) => (
                        <div key={item.dish_id} className="popular-order-card">
                            <img src={item.image_url} alt={item.dish_name} />
                            <h3>{item.dish_name}</h3>
                            <div className="order-stats">
                                <p>Total Orders: {item.total_orders}</p>
                                <p>Revenue: ₹{item.revenue.toLocaleString()}</p>
                                <p>Rating: {item.rating}⭐</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="recent-orders-section">
                <h2>Recent Orders</h2>
                <div className="recent-orders-list">
                    {recentOrders.map((order) => (
                        <div key={order.order_id} className="recent-order-card">
                            <div className="order-header">
                                <h3>Order #{order.order_id}</h3>
                                <span className={`order-status ${order.status.toLowerCase()}`}>
                                    {order.status}
                                </span>
                            </div>
                            <div className="order-details">
                                <p className="customer-name">{order.customer_name}</p>
                                <div className="dishes-list">
                                    {order.dishes.map((dish, index) => (
                                        <p key={index}>
                                            {dish.quantity}x {dish.dish_name}
                                        </p>
                                    ))}
                                </div>
                                <p className="order-total">Total: ₹{order.total_amount.toLocaleString()}</p>
                                <p className="order-time">
                                    {new Date(order.order_time).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Statistics; 