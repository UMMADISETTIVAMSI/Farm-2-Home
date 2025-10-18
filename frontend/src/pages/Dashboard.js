import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { products, orders } from '../utils/api';
import { useCart } from '../contexts/CartContext';

const Dashboard = ({ user }) => {
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState(user.role === 'farmer' ? 'products' : 'browse');
  const [productList, setProductList] = useState([]);
  const [myProducts, setMyProducts] = useState([]);
  const [orderList, setOrderList] = useState([]);
  const [earnings, setEarnings] = useState({ total: 0, monthly: 0, pending: 0 });
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showAddProduct, setShowAddProduct] = useState(false);
  const [addingProduct, setAddingProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '', category: 'Vegetables', price: '', quantity: '', unit: 'kg',
    farmAddress: '', farmPhone: '', image: ''
  });
  
  const [editingProduct, setEditingProduct] = useState(null);
  const [editProduct, setEditProduct] = useState({});

  useEffect(() => {
    if (user.role === 'client') loadFavorites(); // Load favorites on component mount for clients
    if (activeTab === 'browse') {
      setCurrentPage(1);
      loadProducts(1);
    }
    if (activeTab === 'products') loadMyProducts();
    if (activeTab === 'orders') loadOrders();
    if (activeTab === 'earnings') loadEarnings();
    if (activeTab === 'favorites') loadFavorites();
  }, [activeTab]);

  useEffect(() => {
    if (user.role === 'client') loadFavorites();
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    loadProducts(page);
  };

  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  const debouncedSearch = useCallback(
    debounce(() => {
      if (activeTab === 'browse') {
        setCurrentPage(1);
        loadProducts(1);
      }
    }, 300),
    [searchTerm, category, activeTab]
  );

  useEffect(() => {
    debouncedSearch();
  }, [searchTerm, category, debouncedSearch]);

  const loadProducts = async (page = currentPage) => {
    try {
      setLoading(true);
      const params = { page, limit: 12 };
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (category) params.category = category;
      
      console.log('Loading products with params:', params);
      const response = await products.getAll(params);
      console.log('Products response:', response.data);
      setProductList(response.data.products || []);
      setTotalPages(response.data.totalPages || 1);
      setCurrentPage(response.data.page || 1);
    } catch (error) {
      console.error('Error loading products:', error);
      console.error('Error details:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const loadMyProducts = async () => {
    try {
      const response = await products.getMyProducts();
      setMyProducts(response.data);
    } catch (error) {
      console.error('Error loading my products:', error);
    }
  };

  const loadOrders = async () => {
    try {
      const response = user.role === 'farmer' 
        ? await orders.getFarmerOrders()
        : await orders.getMyOrders();
      setOrderList(response.data);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const loadEarnings = async () => {
    try {
      const response = await orders.getEarnings();
      setEarnings(response.data);
    } catch (error) {
      console.error('Error loading earnings:', error);
    }
  };

  const loadFavorites = async () => {
    try {
      if (user.role === 'client') {
        const response = await products.getFavorites();
        setFavorites(response.data || []);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      setFavorites([]);
    }
  };

  const toggleFavorite = async (productId) => {
    // Instant UI update
    const isFavorited = favorites.some(fav => fav._id === productId);
    if (isFavorited) {
      setFavorites(favorites.filter(fav => fav._id !== productId));
    } else {
      const product = productList.find(p => p._id === productId);
      if (product) setFavorites([...favorites, product]);
    }
    
    try {
      await products.toggleFavorite(productId);
    } catch (error) {
      // Revert on error
      if (isFavorited) {
        const product = productList.find(p => p._id === productId);
        if (product) setFavorites([...favorites, product]);
      } else {
        setFavorites(favorites.filter(fav => fav._id !== productId));
      }
      console.error('Error toggling favorite:', error);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name.trim() || !newProduct.price || !newProduct.quantity) {
      alert('Please fill all required fields');
      return;
    }
    if (newProduct.price <= 0 || newProduct.quantity <= 0) {
      alert('Price and quantity must be positive numbers');
      return;
    }
    setAddingProduct(true);
    try {
      await products.create(newProduct);
      setShowAddProduct(false);
      setNewProduct({
        name: '', category: 'Vegetables', price: '', quantity: '', unit: 'kg',
        farmAddress: '', farmPhone: '', image: ''
      });
      alert('Product added successfully!');
      loadMyProducts();
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error adding product: ' + (error.response?.data?.message || error.message));
    } finally {
      setAddingProduct(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct({...newProduct, image: reader.result});
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOrder = async (productId, quantity) => {
    try {
      await orders.create({ productId, quantity: parseInt(quantity) });
      alert('Order placed successfully!');
      loadProducts();
    } catch (error) {
      alert(error.response?.data?.message || 'Error placing order');
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await orders.updateStatus(orderId, status);
      loadOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const cancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await orders.cancel(orderId);
        alert('Order cancelled successfully!');
        loadOrders();
      } catch (error) {
        alert(error.response?.data?.message || 'Error cancelling order');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Dashboard - {user.name}</h1>
      
      <div className="flex space-x-4 mb-6">
        {user.role === 'client' && (
          <>
            <button
              onClick={() => setActiveTab('browse')}
              className={`px-4 py-2 rounded transition-colors ${activeTab === 'browse' ? 'bg-blue-400 text-white' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white'}`}
            >
              Browse Products
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`px-4 py-2 rounded transition-colors ${activeTab === 'favorites' ? 'bg-blue-400 text-white' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white'}`}
            >
              Favorites
            </button>
          </>
        )}
        {user.role === 'farmer' && (
          <>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 rounded transition-colors ${activeTab === 'products' ? 'bg-blue-400 text-white' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white'}`}
            >
              My Products
            </button>
            <button
              onClick={() => setActiveTab('earnings')}
              className={`px-4 py-2 rounded transition-colors ${activeTab === 'earnings' ? 'bg-blue-400 text-white' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white'}`}
            >
              Earnings
            </button>
          </>
        )}
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded transition-colors ${activeTab === 'orders' ? 'bg-blue-400 text-white' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white'}`}
        >
          {user.role === 'farmer' ? 'Incoming Orders' : 'My Orders'}
        </button>
      </div>

      {activeTab === 'browse' && (
        <div>
          <div className="flex space-x-4 mb-6">
            <input
              type="text"
              placeholder="Search products..."
              className="flex-1 p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select
              className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Vegetables">Vegetables</option>
              <option value="Fruits">Fruits</option>
              <option value="Dairy">Dairy</option>
              <option value="Grains">Grains</option>
              <option value="Others">Others</option>
            </select>

          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
              <p className="mt-2 text-gray-600 dark:text-gray-300">Loading products...</p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                {productList.length === 0 ? (
                  <p className="col-span-full text-center text-gray-600 dark:text-gray-300">No products available</p>
                ) : (
                  productList.map(product => (
                    <div key={product._id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-blue-300 cursor-pointer">
                      {product.image && (
                        <img src={product.image} alt={product.name} className="w-full h-32 object-cover rounded-lg mb-3 transition-transform duration-300 hover:scale-110" />
                      )}
                      <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white transition-colors duration-300 hover:text-blue-600">{product.name}</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-1 text-sm">Category: {product.category}</p>
                      <p className="text-emerald-500 font-bold mb-2">₹{product.price}/{product.unit}</p>
                      <p className="text-gray-600 dark:text-gray-300 mb-1 text-sm">Available: {product.quantity} {product.unit}</p>
                      <p className="text-gray-600 dark:text-gray-300 mb-1 text-sm">Farm: {product.farmName}</p>
                      <p className="text-gray-600 dark:text-gray-300 mb-1 text-sm">Area: {product.farmAddress}</p>
                      <p className="text-gray-600 dark:text-gray-300 mb-3 text-sm">Phone: {product.farmPhone}</p>
                      <div className="flex space-x-2">
                        <input
                          type="number"
                          min="1"
                          max={product.quantity}
                          placeholder="Qty"
                          className="w-16 p-2 border border-gray-200 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                          id={`qty-${product._id}`}
                        />
                        <button
                          onClick={() => toggleFavorite(product._id)}
                          className="px-3 py-2 rounded text-sm transform transition-all duration-200 hover:scale-105 bg-white border border-gray-300 hover:bg-gray-50"
                        >
                          <i className={`fas fa-heart text-lg transition-colors duration-200 ${favorites.some(fav => fav._id === product._id) ? 'text-red-500' : 'text-gray-400'}`}></i>
                        </button>
                        <button
                          onClick={() => {
                            const qty = document.getElementById(`qty-${product._id}`).value;
                            if (qty) {
                              addToCart(product, parseInt(qty));
                              alert('Added to cart!');
                              document.getElementById(`qty-${product._id}`).value = '';
                            }
                          }}
                          className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 text-sm transform transition-all duration-200 hover:scale-105 active:scale-95"
                        >
                          Add to Cart
                        </button>
                        <button
                          onClick={() => {
                            const qty = document.getElementById(`qty-${product._id}`).value;
                            if (qty) handleOrder(product._id, qty);
                          }}
                          className="bg-emerald-400 text-white px-3 py-2 rounded hover:bg-emerald-500 text-sm transform transition-all duration-200 hover:scale-105 active:scale-95"
                        >
                          Order Now
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              {totalPages > 1 && (
                <div className="flex justify-center mt-8 space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed bg-white text-gray-800"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={`page-${i + 1}`}
                      onClick={() => handlePageChange(i + 1)}
                      className={`px-4 py-2 border border-gray-200 rounded ${
                        currentPage === i + 1 ? 'bg-blue-400 text-white' : 'bg-white text-gray-800 hover:opacity-80'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed bg-white text-gray-800"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {activeTab === 'products' && user.role === 'farmer' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">My Products</h2>
            <button
              onClick={() => setShowAddProduct(true)}
              className="bg-blue-400 text-white px-4 py-2 rounded-lg hover:bg-blue-500"
            >
              Add Product
            </button>
          </div>

          {showAddProduct && (
            <div className="bg-white border border-gray-200 p-6 rounded-lg mb-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Add New Product</h3>
              <form onSubmit={handleAddProduct} className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Product Name"
                  className="p-3 border border-gray-200 rounded-lg bg-white text-gray-800"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  required
                />
                <select
                  className="p-3 border border-gray-200 rounded-lg bg-white text-gray-800"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                >
                  <option value="Vegetables">Vegetables</option>
                  <option value="Fruits">Fruits</option>
                  <option value="Dairy">Dairy</option>
                  <option value="Grains">Grains</option>
                  <option value="Others">Others</option>
                </select>
                <input
                  type="number"
                  placeholder="Price"
                  className="p-3 border border-gray-200 rounded-lg bg-white text-gray-800"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                  required
                />
                <input
                  type="number"
                  placeholder="Quantity"
                  className="p-3 border border-gray-200 rounded-lg bg-white text-gray-800"
                  value={newProduct.quantity}
                  onChange={(e) => setNewProduct({...newProduct, quantity: e.target.value})}
                  required
                />
                <input
                  type="text"
                  placeholder="Unit (kg, dozen, liters)"
                  className="p-3 border border-gray-200 rounded-lg bg-white text-gray-800"
                  value={newProduct.unit}
                  onChange={(e) => setNewProduct({...newProduct, unit: e.target.value})}
                  required
                />
                <input
                  type="text"
                  placeholder="Farm Address"
                  className="p-3 border border-gray-200 rounded-lg bg-white text-gray-800"
                  value={newProduct.farmAddress}
                  onChange={(e) => setNewProduct({...newProduct, farmAddress: e.target.value})}
                  required
                />

                <input
                  type="tel"
                  placeholder="Farm Phone"
                  className="p-3 border border-gray-200 rounded-lg bg-white text-gray-800"
                  value={newProduct.farmPhone}
                  onChange={(e) => setNewProduct({...newProduct, farmPhone: e.target.value})}
                  required
                />
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-800 mb-2">Product Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="p-3 border border-gray-200 rounded-lg w-full bg-white text-gray-800"
                    onChange={handleImageUpload}
                  />
                  {newProduct.image && (
                    <div className="mt-4">
                      <img src={newProduct.image} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />
                    </div>
                  )}
                </div>
                <div className="md:col-span-2 flex space-x-4">
                  <button 
                    type="submit" 
                    disabled={addingProduct}
                    className="bg-blue-400 text-white px-6 py-2 rounded-lg hover:bg-blue-500 disabled:opacity-50"
                  >
                    {addingProduct ? 'Adding...' : 'Add Product'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddProduct(false)}
                    className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
            {myProducts.length === 0 ? (
              <p className="col-span-full text-center text-gray-600">No products added yet</p>
            ) : (
              myProducts.map(product => (
                <div key={product._id} className="bg-white border border-gray-200 p-4 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-blue-300 cursor-pointer">
                  {product.image && (
                    <img src={product.image} alt={product.name} className="w-full h-32 object-cover rounded-lg mb-3 transition-transform duration-300 hover:scale-110" />
                  )}
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">{product.name}</h3>
                  <p className="text-gray-600 mb-1 text-sm">Category: {product.category}</p>
                  <p className="text-emerald-500 font-bold mb-2">₹{product.price}/{product.unit}</p>
                  <p className="text-gray-600 mb-3 text-sm">Available: {product.quantity} {product.unit}</p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingProduct(product._id);
                        setEditProduct(product);
                      }}
                      className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this product?')) {
                          products.delete(product._id).then(() => {
                            alert('Product deleted successfully!');
                            loadMyProducts();
                          });
                        }
                      }}
                      className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Edit Product Modal */}
          {editingProduct && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Edit Product</h3>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    await products.update(editingProduct, editProduct);
                    alert('Product updated successfully!');
                    setEditingProduct(null);
                    loadMyProducts();
                  } catch (error) {
                    alert('Error updating product: ' + (error.response?.data?.message || error.message));
                  }
                }} className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Product Name"
                    className="p-3 border border-gray-200 rounded-lg bg-white text-gray-800"
                    value={editProduct.name || ''}
                    onChange={(e) => setEditProduct({...editProduct, name: e.target.value})}
                    required
                  />
                  <select
                    className="p-3 border border-gray-200 rounded-lg bg-white text-gray-800"
                    value={editProduct.category || 'Vegetables'}
                    onChange={(e) => setEditProduct({...editProduct, category: e.target.value})}
                  >
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Grains">Grains</option>
                    <option value="Others">Others</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Price"
                    className="p-3 border border-gray-200 rounded-lg bg-white text-gray-800"
                    value={editProduct.price || ''}
                    onChange={(e) => setEditProduct({...editProduct, price: e.target.value})}
                    required
                  />
                  <input
                    type="number"
                    placeholder="Quantity"
                    className="p-3 border border-gray-200 rounded-lg bg-white text-gray-800"
                    value={editProduct.quantity || ''}
                    onChange={(e) => setEditProduct({...editProduct, quantity: e.target.value})}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Unit (kg, dozen, liters)"
                    className="p-3 border border-gray-200 rounded-lg bg-white text-gray-800"
                    value={editProduct.unit || ''}
                    onChange={(e) => setEditProduct({...editProduct, unit: e.target.value})}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Farm Address"
                    className="p-3 border border-gray-200 rounded-lg bg-white text-gray-800"
                    value={editProduct.farmAddress || ''}
                    onChange={(e) => setEditProduct({...editProduct, farmAddress: e.target.value})}
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Farm Phone"
                    className="p-3 border border-gray-200 rounded-lg bg-white text-gray-800"
                    value={editProduct.farmPhone || ''}
                    onChange={(e) => setEditProduct({...editProduct, farmPhone: e.target.value})}
                    required
                  />
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-800 mb-2">Product Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      className="p-3 border border-gray-200 rounded-lg w-full bg-white text-gray-800"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setEditProduct({...editProduct, image: reader.result});
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    {editProduct.image && (
                      <div className="mt-4">
                        <img src={editProduct.image} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />
                      </div>
                    )}
                  </div>
                  <div className="md:col-span-2 flex space-x-4">
                    <button 
                      type="submit" 
                      className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                    >
                      Update Product
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'earnings' && user.role === 'farmer' && (
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Earnings Dashboard</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Total Earnings</h3>
              <p className="text-3xl font-bold text-emerald-500">₹{earnings.total}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">This Month</h3>
              <p className="text-3xl font-bold text-blue-500">₹{earnings.monthly}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Pending</h3>
              <p className="text-3xl font-bold text-orange-500">₹{earnings.pending}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Recent Orders</h3>
            <div className="space-y-4">
              {orderList.slice(0, 5).map(order => (
                <div key={order._id} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-white">{order.product?.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{order.client?.name} - {order.quantity} units</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-500">₹{order.totalPrice}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{order.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'favorites' && user.role === 'client' && (
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Favorite Products</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
            {favorites.length === 0 ? (
              <p className="col-span-full text-center text-gray-600 dark:text-gray-300">No favorites added yet</p>
            ) : (
              favorites.map(product => (
                <div key={product._id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-blue-300 cursor-pointer">
                  {product.image && (
                    <img src={product.image} alt={product.name} className="w-full h-32 object-cover rounded-lg mb-3 transition-transform duration-300 hover:scale-110" />
                  )}
                  <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white transition-colors duration-300 hover:text-blue-600">{product.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-1 text-sm">Category: {product.category}</p>
                  <p className="text-emerald-500 font-bold mb-2">₹{product.price}/{product.unit}</p>
                  <p className="text-gray-600 dark:text-gray-300 mb-1 text-sm">Available: {product.quantity} {product.unit}</p>
                  <p className="text-gray-600 dark:text-gray-300 mb-1 text-sm">Farm: {product.farmName}</p>
                  <p className="text-gray-600 dark:text-gray-300 mb-3 text-sm">Area: {product.farmAddress}</p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => toggleFavorite(product._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm transform transition-all duration-200 hover:scale-105"
                    >
                      <i className="fas fa-heart-broken"></i> Remove
                    </button>
                    <button
                      onClick={() => {
                        addToCart(product, 1);
                        alert('Added to cart!');
                      }}
                      className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 text-sm transform transition-all duration-200 hover:scale-105"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
            {user.role === 'farmer' ? 'Order Management' : 'My Orders'}
          </h2>
          <div className="space-y-4">
            {orderList && orderList.length > 0 ? orderList.map(order => (
              <div key={order._id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                      {order.product?.name} - {order.quantity} units
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-2">
                      {user.role === 'farmer' ? `Client: ${order.client?.name}` : `Farm: ${order.farmer?.farmName}`}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 mb-2">
                      Phone: {user.role === 'farmer' ? order.client?.phone : order.farmer?.phone}
                    </p>
                    <p className="text-emerald-500 font-bold mb-2">Total: ₹{order.totalPrice}</p>
                    <p className="text-gray-600 dark:text-gray-300">Status: <span className={`font-semibold ${order.status === 'delivered' ? 'text-green-600' : order.status === 'confirmed' ? 'text-blue-600' : order.status === 'cancelled' ? 'text-red-600' : 'text-orange-600'}`}>{order.status}</span></p>
                  </div>
                  <div className="space-x-2">
                    {user.role === 'farmer' && order.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateOrderStatus(order._id, 'confirmed')}
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transform transition-all duration-200 hover:scale-105"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => updateOrderStatus(order._id, 'delivered')}
                          className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600 transform transition-all duration-200 hover:scale-105"
                        >
                          Mark Delivered
                        </button>
                      </>
                    )}
                    {user.role === 'client' && order.status === 'pending' && (
                      <button
                        onClick={() => cancelOrder(order._id)}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transform transition-all duration-200 hover:scale-105"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )) : (
              <p className="text-center text-gray-600 dark:text-gray-300">No orders found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;