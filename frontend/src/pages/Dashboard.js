import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { products, orders } from '../utils/api';

const Dashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState(user.role === 'farmer' ? 'products' : 'browse');
  const [productList, setProductList] = useState([]);
  const [myProducts, setMyProducts] = useState([]);
  const [orderList, setOrderList] = useState([]);
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

  useEffect(() => {
    if (activeTab === 'browse') {
      setCurrentPage(1);
      loadProducts(1);
    }
    if (activeTab === 'products') loadMyProducts();
    if (activeTab === 'orders') loadOrders();
  }, [activeTab]);

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
      
      const response = await products.getAll(params);
      setProductList(response.data.products);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.page);
    } catch (error) {
      console.error('Error loading products:', error);
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
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard - {user.name}</h1>
      
      <div className="flex space-x-4 mb-6">
        {user.role === 'client' && (
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-4 py-2 rounded transition-colors ${activeTab === 'browse' ? 'bg-blue-400 text-white' : 'bg-white border border-gray-200 text-gray-800'}`}
          >
            Browse Products
          </button>
        )}
        {user.role === 'farmer' && (
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded transition-colors ${activeTab === 'products' ? 'bg-blue-400 text-white' : 'bg-white border border-gray-200 text-gray-800'}`}
          >
            My Products
          </button>
        )}
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded transition-colors ${activeTab === 'orders' ? 'bg-blue-400 text-white' : 'bg-white border border-gray-200 text-gray-800'}`}
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
              className="flex-1 p-3 border border-gray-200 rounded-lg bg-white text-gray-800"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select
              className="p-3 border border-gray-200 rounded-lg bg-white text-gray-800"
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
              <p className="mt-2 text-gray-600">Loading products...</p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                {productList.length === 0 ? (
                  <p className="col-span-full text-center text-gray-600">No products available</p>
                ) : (
                  productList.map(product => (
                    <div key={product._id} className="bg-white border border-gray-200 p-4 rounded-lg shadow-lg">
                      {product.image && (
                        <img src={product.image} alt={product.name} className="w-full h-32 object-cover rounded-lg mb-3" />
                      )}
                      <h3 className="text-lg font-semibold mb-2 text-gray-800">{product.name}</h3>
                      <p className="text-gray-600 mb-1 text-sm">Category: {product.category}</p>
                      <p className="text-emerald-500 font-bold mb-2">₹{product.price}/{product.unit}</p>
                      <p className="text-gray-600 mb-1 text-sm">Available: {product.quantity} {product.unit}</p>
                      <p className="text-gray-600 mb-1 text-sm">Farm: {product.farmName}</p>
                      <p className="text-gray-600 mb-1 text-sm">Area: {product.farmAddress}</p>
                      <p className="text-gray-600 mb-3 text-sm">Phone: {product.farmPhone}</p>
                      <div className="flex space-x-2">
                        <input
                          type="number"
                          min="1"
                          max={product.quantity}
                          placeholder="Qty"
                          className="w-16 p-2 border border-gray-200 rounded text-sm bg-white text-gray-800"
                          id={`qty-${product._id}`}
                        />
                        <button
                          onClick={() => {
                            const qty = document.getElementById(`qty-${product._id}`).value;
                            if (qty) handleOrder(product._id, qty);
                          }}
                          className="bg-emerald-400 text-white px-3 py-2 rounded hover:bg-emerald-500 text-sm"
                        >
                          Order
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
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
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
                <div key={product._id} className="bg-white border border-gray-200 p-4 rounded-lg shadow-lg">
                  {product.image && (
                    <img src={product.image} alt={product.name} className="w-full h-32 object-cover rounded-lg mb-3" />
                  )}
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">{product.name}</h3>
                  <p className="text-gray-600 mb-1 text-sm">Category: {product.category}</p>
                  <p className="text-emerald-500 font-bold mb-2">₹{product.price}/{product.unit}</p>
                  <p className="text-gray-600 mb-3 text-sm">Available: {product.quantity} {product.unit}</p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => products.delete(product._id).then(loadMyProducts)}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
                    >
                      Delete
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
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            {user.role === 'farmer' ? 'Incoming Orders' : 'My Orders'}
          </h2>
          <div className="space-y-4">
            {orderList.map(order => (
              <div key={order._id} className="bg-white border border-gray-200 p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">
                      {order.product?.name} - {order.quantity} units
                    </h3>
                    <p className="text-gray-600 mb-2">
                      {user.role === 'farmer' ? `Client: ${order.client?.name}` : `Farm: ${order.farmer?.farmName}`}
                    </p>
                    <p className="text-gray-600 mb-2">
                      Phone: {user.role === 'farmer' ? order.client?.phone : order.farmer?.phone}
                    </p>
                    <p className="text-emerald-500 font-bold mb-2">Total: ₹{order.totalPrice}</p>
                    <p className="text-gray-600">Status: {order.status}</p>
                  </div>
                  <div className="space-x-2">
                    {user.role === 'farmer' && order.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateOrderStatus(order._id, 'confirmed')}
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => updateOrderStatus(order._id, 'delivered')}
                          className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-500"
                        >
                          Mark Delivered
                        </button>
                      </>
                    )}
                    {user.role === 'client' && order.status === 'pending' && (
                      <button
                        onClick={() => cancelOrder(order._id)}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;