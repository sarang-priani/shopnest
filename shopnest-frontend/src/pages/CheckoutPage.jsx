import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../utils/api';
import { useCart } from '../context/CartContext';
import styles from './CheckoutPage.module.css';

function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const total = cart.items.reduce((sum, item) => {
    const price = item.product?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.empty}>
          <h2>Your cart is empty</h2>
          <p>Add some products before checking out.</p>
          <button className={styles.shopBtn} onClick={() => navigate('/products')}>
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const order = await apiFetch('/orders', {
        method: 'POST',
        body: {
          shippingAddress: { address, city, postalCode, country },
        },
      });
      clearCart();
      navigate(`/orders/${order._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Checkout</h1>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.layout}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <h2 className={styles.sectionTitle}>Shipping Address</h2>

          <label className={styles.label}>
            Address
            <input
              type="text"
              className={styles.input}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </label>

          <label className={styles.label}>
            City
            <input
              type="text"
              className={styles.input}
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </label>

          <label className={styles.label}>
            Postal Code
            <input
              type="text"
              className={styles.input}
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              required
            />
          </label>

          <label className={styles.label}>
            Country
            <input
              type="text"
              className={styles.input}
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
          </label>

          <div className={styles.paymentInfo}>
            <h2 className={styles.sectionTitle}>Payment Method</h2>
            <p className={styles.cod}>Cash on Delivery (COD)</p>
          </div>

          <button type="submit" className={styles.placeOrder} disabled={loading}>
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </form>

        <div className={styles.summary}>
          <h2 className={styles.summaryTitle}>Order Summary</h2>
          {cart.items.map((item) => (
            <div key={item.product?._id || item.product} className={styles.summaryItem}>
              <span className={styles.summaryName}>
                {item.product?.name} × {item.quantity}
              </span>
              <span className={styles.summaryPrice}>₹{item.product?.price * item.quantity}</span>
            </div>
          ))}
          <div className={styles.summaryTotal}>
            <span>Total</span>
            <span>₹{total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
