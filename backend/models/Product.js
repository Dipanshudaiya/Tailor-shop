const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        price: {
            type: Number,
            required: true,
            default: 0,
        },
        discount: {
            type: Number,
            default: 0,
        },
        category: {
            type: String,
            required: true,
            enum: ['men', 'women', 'sarees', 'fabrics'],
        },
        subCategory: {
            type: String,
            required: true,
        },
        brand: {
            type: String,
        },
        image: {
            type: String,
            required: true,
        },
        type: {
            type: String,
        },
        inStock: {
            type: Boolean,
            required: true,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
