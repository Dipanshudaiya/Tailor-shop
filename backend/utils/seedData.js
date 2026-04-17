const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');
const connectDB = require('../config/db');

dotenv.config();
connectDB();

const importData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();
        await Category.deleteMany();

        // Admin User
        const adminUser = await User.create({
            name: 'Admin User',
            email: 'admin@tailorshop.com',
            password: '123456', // Will be hashed by pre-save hook
            role: 'admin',
        });

        // Demo Products
        const products = [
            // MEN'S WEAR
            {
                name: 'Classic White Linen Shirt',
                price: 2500,
                description: 'Premium Italian linen shirt, tailored for summer elegance.',
                image: 'https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?auto=format&fit=crop&q=80&w=800',
                category: 'men',
                subCategory: 'shirt',
                inStock: true,
            },
            {
                name: 'Midnight Blue Tuxedo',
                price: 18500,
                description: 'Bespoke midnight blue tuxedo with satin lapels for your special night.',
                image: 'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?auto=format&fit=crop&q=80&w=800',
                category: 'men',
                subCategory: 'suit',
                inStock: true,
            },
            {
                name: 'Charcoal Grey Trousers',
                price: 3200,
                description: 'Tailored fit worsted wool trousers with a flat front.',
                image: 'https://images.unsplash.com/photo-1624378439575-d1ead6bb17f8?auto=format&fit=crop&q=80&w=800',
                category: 'men',
                subCategory: 'pant',
                inStock: true,
            },
            {
                name: 'Royal Heritage Sherwani',
                price: 24000,
                description: 'Hand-embroidered silk sherwani for grooms, crafted with precision.',
                image: 'https://images.unsplash.com/photo-1594932224828-b4b059b6f6f9?auto=format&fit=crop&q=80&w=800',
                category: 'men',
                subCategory: 'sherwani',
                inStock: true,
            },
            {
                name: 'Tweed Winter Jacket',
                price: 8500,
                description: 'Classic British style tweed jacket, perfect for the cold breeze.',
                image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800',
                category: 'men',
                subCategory: 'jacket',
                inStock: true,
            },

            // WOMEN'S WEAR
            {
                name: 'Designer Emerald Kurti',
                price: 3500,
                description: 'Modern long emerald kurti with subtle sequence work.',
                image: 'https://images.unsplash.com/photo-1609357605151-518296a86f7b?auto=format&fit=crop&q=80&w=800',
                category: 'women',
                subCategory: 'kurti',
                inStock: true,
            },
            {
                name: 'Bridal Velvet Lehenga',
                price: 45000,
                description: 'Heavy zardosi work maroon velvet lehenga choli set.',
                image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=800',
                category: 'women',
                subCategory: 'lehenga',
                inStock: true,
            },
            {
                name: 'Silk Brocade Blouse',
                price: 4500,
                description: 'Custom fitted v-neck blouse made from pure Benarasi brocade.',
                image: 'https://images.unsplash.com/photo-1621184414184-0138c23053a5?auto=format&fit=crop&q=80&w=800',
                category: 'women',
                subCategory: 'blouse',
                inStock: true,
            },
            {
                name: 'Floral Chiffon Gown',
                price: 12000,
                description: 'A flowing, elegant floor-length gown with hand-painted florals.',
                image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=800',
                category: 'women',
                subCategory: 'gown',
                inStock: true,
            },
            {
                name: 'Office Wear A-Line Dress',
                price: 5500,
                description: 'Structured corporate dress tailored for ultimate comfort.',
                image: 'https://images.unsplash.com/photo-1539008835270-3013666740ea?auto=format&fit=crop&q=80&w=800',
                category: 'women',
                subCategory: 'dress',
                inStock: true,
            },

            // SAREES
            {
                name: 'Authentic Kanchipuram Silk',
                price: 28000,
                description: 'Pure Kanchipuram silk saree with pure gold zari temple borders.',
                image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800',
                category: 'sarees',
                subCategory: 'saree',
                type: 'Silk',
                inStock: true,
            },
            {
                name: 'Banarasi Georgette Saree',
                price: 15500,
                description: 'Lightweight Banarasi weave on pure georgette fabric.',
                image: 'https://images.unsplash.com/photo-1583391733959-f1830636f8da?auto=format&fit=crop&q=80&w=800',
                category: 'sarees',
                subCategory: 'saree',
                type: 'Georgette',
                inStock: true,
            },
            {
                name: 'Pearl Embroidered Net Saree',
                price: 18000,
                description: 'Pastel net saree with intricate pearl and crystal embellishments.',
                image: 'https://images.unsplash.com/photo-1596484552834-6a58f850b0ff?auto=format&fit=crop&q=80&w=800',
                category: 'sarees',
                subCategory: 'saree',
                type: 'Net',
                inStock: true,
            },
            {
                name: 'Classic Cotton Jamdani',
                price: 6500,
                description: 'Comfortable handwoven Jamdani cotton saree for everyday grace.',
                image: 'https://images.unsplash.com/photo-1610030097720-30ad4daea141?auto=format&fit=crop&q=80&w=800',
                category: 'sarees',
                subCategory: 'saree',
                type: 'Cotton',
                inStock: true,
            },

            // FABRICS
            {
                name: 'Raymond Super 120s Wool',
                price: 3500,
                description: 'Imported superfine merino wool fabric for premium suits. Price per meter.',
                image: 'https://images.unsplash.com/photo-1528459801416-a7e93884e1bb?auto=format&fit=crop&q=80&w=800',
                category: 'fabrics',
                subCategory: 'fabric',
                brand: 'Raymond',
                inStock: true,
            },
            {
                name: 'Siyaram Royal Linen',
                price: 1200,
                description: 'Breathable pure natural linen fabric, ideal for kurtas and shirts.',
                image: 'https://images.unsplash.com/photo-1605051419409-77a8ece64e03?auto=format&fit=crop&q=80&w=800',
                category: 'fabrics',
                subCategory: 'fabric',
                brand: 'Siyaram',
                inStock: true,
            },
            {
                name: 'Italian Silk Velvet',
                price: 5200,
                description: 'Ultra-soft deep black velvet sourced from Italy. Price per meter.',
                image: 'https://images.unsplash.com/photo-1579847188804-9107fd88358e?auto=format&fit=crop&q=80&w=800',
                category: 'fabrics',
                subCategory: 'fabric',
                brand: 'Imported',
                inStock: true,
            },
            {
                name: 'Oswal Winter Cashmere',
                price: 8500,
                description: 'Luxurious 100% pure cashmere fabric for overcoats.',
                image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=800',
                category: 'fabrics',
                subCategory: 'fabric',
                brand: 'Oswal',
                inStock: true,
            }
        ];

        const createdProducts = await Product.insertMany(products);

        // Demo User for orders
        const demoUser = await User.create({
            name: 'Demo User',
            email: 'demo@example.com',
            password: 'password123',
            role: 'user',
        });

        // Demo Orders
        const demoOrders = [
            {
                user: demoUser._id,
                items: [
                    { name: createdProducts[0].name, qty: 1, image: createdProducts[0].image, price: createdProducts[0].price, product: createdProducts[0]._id },
                    { name: createdProducts[2].name, qty: 1, image: createdProducts[2].image, price: createdProducts[2].price, product: createdProducts[2]._id },
                ],
                shippingAddress: { street: '123 Tailor Lane', city: 'Mumbai', state: 'Maharashtra', zip: '400001', phone: '9876543210' },
                paymentMethod: 'cod',
                totalPrice: createdProducts[0].price + createdProducts[2].price,
                paymentStatus: 'cod',
                status: 'confirmed',
            },
            {
                user: demoUser._id,
                items: [
                    { name: createdProducts[1].name, qty: 1, image: createdProducts[1].image, price: createdProducts[1].price, product: createdProducts[1]._id },
                ],
                shippingAddress: { street: '456 Bespoke Blvd', city: 'Delhi', state: 'Delhi', zip: '110001', phone: '9988776655' },
                paymentMethod: 'upi',
                totalPrice: createdProducts[1].price,
                paymentStatus: 'paid',
                status: 'pending',
            },
            {
                user: demoUser._id,
                items: [
                    { name: createdProducts[10].name, qty: 1, image: createdProducts[10].image, price: createdProducts[10].price, product: createdProducts[10]._id },
                ],
                shippingAddress: { street: '789 Silk Street', city: 'Bangalore', state: 'Karnataka', zip: '560001', phone: '9123456789' },
                paymentMethod: 'card',
                totalPrice: createdProducts[10].price,
                paymentStatus: 'unpaid',
                status: 'pending',
            }
        ];

        await Order.insertMany(demoOrders);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
