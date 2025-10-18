export const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://farm2home-backend.onrender.com/api' 
  : process.env.REACT_APP_API_URL || 'http://localhost:5002/api';