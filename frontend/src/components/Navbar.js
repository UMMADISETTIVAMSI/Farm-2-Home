import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const Navbar = ({ user, logout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-xl fixed w-full top-0 z-50 transition-colors duration-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white hover:opacity-80 transition-all duration-200">
            <i className="fas fa-leaf mr-2"></i>Farm2Home
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <Link to="/dashboard" className="flex items-center px-4 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 text-gray-800 dark:text-white">
                  <i className="fas fa-tachometer-alt mr-2"></i>Dashboard
                </Link>
                <Link to="/profile" className="flex items-center px-4 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 text-gray-800 dark:text-white">
                  <i className="fas fa-user mr-2"></i>Profile
                </Link>
                <button onClick={toggleTheme} className="flex items-center px-4 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 text-gray-800 dark:text-white">
                  <i className={`fas ${isDark ? 'fa-sun' : 'fa-moon'} mr-2`}></i>{isDark ? 'Light' : 'Dark'}
                </button>
                <button onClick={logout} className="flex items-center px-4 py-2 bg-red-500 hover:bg-red-600 rounded-full transition-all duration-200 shadow-lg text-white">
                  <i className="fas fa-sign-out-alt mr-2"></i>Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="flex items-center px-6 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 text-gray-800 dark:text-white">
                  <i className="fas fa-sign-in-alt mr-2"></i>Login
                </Link>
                <button onClick={toggleTheme} className="flex items-center px-4 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 text-gray-800 dark:text-white">
                  <i className={`fas ${isDark ? 'fa-sun' : 'fa-moon'} mr-2`}></i>{isDark ? 'Light' : 'Dark'}
                </button>
                <Link to="/register" className="flex items-center px-6 py-2 bg-emerald-400 text-white rounded-full hover:bg-emerald-500 transition-all duration-200 shadow-lg font-semibold">
                  <i className="fas fa-user-plus mr-2"></i>Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'} text-xl text-gray-800 dark:text-white`}></i>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col space-y-3 pt-4">
              {user ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className="flex items-center px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 text-gray-800 dark:text-white"
                    onClick={() => setIsOpen(false)}
                  >
                    <i className="fas fa-tachometer-alt mr-3"></i>Dashboard
                  </Link>
                  <Link 
                    to="/profile" 
                    className="flex items-center px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 text-gray-800 dark:text-white"
                    onClick={() => setIsOpen(false)}
                  >
                    <i className="fas fa-user mr-3"></i>Profile
                  </Link>
                  <button 
                    onClick={() => { toggleTheme(); setIsOpen(false); }} 
                    className="flex items-center px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 text-gray-800 dark:text-white w-full text-left"
                  >
                    <i className={`fas ${isDark ? 'fa-sun' : 'fa-moon'} mr-3`}></i>{isDark ? 'Light Mode' : 'Dark Mode'}
                  </button>
                  <button 
                    onClick={() => { logout(); setIsOpen(false); }} 
                    className="flex items-center px-4 py-3 bg-red-500 hover:bg-red-600 rounded-lg transition-all duration-200 text-white w-full text-left"
                  >
                    <i className="fas fa-sign-out-alt mr-3"></i>Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="flex items-center px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 text-gray-800 dark:text-white"
                    onClick={() => setIsOpen(false)}
                  >
                    <i className="fas fa-sign-in-alt mr-3"></i>Login
                  </Link>
                  <button 
                    onClick={() => { toggleTheme(); setIsOpen(false); }} 
                    className="flex items-center px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 text-gray-800 dark:text-white w-full text-left"
                  >
                    <i className={`fas ${isDark ? 'fa-sun' : 'fa-moon'} mr-3`}></i>{isDark ? 'Light Mode' : 'Dark Mode'}
                  </button>
                  <Link 
                    to="/register" 
                    className="flex items-center px-4 py-3 bg-emerald-400 text-white rounded-lg hover:bg-emerald-500 transition-all duration-200 font-semibold"
                    onClick={() => setIsOpen(false)}
                  >
                    <i className="fas fa-user-plus mr-3"></i>Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;