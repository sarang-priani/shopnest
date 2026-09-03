import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, ShoppingCart, Heart, User, LogOut, Package, ChevronDown, Shield, Menu, X } from 'lucide-react';
import styles from './Navbar.module.css';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    setDropdownOpen(false);
    navigate('/');
  };

  const handleMobileNav = () => {
    setMobileOpen(false);
  };

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.logo}>
        <ShoppingBag size={22} className={styles.logoIcon} />
        ShopNest
      </Link>

      <button
        className={styles.hamburger}
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
        aria-expanded={mobileOpen}
      >
        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      <div className={`${styles.links} ${mobileOpen ? styles.show : ''}`}>
        <Link
          to="/"
          className={`${styles.link} ${location.pathname === '/' ? styles.active : ''}`}
          onClick={handleMobileNav}
        >
          Home
        </Link>
        <Link
          to="/products"
          className={`${styles.link} ${location.pathname === '/products' ? styles.active : ''}`}
          onClick={handleMobileNav}
        >
          Products
        </Link>

        <div className={styles.divider} />

        <Link to="/cart" className={styles.cartLink} onClick={handleMobileNav}>
          <ShoppingCart size={20} className={styles.icon} />
          {itemCount > 0 && <span className={styles.badge} data-testid="cart-badge">{itemCount}</span>}
        </Link>

        <Link to="/wishlist" className={styles.wishlistLink} onClick={handleMobileNav}>
          <Heart size={20} className={styles.icon} />
          {wishlistCount > 0 && <span className={styles.badge} data-testid="wishlist-badge">{wishlistCount}</span>}
        </Link>

        {user ? (
          <div className={styles.userMenu} ref={menuRef}>
            <button
              className={styles.userTrigger}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <User size={16} />
              <span className={styles.userName}>{user.name}</span>
              <ChevronDown size={14} className={`${styles.chevron} ${dropdownOpen ? styles.chevronOpen : ''}`} />
            </button>
            {dropdownOpen && (
              <div className={styles.dropdown}>
                {user.isAdmin && user.adminMode && (
                  <Link to="/admin" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                    <Shield size={16} />
                    Admin Dashboard
                  </Link>
                )}
                <Link to="/orders" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                  <Package size={16} />
                  My Orders
                </Link>
                <Link to="/wishlist" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                  <Heart size={16} />
                  Wishlist
                </Link>
                <div className={styles.dropdownDivider} />
                <button className={styles.dropdownItem} onClick={handleLogout}>
                  <LogOut size={16} />
                  Log Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className={styles.loginLink} onClick={handleMobileNav}>Log In</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
