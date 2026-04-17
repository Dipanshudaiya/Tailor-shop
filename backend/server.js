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
    const conn = await connectDB();
    
    // Seed if products are empty
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
        console.log('Seeding initial data...');


        const productsData = require('./data/products');
        
        // Admin user
        const admin = await User.create({ 
            name: 'Admin', 
            email: 'admin@tailorshop.com', 
            password: '123456', 
            role: 'admin' 
        });

        // Demo user
        const demoUser = await User.create({ 
            name: 'Demo User', 
            email: 'user@example.com', 
            password: '123456', 
            role: 'user' 
        });

        // Create Products
        const createdProducts = await Product.create(productsData);
        
        // Create Mock Orders
        await Order.create([
            {
                user: demoUser._id,
                items: [
                    { name: 'Classic White Linen Shirt', qty: 1, price: 2500, image: createdProducts[0].image, product: createdProducts[0]._id },
                ],
                shippingAddress: { 
                    street: '123 Tailor Lane', 
                    city: 'Mumbai', 
                    state: 'Maharashtra', 
                    zip: '400001', 
                    phone: '9876543210' 
                },
                paymentMethod: 'PayPal',
                totalPrice: 2500,
                status: 'delivered'
            },
            {
                user: demoUser._id,
                items: [
                    { name: 'Midnight Blue Tuxedo', qty: 1, price: 18500, image: createdProducts[1].image, product: createdProducts[1]._id },
                ],
                shippingAddress: { 
                    street: '456 Fashion St', 
                    city: 'Delhi', 
                    state: 'Delhi', 
                    zip: '110001', 
                    phone: '9876543211' 
                },
                paymentMethod: 'Razorpay',
                totalPrice: 18500,
                status: 'pending'
            },
            {
                user: demoUser._id,
                items: [
                    { name: 'Authentic Kanchipuram Silk', qty: 1, price: 28000, image: createdProducts[10].image, product: createdProducts[10]._id },
                ],
                shippingAddress: { 
                    street: '789 Saree Mall', 
                    city: 'Chennai', 
                    state: 'Tamil Nadu', 
                    zip: '600001', 
                    phone: '9876543212' 
                },
                paymentMethod: 'Razorpay',
                totalPrice: 28000,
                status: 'confirmed'
            }
        ]);
        
        console.log('--- Data Refresh Successful! ---');
    }

    app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
};

startServer();
