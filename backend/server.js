const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const Product = require('./models/Product');
const User = require('./models/User');
const Order = require('./models/Order');

if (!process.env.JWT_SECRET) {
    console.warn('⚠️  WARNING: JWT_SECRET is not defined. Using a default secret for now. PLEASE set this in production/Vercel!');
}

const app = express();

app.use(cors());
app.use(express.json());

// Database connection middleware for serverless/Vercel
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        next(error);
    }
});

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/inquiries', require('./routes/inquiryRoutes'));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    // In local development or if seeding is requested
    const shouldSeed = process.env.NODE_ENV === 'development' || process.env.SEED_DB === 'true';
    
    if (shouldSeed) {
        await connectDB();
        const productCount = await Product.countDocuments();
        if (productCount === 0) {
            console.log('Seeding initial data...');
            const productsData = require('./data/products');
            
            // Admin user
            const adminExists = await User.findOne({ email: 'admin@tailorshop.com' });
            if (!adminExists) {
                await User.create({ 
                    name: 'Admin', 
                    email: 'admin@tailorshop.com', 
                    password: '123456', 
                    role: 'admin' 
                });
            }

            await Product.create(productsData);
            console.log('--- Data Seeded Successfully! ---');
        }
    }

    // Only listen if not on Vercel
    if (!process.env.VERCEL) {
        app.listen(PORT, () => {
            console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
        });
    }
};

startServer();

module.exports = app;

