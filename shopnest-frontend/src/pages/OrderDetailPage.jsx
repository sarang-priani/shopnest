import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import styles from './OrderDetailPage.module.css';

function OrderDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    const fetchOrder = async () => {
      try {
        const data = await apiFetch(`/orders/${id}`);
        setOrder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, user]);

  if (!user) {
    return (
      <div className={styles.page}>
        <div className={styles.empty}>
          <h2>Please log in to view this order</h2>
          <Link to="/login" className={styles.loginBtn}>Log In</Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className={styles.page}><p className={styles.loadingText}>Loading order...</p></div>;
  }

  if (error) {
    return <div className={styles.page}><p className={styles.errorText}>{error}</p></div>;
  }

  if (!order) {
    return <div className={styles.page}><p className={styles.errorText}>Order not found</p></div>;
  }

  return (
    <div className={styles.page}>
      <Link to="/orders" className={styles.backLink}>← Back to Orders</Link>
      <h1 className={styles.title}>Order #{order._id.slice(-8).toUpperCase()}</h1>

      <div className={styles.layout}>
        <div className={styles.details}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Shipping Address</h2>
            <p className={styles.address}>{order.shippingAddress.address}</p>
            <p className={styles.address}>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
            <p className={styles.address}>{order.shippingAddress.country}</p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Payment</h2>
            <p className={styles.paymentMethod}>{order.paymentMethod}</p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Status</h2>
            <p className={`${styles.status} ${order.isDelivered ? styles.delivered : styles.pending}`}>
              {order.isDelivered ? `Delivered on ${new Date(order.deliveredAt).toLocaleDateString()}` : 'Pending'}
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Order Items</h2>
            <div className={styles.itemsList}>
              {order.orderItems.map((item, i) => (
                <div key={i} className={styles.item}>
                  <img src={item.image} alt={item.name} className={styles.itemImage} />
                  <div className={styles.itemInfo}>
                    <span className={styles.itemName}>{item.name}</span>
                    <span className={styles.itemPrice}>₹{item.price} × {item.quantity}</span>
                  </div>
                  <span className={styles.itemTotal}>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.summary}>
          <h2 className={styles.summaryTitle}>Order Summary</h2>
          <div className={styles.summaryRow}>
            <span>Subtotal</span>
            <span>₹{order.totalPrice}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Shipping</span>
            <span className={styles.free}>Free</span>
          </div>
          <div className={styles.summaryTotal}>
            <span>Total</span>
            <span>₹{order.totalPrice}</span>
          </div>
          <p className={styles.orderDate}>
            Placed on {new Date(order.createdAt).toLocaleDateString()} at{' '}
            {new Date(order.createdAt).toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailPage;
