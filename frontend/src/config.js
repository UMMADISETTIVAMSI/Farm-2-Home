export const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://crop2door-backend1.onrender.com/api' 
  : process.env.REACT_APP_API_URL || 'http://localhost:5002/api';