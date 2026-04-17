const mongoose = require('mongoose');

const inquirySchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
        },
        mobile: {
            type: String,
            required: true,
        },
        message: {
            type: String,
        },
        type: {
            type: String,
            required: true,
            enum: ['consultation', 'fitting', 'enquiry', 'advice', 'contact', 'newsletter' ],
        },
        category: {
            type: String,
            required: true,
            default: 'none',
            enum: ['men', 'women', 'sarees', 'fabrics', 'none'],
        },
        status: {
            type: String,
            required: true,
            default: 'pending',
            enum: ['pending', 'read', 'archived'],
        },
    },
    {
        timestamps: true,
    }
);

const Inquiry = mongoose.model('Inquiry', inquirySchema);

module.exports = Inquiry;
