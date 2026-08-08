import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import styles from './HomePage.module.css';

function HomePage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5001/api/products')
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  return (
    <div className={styles.page}>
      <h1>Products</h1>

      <div className={styles.grid}>
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default HomePage;