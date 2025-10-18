# Render Deployment Guide

## Backend Deployment

1. **Create Render Account**: Go to https://render.com and sign up

2. **Deploy Backend**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `backend` folder
   - Configure:
     - Name: `farm2home-backend`
     - Environment: `Node`
     - Build Command: `npm install`
     - Start Command: `npm start`
     - Instance Type: `Free`

3. **Environment Variables**:
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: `mongodb+srv://farm2homefsd_db_user:vamsi1234@farm.jhmt7ll.mongodb.net/?retryWrites=true&w=majority&appName=farm`
   - `JWT_SECRET`: `farm2home_secret_key_2024`

## Frontend Deployment

1. **Deploy Frontend**:
   - Click "New +" → "Static Site"
   - Connect your GitHub repository
   - Select the `frontend` folder
   - Configure:
     - Name: `farm2home-frontend`
     - Build Command: `npm run build`
     - Publish Directory: `build`

2. **Environment Variables**:
   - `REACT_APP_API_URL`: `https://farm2home-backend.onrender.com/api`

## Post-Deployment

1. Update the backend URL in frontend config if different
2. Test all functionality
3. Monitor logs for any issues

## URLs
- Backend: `https://farm2home-backend.onrender.com`
- Frontend: `https://farm2home-frontend.onrender.com`