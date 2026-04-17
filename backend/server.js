const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const Product = require('./models/Product');
const User = require('./models/User');
const Order = require('./models/Order');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

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
    await connectDB();
    
    // Seed data ONLY in development and if explicitly requested or if DB is empty
    if (process.env.NODE_ENV === 'development') {
        const productCount = await Product.countDocuments();
        if (productCount === 0) {
            console.log('Seeding initial data...');
            const productsData = require('./data/products');
            
            // Admin user
            await User.create({ 
                name: 'Admin', 
                email: 'admin@tailorshop.com', 
                password: '123456', 
                role: 'admin' 
            });

            await Product.create(productsData);
            console.log('--- Data Seeded Successfully! ---');
        }
    }

    app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
};

startServer();
