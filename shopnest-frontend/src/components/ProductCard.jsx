import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import styles from './ProductCard.module.css';

function ProductCard({ product }) {
  const { toggleWishlist, items } = useWishlist();
  const { user } = useAuth();
  const [optimisticLiked, setOptimisticLiked] = useState(null);
  const liked = optimisticLiked ?? items.some((p) => p._id === product._id);

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    setOptimisticLiked(!liked);
    await toggleWishlist(product._id);
    setOptimisticLiked(null);
  };

  return (
    <Link to={`/products/${product._id}`} className={styles.card}>
      <div className={styles.imageWrap}>
        <img src={product.image} alt={product.name} className={styles.image} />
        {user && (
          <button
            className={`${styles.heartBtn} ${liked ? styles.heartActive : ''}`}
            onClick={handleWishlist}
            aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
            type="button"
          >
            <Heart size={18} fill={liked ? '#f87171' : 'none'} stroke={liked ? '#f87171' : '#ccc'} />
          </button>
        )}
      </div>
      <div className={styles.info}>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.category}>{product.category}</p>
        <p className={styles.price}>₹{product.price}</p>
      </div>
    </Link>
  );
}

export default ProductCard;
