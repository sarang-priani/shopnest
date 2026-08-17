import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { apiFetch } from '../utils/api';
import styles from './ProductsPage.module.css';

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await apiFetch('/products');
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = [...new Set(products.map((p) => p.category))].sort();

  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !category || p.category === category;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <div className={styles.page}><p className={styles.loadingText}>Loading products...</p></div>;
  }

  if (error) {
    return <div className={styles.page}><p className={styles.errorText}>{error}</p></div>;
  }

  return (
    <div className={styles.page}>
      <h1>Products</h1>

      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Search products..."
          className={styles.searchInput}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className={styles.categorySelect}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className={styles.noResults}>No products found.</p>
      ) : (
        <div className={styles.grid}>
          {filtered.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductsPage;
