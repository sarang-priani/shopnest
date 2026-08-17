import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import styles from './CartPage.module.css';

function CartPage() {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className={styles.page}>
        <div className={styles.empty}>
          <h2>Your cart is empty</h2>
          <p>Please log in to view your cart.</p>
          <Link to="/login" className={styles.shopBtn}>Log In</Link>
        </div>
      </div>
    );
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.empty}>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven&apos;t added anything yet.</p>
          <Link to="/products" className={styles.shopBtn}>Browse Products</Link>
        </div>
      </div>
    );
  }

  const total = cart.items.reduce((sum, item) => {
    const price = item.product?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Shopping Cart</h1>

      <div className={styles.layout}>
        <div className={styles.items}>
          {cart.items.map((item) => (
            <div key={item.product?._id || item.product} className={styles.item}>
              <img
                src={item.product?.image}
                alt={item.product?.name}
                className={styles.image}
              />
              <div className={styles.details}>
                <Link to={`/products/${item.product?._id}`} className={styles.name}>
                  {item.product?.name}
                </Link>
                <p className={styles.price}>₹{item.product?.price}</p>
                <div className={styles.quantityControls}>
                  <button
                    className={styles.qtyBtn}
                    onClick={() => updateQuantity(item.product._id, Math.max(1, item.quantity - 1))}
                    disabled={item.quantity <= 1}
                  >
                    −
                  </button>
                  <span className={styles.qtyValue}>{item.quantity}</span>
                  <button
                    className={styles.qtyBtn}
                    onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                  >
                    +
                  </button>
                  <button
                    className={styles.removeBtn}
                    onClick={() => removeFromCart(item.product._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
              <p className={styles.lineTotal}>₹{item.product?.price * item.quantity}</p>
            </div>
          ))}
        </div>

        <div className={styles.summary}>
          <h2 className={styles.summaryTitle}>Order Summary</h2>
          <div className={styles.summaryRow}>
            <span>Subtotal ({cart.items.reduce((s, i) => s + i.quantity, 0)} items)</span>
            <span>₹{total}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Shipping</span>
            <span className={styles.free}>Free</span>
          </div>
          <div className={styles.summaryTotal}>
            <span>Total</span>
            <span>₹{total}</span>
          </div>
          <button className={styles.checkoutBtn} onClick={() => navigate('/checkout')}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
