const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const productsData = require('./data/products');

dotenv.config();

const fixImages = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB for image cleanup');

        const products = await Product.find({});
        console.log(`Found ${products.length} products to check.`);

        let updatedCount = 0;

        for (const product of products) {
            // Find matching product data by name to get the correct Unsplash image
            const matchingData = productsData.find(d => d.name === product.name);
            
            if (matchingData && product.image !== matchingData.image) {
                console.log(`Updating image for: ${product.name}`);
                product.image = matchingData.image;
                await product.save();
                updatedCount++;
            } else if (!matchingData && (product.image.includes('pinimg.com') || product.image.includes('bing.com'))) {
                // Fallback for custom products that might have pinimg
                console.log(`Removing Pinterest link from unknown product: ${product.name}`);
                product.image = 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=800'; // Default fashion placeholder
                await product.save();
                updatedCount++;
            }
        }

        console.log(`--- Cleanup Finished! Updated ${updatedCount} products. ---`);
        process.exit();
    } catch (error) {
        console.error(`❌ Error during cleanup: ${error.message}`);
        process.exit(1);
    }
};

fixImages();
