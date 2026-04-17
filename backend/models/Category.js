const mongoose = require('mongoose');

const categorySchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        parent: {
            type: String,
            required: true,
            enum: ['men', 'women', 'general'],
        },
        image: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
