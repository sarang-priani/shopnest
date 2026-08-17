import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import styles from './OrderHistoryPage.module.css';

function OrderHistoryPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      try {
        const data = await apiFetch('/orders/myorders');
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  if (!user) {
    return (
      <div className={styles.page}>
        <div className={styles.empty}>
          <h2>Please log in to view your orders</h2>
          <Link to="/login" className={styles.loginBtn}>Log In</Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className={styles.page}><p className={styles.loadingText}>Loading orders...</p></div>;
  }

  if (error) {
    return <div className={styles.page}><p className={styles.errorText}>{error}</p></div>;
  }

  if (orders.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.empty}>
          <h2>No orders yet</h2>
          <p>Start shopping to see your orders here.</p>
          <Link to="/products" className={styles.shopBtn}>Browse Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Order History</h1>
      <div className={styles.ordersList}>
        {orders.map((order) => (
          <Link to={`/orders/${order._id}`} key={order._id} className={styles.orderCard}>
            <div className={styles.orderHeader}>
              <span className={styles.orderId}>Order #{order._id.slice(-8).toUpperCase()}</span>
              <span className={styles.orderDate}>{new Date(order.createdAt).toLocaleDateString()}</span>
            </div>
            <div className={styles.orderItems}>
              {order.orderItems.map((item, i) => (
                <div key={i} className={styles.orderItem}>
                  <img src={item.image} alt={item.name} className={styles.itemImage} />
                  <span className={styles.itemName}>{item.name}</span>
                  <span className={styles.itemQty}>×{item.quantity}</span>
                </div>
              ))}
            </div>
            <div className={styles.orderFooter}>
              <span className={styles.total}>₹{order.totalPrice}</span>
              <span className={`${styles.status} ${order.isDelivered ? styles.delivered : styles.pending}`}>
                {order.isDelivered ? 'Delivered' : 'Pending'}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default OrderHistoryPage;
