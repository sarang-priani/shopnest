import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './HomePage.module.css';
import { Truck, RotateCcw, ShieldCheck } from 'lucide-react';
const slides = [
  { title: 'Big Summer Sale', subtitle: 'Up to 50% off electronics', image: 'https://picsum.photos/seed/sale1/1200/500' },
  { title: 'New Arrivals', subtitle: 'Fresh styles just landed', image: 'https://picsum.photos/seed/sale2/1200/500' },
  { title: 'Free Shipping', subtitle: 'On all orders above ₹999', image: 'https://picsum.photos/seed/sale3/1200/500' },
];
const features = [
  { title: 'Free Shipping', description: 'On all orders above ₹999', icon: Truck },
  { title: 'Easy Returns', description: '7-day hassle-free returns', icon: RotateCcw },
  { title: 'Secure Payments', description: 'Your data is always protected', icon: ShieldCheck },
];
function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
  
    return () => clearInterval(timer);
  }, []);
  return (
    <div className={styles.page}>
      <section
  className={styles.hero}
  style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
>
  <div className={styles.heroOverlay} />
  <div className={styles.heroContent}>
    <h1>{slides[currentSlide].title}</h1>
    <p>{slides[currentSlide].subtitle}</p>
    <Link to="/products" className={styles.heroButton}>
      Shop Now
    </Link>
  </div>

  <div className={styles.dots}>
    {slides.map((_, index) => (
      <button
        key={index}
        className={`${styles.dot} ${index === currentSlide ? styles.dotActive : ''}`}
        onClick={() => setCurrentSlide(index)}
      />
    ))}
  </div>
</section>
<section className={styles.features}>
  {features.map((feature) => {
    const Icon = feature.icon;
    return (
      <div key={feature.title} className={styles.featureCard}>
        <Icon size={28} className={styles.featureIcon} />
        <h3 className={styles.featureTitle}>{feature.title}</h3>
        <p className={styles.featureDescription}>{feature.description}</p>
      </div>
    );
  })}
</section>
    </div>
  );
}

export default HomePage;