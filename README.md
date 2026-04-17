# 🧵 As You Like - Bespoke Tailoring Shop

A premium, full-stack web application for a bespoke tailoring shop. This application allows customers to browse products, place orders, and manage their bespoke tailoring needs.

## 🚀 Features

- **Premium UI/UX**: Modern, responsive design with a dark aesthetic.
- **User Authentication**: Secure login and registration.
- **Product Management**: Browse through various tailoring products like Suits, Shirts, Sarees, and Fabrics.
- **Cart & Orders**: Full shopping cart functionality and order tracking.
- **Admin Dashboard**: Manage products, users, and orders (Admin access required).
- **Custom Inquiries**: Contact the shop for bespoke requirements.

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS (or Vanilla CSS), Framer Motion.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose).
- **Authentication**: JSON Web Tokens (JWT) & Bcrypt.js.
- **Deployment**: Vercel.

## ⚙️ Local Setup

### 1. Prerequisites
- Node.js installed.
- MongoDB installed and running locally OR a MongoDB Atlas URI.

### 2. Installation
Clone the repository and install dependencies:
```bash
# Install root dependencies
npm install

# Install backend and frontend dependencies
npm run install-all
```

### 3. Environment Variables
Create a `.env` file in the `backend` folder:
```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
NODE_ENV=development
```

### 4. Running the App
```bash
# Run both frontend and backend concurrently
npm start
```

## 🌐 Vercel Deployment

To deploy this project on Vercel:

1. **Backend**: Deploy the `backend` folder as a separate project or as a Vercel function. Ensure `MONGO_URI` and `JWT_SECRET` are set in Vercel's Environment Variables.
2. **Frontend**: Deploy the `frontend` folder. The `vercel.json` in the root is configured to handle API rewrites.

### ⚠️ Common Issues & Fixes

#### 1. Login/Register 401 Unauthorized
- **Cause**: Invalid email or password, or the user does not exist in the database.
- **Fix**: Register a new account first. If you are using the default seeded data, try `admin@tailorshop.com` / `123456`.

#### 2. Vercel 500 Internal Server Error
- **Cause**: The backend cannot connect to MongoDB.
- **Fix**: 
    - Ensure `MONGO_URI` in Vercel settings is a **remote** URI (like MongoDB Atlas), not `localhost`.
    - Make sure your MongoDB Atlas IP Access List allows connections from everywhere (`0.0.0.0/0`).
    - Verify that the `JWT_SECRET` is set in Vercel.

## 📄 License
This project is licensed under the MIT License.
