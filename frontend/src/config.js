export const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-url.herokuapp.com/api' 
  : process.env.REACT_APP_API_URL || 'http://localhost:5001/api';