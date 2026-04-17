const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const checkProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const count = await Product.countDocuments();
        console.log(`Total products: ${count}`);
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkProducts();
