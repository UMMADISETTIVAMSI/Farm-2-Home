import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../utils/api';

const Register = ({ setUser }) => {
  const [formData, setFormData] = useState({
    name: '', username: '', email: '', password: '', role: 'client', phone: '', address: '', farmName: ''
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await auth.register(formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user);
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Name</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Username</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              className="w-full p-3 border rounded-lg"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value.trim()})}
              autoComplete="email"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck="false"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full p-3 border rounded-lg pr-12"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️🗨️'}
              </button>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Role</label>
            <select
              className="w-full p-3 border rounded-lg"
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            >
              <option value="client">Client</option>
              <option value="farmer">Farmer</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              className="w-full p-3 border rounded-lg"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Address</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
            />
          </div>

          {formData.role === 'farmer' && (
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Farm Name</label>
              <input
                type="text"
                className="w-full p-3 border rounded-lg"
                value={formData.farmName}
                onChange={(e) => setFormData({...formData, farmName: e.target.value})}
              />
            </div>
          )}
          <button type="submit" className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700">
            Register
          </button>
        </form>
        <p className="text-center mt-4">
          Already have an account? <Link to="/login" className="text-green-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;