import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../utils/api';
import styles from './AdminDashboard.module.css';

function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('products');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formStock, setFormStock] = useState('');
  const [formImage, setFormImage] = useState(null);
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/');
    }
  }, [user, navigate]);

  const getHeaders = () => ({
    Authorization: `Bearer ${user?.token}`,
  });

  useEffect(() => {
    if (!user?.isAdmin || fetchedRef.current) return;
    fetchedRef.current = true;

    const load = async () => {
      try {
        const [prodRes, orderRes] = await Promise.all([
          fetch(`${API_URL}/products`),
          fetch(`${API_URL}/orders`, { headers: getHeaders() }),
        ]);
        const prodData = await prodRes.json();
        const orderData = await orderRes.json();
        setProducts(prodData);
        setOrders(orderData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const refetchData = async () => {
    try {
      const [prodRes, orderRes] = await Promise.all([
        fetch(`${API_URL}/products`),
        fetch(`${API_URL}/orders`, { headers: getHeaders() }),
      ]);
      const prodData = await prodRes.json();
      const orderData = await orderRes.json();
      setProducts(prodData);
      setOrders(orderData);
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setFormName('');
    setFormDescription('');
    setFormPrice('');
    setFormCategory('');
    setFormStock('');
    setFormImage(null);
    setEditProduct(null);
    setFormError('');
    setShowForm(false);
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setFormName(product.name);
    setFormDescription(product.description);
    setFormPrice(product.price.toString());
    setFormCategory(product.category);
    setFormStock(product.stock.toString());
    setFormImage(null);
    setFormError('');
    setShowForm(true);
  };

  const handleDelete = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`${API_URL}/products/${productId}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message);
      }
      setProducts(products.filter((p) => p._id !== productId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', formName);
      formData.append('description', formDescription);
      formData.append('price', formPrice);
      formData.append('category', formCategory);
      formData.append('stock', formStock);
      if (formImage) {
        formData.append('image', formImage);
      }

      const url = editProduct
        ? `${API_URL}/products/${editProduct._id}`
        : `${API_URL}/products`;
      const method = editProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${user.token}` },
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message);
      }

      resetForm();
      refetchData();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleMarkDelivered = async (orderId) => {
    try {
      const res = await fetch(`${API_URL}/orders/${orderId}/deliver`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getHeaders() },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message);
      }
      setOrders(orders.map((o) =>
        o._id === orderId ? { ...o, isDelivered: true, deliveredAt: new Date().toISOString() } : o
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  if (!user?.isAdmin) return null;

  if (loading) {
    return <div className={styles.page}><p className={styles.loadingText}>Loading...</p></div>;
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Admin Dashboard</h1>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${tab === 'products' ? styles.tabActive : ''}`}
          onClick={() => setTab('products')}
        >
          Products ({products.length})
        </button>
        <button
          className={`${styles.tab} ${tab === 'orders' ? styles.tabActive : ''}`}
          onClick={() => setTab('orders')}
        >
          Orders ({orders.length})
        </button>
      </div>

      {tab === 'products' && (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Products</h2>
            <button
              className={styles.addBtn}
              onClick={() => { resetForm(); setShowForm(true); }}
            >
              + Add Product
            </button>
          </div>

          {showForm && (
            <form className={styles.form} onSubmit={handleFormSubmit}>
              <h3 className={styles.formTitle}>{editProduct ? 'Edit Product' : 'New Product'}</h3>
              {formError && <p className={styles.formError}>{formError}</p>}

              <label className={styles.label}>
                Name
                <input
                  type="text"
                  className={styles.input}
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                />
              </label>

              <label className={styles.label}>
                Description
                <textarea
                  className={styles.textarea}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  required
                  rows={3}
                />
              </label>

              <div className={styles.formRow}>
                <label className={styles.label}>
                  Price
                  <input
                    type="number"
                    className={styles.input}
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    required
                    min="0"
                    step="0.01"
                  />
                </label>

                <label className={styles.label}>
                  Stock
                  <input
                    type="number"
                    className={styles.input}
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                    required
                    min="0"
                  />
                </label>
              </div>

              <label className={styles.label}>
                Category
                <select
                  className={styles.select}
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  required
                >
                  <option value="">Select category</option>
                  <option value="Shoes">Shoes</option>
                  <option value="Bags">Bags</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </label>

              <label className={styles.label}>
                Image {editProduct ? '(leave empty to keep current)' : ''}
                <input
                  type="file"
                  className={styles.fileInput}
                  onChange={(e) => setFormImage(e.target.files[0])}
                  accept="image/*"
                  required={!editProduct}
                />
              </label>

              <div className={styles.formActions}>
                <button type="submit" className={styles.saveBtn} disabled={formLoading}>
                  {formLoading ? 'Saving...' : editProduct ? 'Update Product' : 'Create Product'}
                </button>
                <button type="button" className={styles.cancelBtn} onClick={resetForm}>
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <div className={styles.productCell}>
                        <img src={product.image} alt="" className={styles.tableImage} />
                        <span>{product.name}</span>
                      </div>
                    </td>
                    <td>{product.category}</td>
                    <td>₹{product.price}</td>
                    <td>{product.stock}</td>
                    <td>
                      <div className={styles.actions}>
                        <button className={styles.editBtn} onClick={() => handleEdit(product)}>Edit</button>
                        <button className={styles.deleteBtn} onClick={() => handleDelete(product._id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'orders' && (
        <div className={styles.section}>
          {selectedOrder ? (
            <div className={styles.orderDetail}>
              <div className={styles.detailHeader}>
                <button className={styles.backBtn} onClick={() => setSelectedOrder(null)}>
                  ← Back to Orders
                </button>
                <h2 className={styles.sectionTitle}>
                  Order #{selectedOrder._id.slice(-8).toUpperCase()}
                </h2>
              </div>

              <div className={styles.detailCard}>
                <div className={styles.detailBlock}>
                  <h3 className={styles.detailTitle}>Customer</h3>
                  <p className={styles.detailText}>{selectedOrder.user?.name || 'Unknown'}</p>
                  <p className={styles.detailText}>{selectedOrder.user?.email}</p>
                </div>
                <div className={styles.detailBlock}>
                  <h3 className={styles.detailTitle}>Shipping Address</h3>
                  <p className={styles.detailText}>{selectedOrder.shippingAddress?.address}</p>
                  <p className={styles.detailText}>
                    {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.postalCode}
                  </p>
                  <p className={styles.detailText}>{selectedOrder.shippingAddress?.country}</p>
                </div>
                <div className={styles.detailBlock}>
                  <h3 className={styles.detailTitle}>Payment</h3>
                  <p className={styles.detailText}>{selectedOrder.paymentMethod}</p>
                </div>
                <div className={styles.detailBlock}>
                  <h3 className={styles.detailTitle}>Status</h3>
                  <span
                    className={`${styles.statusBadge} ${selectedOrder.isDelivered ? styles.delivered : styles.pending}`}
                  >
                    {selectedOrder.isDelivered ? 'Delivered' : 'Pending'}
                  </span>
                  {selectedOrder.isDelivered && selectedOrder.deliveredAt && (
                    <p className={styles.detailText}>
                      Delivered on {new Date(selectedOrder.deliveredAt).toLocaleDateString()}
                    </p>
                  )}
                  {!selectedOrder.isDelivered && (
                    <button
                      className={styles.deliverBtn}
                      onClick={() => { handleMarkDelivered(selectedOrder._id); setSelectedOrder(null); }}
                    >
                      Mark Delivered
                    </button>
                  )}
                </div>
              </div>

              <h3 className={styles.detailTitle}>Order Items</h3>
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Qty</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.orderItems?.map((item, idx) => (
                      <tr key={idx}>
                        <td>
                          <div className={styles.productCell}>
                            {item.image && <img src={item.image} alt="" className={styles.tableImage} />}
                            <span>{item.name}</span>
                          </div>
                        </td>
                        <td>₹{item.price}</td>
                        <td>{item.quantity}</td>
                        <td>₹{item.price * item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className={styles.detailTotal}>
                <span>Total</span>
                <span>₹{selectedOrder.totalPrice}</span>
              </div>
            </div>
          ) : (
            <>
              <h2 className={styles.sectionTitle}>All Orders</h2>
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>User</th>
                      <th>Date</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Delivered</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id}>
                        <td className={styles.orderIdCell}>#{order._id.slice(-8).toUpperCase()}</td>
                        <td>{order.user?.name || 'Unknown'}</td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td>₹{order.totalPrice}</td>
                        <td>
                          <span className={`${styles.statusBadge} ${order.isDelivered ? styles.delivered : styles.pending}`}>
                            {order.isDelivered ? 'Delivered' : 'Pending'}
                          </span>
                        </td>
                        <td className={styles.deliveredDate}>
                          {order.isDelivered && order.deliveredAt
                            ? new Date(order.deliveredAt).toLocaleDateString()
                            : <span className={styles.dash}>—</span>}
                        </td>
                        <td>
                          <div className={styles.actions}>
                            <button
                              className={styles.viewBtn}
                              onClick={() => setSelectedOrder(order)}
                            >
                              View
                            </button>
                            {!order.isDelivered && (
                              <button
                                className={styles.deliverBtn}
                                onClick={() => handleMarkDelivered(order._id)}
                              >
                                Mark Delivered
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
