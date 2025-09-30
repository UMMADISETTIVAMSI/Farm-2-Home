import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ user, logout }) => {
  return (
    <nav className="bg-white shadow-xl fixed w-full top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-gray-800 hover:opacity-80 hover:scale-105 transition-all duration-200">
            <i className="fas fa-leaf mr-2"></i>Farm2Home
          </Link>
          <div className="flex items-center space-x-6">
            {user ? (
              <>
                <Link to="/dashboard" className="flex items-center px-4 py-2 rounded-full hover:bg-gray-100 transition-all duration-200 hover:scale-105 text-gray-800">
                  <i className="fas fa-tachometer-alt mr-2"></i>Dashboard
                </Link>
                <Link to="/profile" className="flex items-center px-4 py-2 rounded-full hover:bg-gray-100 transition-all duration-200 hover:scale-105 text-gray-800">
                  <i className="fas fa-user mr-2"></i>Profile
                </Link>
                <button onClick={logout} className="flex items-center px-4 py-2 bg-red-500 hover:bg-red-600 rounded-full transition-all duration-200 hover:scale-105 shadow-lg text-white">
                  <i className="fas fa-sign-out-alt mr-2"></i>Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="flex items-center px-6 py-2 border-2 border-gray-200 rounded-full hover:bg-gray-100 transition-all duration-200 hover:scale-105 text-gray-800">
                  <i className="fas fa-sign-in-alt mr-2"></i>Login
                </Link>
                <Link to="/register" className="flex items-center px-6 py-2 bg-emerald-400 text-white rounded-full hover:bg-emerald-500 transition-all duration-200 hover:scale-105 shadow-lg font-semibold">
                  <i className="fas fa-user-plus mr-2"></i>Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;