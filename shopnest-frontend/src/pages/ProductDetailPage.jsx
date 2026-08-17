import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { apiFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import styles from './ProductDetailPage.module.css';

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await apiFetch(`/products/${id}`);
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await apiFetch(`/products/${id}/reviews`);
        setReviews(data);
      } catch {
        setReviews([]);
      }
    };
    fetchReviews();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setAdding(true);
    try {
      await addToCart(id, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch {
      // error handled by CartContext
    } finally {
      setAdding(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess(false);
    setSubmittingReview(true);
    try {
      await apiFetch(`/products/${id}/reviews`, {
        method: 'POST',
        body: { rating: Number(rating), comment },
      });
      setReviewSuccess(true);
      setComment('');
      setRating(5);
      const data = await apiFetch(`/products/${id}/reviews`);
      setReviews(data);
    } catch (err) {
      setReviewError(err.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return <div className={styles.page}><p className={styles.loadingText}>Loading...</p></div>;
  }

  if (error) {
    return <div className={styles.page}><p className={styles.errorText}>{error}</p></div>;
  }

  if (!product) {
    return <div className={styles.page}><p className={styles.errorText}>Product not found</p></div>;
  }

  return (
    <div className={styles.page}>
      <Link to="/products" className={styles.backLink}>← Back to Products</Link>

      <div className={styles.layout}>
        <div className={styles.imageCol}>
          <img src={product.image} alt={product.name} className={styles.image} />
        </div>

        <div className={styles.infoCol}>
          <h1 className={styles.name}>{product.name}</h1>
          <p className={styles.category}>{product.category}</p>
          <p className={styles.price}>₹{product.price}</p>
          <p className={styles.stock}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </p>
          <p className={styles.description}>{product.description}</p>

          {product.stock > 0 && (
            <div className={styles.addToCart}>
              <div className={styles.qtySelector}>
                <button
                  className={styles.qtyBtn}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <span className={styles.qtyValue}>{quantity}</span>
                <button
                  className={styles.qtyBtn}
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
              <button
                className={styles.addBtn}
                onClick={handleAddToCart}
                disabled={adding}
              >
                {adding ? 'Adding...' : added ? 'Added!' : 'Add to Cart'}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className={styles.reviewsSection}>
        <h2 className={styles.reviewsTitle}>Reviews ({reviews.length})</h2>

        {reviews.length === 0 && (
          <p className={styles.noReviews}>No reviews yet. Be the first to review this product!</p>
        )}

        <div className={styles.reviewsList}>
          {reviews.map((review) => (
            <div key={review._id} className={styles.reviewCard}>
              <div className={styles.reviewHeader}>
                <span className={styles.reviewerName}>{review.user?.name || 'Anonymous'}</span>
                <span className={styles.reviewRating}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
              </div>
              <p className={styles.reviewComment}>{review.comment}</p>
              <p className={styles.reviewDate}>{new Date(review.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>

        {user && (
          <form className={styles.reviewForm} onSubmit={handleReviewSubmit}>
            <h3 className={styles.reviewFormTitle}>Write a Review</h3>
            {reviewError && <p className={styles.reviewError}>{reviewError}</p>}
            {reviewSuccess && <p className={styles.reviewSuccess}>Review submitted successfully!</p>}

            <label className={styles.label}>
              Rating
              <select
                className={styles.select}
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              >
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>{r} Star{r !== 1 ? 's' : ''}</option>
                ))}
              </select>
            </label>

            <label className={styles.label}>
              Comment
              <textarea
                className={styles.textarea}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                rows={4}
              />
            </label>

            <button type="submit" className={styles.submitReview} disabled={submittingReview}>
              {submittingReview ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        )}

        {!user && (
          <p className={styles.loginPrompt}>
            <Link to="/login" className={styles.loginLink}>Log in</Link> to write a review.
          </p>
        )}
      </div>
    </div>
  );
}

export default ProductDetailPage;
