import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import styles from './WishlistPage.module.css';

function WishlistPage() {
  const { items, loading } = useWishlist();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className={styles.page}>
        <div className={styles.empty}>
          <Heart size={48} className={styles.emptyIcon} />
          <h2>Your wishlist is empty</h2>
          <p>Please log in to view your wishlist.</p>
          <Link to="/login" className={styles.shopBtn}>Log In</Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className={styles.page}><p className={styles.loadingText}>Loading...</p></div>;
  }

  if (items.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.empty}>
          <Heart size={48} className={styles.emptyIcon} />
          <h2>Your wishlist is empty</h2>
          <p>Save items you love for later.</p>
          <Link to="/products" className={styles.shopBtn}>Browse Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>My Wishlist ({items.length})</h1>
      <div className={styles.grid}>
        {items.map((product) => (
          <Link key={product._id} to={`/products/${product._id}`} className={styles.card}>
            <img src={product.image} alt={product.name} className={styles.image} />
            <div className={styles.info}>
              <h3 className={styles.name}>{product.name}</h3>
              <p className={styles.category}>{product.category}</p>
              <p className={styles.price}>₹{product.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default WishlistPage;
