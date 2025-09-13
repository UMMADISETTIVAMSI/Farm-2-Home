import React, { useState, useEffect } from 'react';

const ThemeToggle = () => {
  const [theme, setTheme] = useState('light');
  const [isOpen, setIsOpen] = useState(false);

  const themes = {
    light: { name: 'Light', icon: 'fas fa-sun' },
    dark: { name: 'Dark', icon: 'fas fa-moon' },
    ocean: { name: 'Ocean', icon: 'fas fa-water' },
    sunset: { name: 'Sunset', icon: 'fas fa-fire' }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (themeName) => {
    const root = document.documentElement;
    
    // Remove all theme classes
    root.className = root.className.replace(/theme-\w+/g, '');
    root.classList.add(`theme-${themeName}`);
    
    // Define comprehensive theme variables
    const themeVars = {
      light: {
        '--bg-primary': 'rgb(239 246 255)', // blue-50
        '--bg-secondary': 'rgb(236 253 245)', // emerald-50  
        '--bg-tertiary': 'rgb(255 251 235)', // amber-50
        '--bg-card': 'rgb(255 255 255)',
        '--text-primary': 'rgb(31 41 55)', // gray-800
        '--text-secondary': 'rgb(75 85 99)', // gray-600
        '--text-accent': 'rgb(16 185 129)', // emerald-500
        '--navbar-bg': 'rgb(248 250 252)', // slate-100
        '--navbar-text': 'rgb(31 41 55)', // gray-800
        '--border-color': 'rgb(229 231 235)', // gray-200
        '--shadow': '0 10px 15px -3px rgb(0 0 0 / 0.1)'
      },
      dark: {
        '--bg-primary': 'rgb(17 24 39)', // gray-900
        '--bg-secondary': 'rgb(30 41 59)', // slate-800
        '--bg-tertiary': 'rgb(55 65 81)', // gray-700
        '--bg-card': 'rgb(31 41 55)', // gray-800
        '--text-primary': 'rgb(243 244 246)', // gray-100
        '--text-secondary': 'rgb(156 163 175)', // gray-400
        '--text-accent': 'rgb(34 197 94)', // green-500
        '--navbar-bg': 'rgb(17 24 39)', // gray-900
        '--navbar-text': 'rgb(243 244 246)', // gray-100
        '--border-color': 'rgb(75 85 99)', // gray-600
        '--shadow': '0 10px 15px -3px rgb(0 0 0 / 0.3)'
      },
      ocean: {
        '--bg-primary': 'rgb(219 234 254)', // blue-100
        '--bg-secondary': 'rgb(207 250 254)', // cyan-50
        '--bg-tertiary': 'rgb(240 253 250)', // teal-50
        '--bg-card': 'rgb(255 255 255)',
        '--text-primary': 'rgb(30 58 138)', // blue-900
        '--text-secondary': 'rgb(75 85 99)', // gray-600
        '--text-accent': 'rgb(6 182 212)', // cyan-500
        '--navbar-bg': 'rgb(147 197 253)', // blue-300
        '--navbar-text': 'rgb(30 58 138)', // blue-900
        '--border-color': 'rgb(191 219 254)', // blue-200
        '--shadow': '0 10px 15px -3px rgb(59 130 246 / 0.2)'
      },
      sunset: {
        '--bg-primary': 'rgb(255 237 213)', // orange-50
        '--bg-secondary': 'rgb(255 251 235)', // amber-50
        '--bg-tertiary': 'rgb(254 249 195)', // yellow-50
        '--bg-card': 'rgb(255 255 255)',
        '--text-primary': 'rgb(154 52 18)', // orange-900
        '--text-secondary': 'rgb(75 85 99)', // gray-600
        '--text-accent': 'rgb(245 101 101)', // orange-400
        '--navbar-bg': 'rgb(254 215 170)', // orange-200
        '--navbar-text': 'rgb(154 52 18)', // orange-900
        '--border-color': 'rgb(254 215 170)', // orange-200
        '--shadow': '0 10px 15px -3px rgb(249 115 22 / 0.2)'
      }
    };

    // Apply CSS variables
    const vars = themeVars[themeName];
    Object.entries(vars).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
  };

  const changeTheme = (themeName) => {
    setTheme(themeName);
    localStorage.setItem('theme', themeName);
    applyTheme(themeName);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-3 py-2 rounded-full hover:bg-gray-200 transition-all duration-200"
        style={{ color: 'var(--navbar-text)' }}
      >
        <i className={`${themes[theme].icon} mr-2`}></i>
        <span className="hidden md:inline">Theme</span>
        <i className="fas fa-chevron-down ml-2 text-xs"></i>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border z-50">
          {Object.entries(themes).map(([key, themeData]) => (
            <button
              key={key}
              onClick={() => changeTheme(key)}
              className={`w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 ${
                theme === key ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
              } first:rounded-t-lg last:rounded-b-lg`}
            >
              <i className={`${themeData.icon} mr-3 w-4`}></i>
              <span>{themeData.name}</span>
              {theme === key && <i className="fas fa-check ml-auto text-blue-600"></i>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThemeToggle;