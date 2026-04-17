const Inquiry = require('../models/Inquiry');

// Simple async handler to avoid external dependency
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// @desc    Create a new inquiry
// @route   POST /api/inquiries
// @access  Public
const createInquiry = asyncHandler(async (req, res) => {
    const { name, email, mobile, message, type, category } = req.body;

    const inquiry = await Inquiry.create({
        name,
        email,
        mobile,
        message,
        type,
        category: category || 'none',
    });

    if (inquiry) {
        res.status(201).json(inquiry);
    } else {
        res.status(400);
        throw new Error('Invalid inquiry data');
    }
});

// @desc    Get all inquiries
// @route   GET /api/inquiries
// @access  Private/Admin
const getInquiries = asyncHandler(async (req, res) => {
    const inquiries = await Inquiry.find({}).sort({ createdAt: -1 });
    res.json(inquiries);
});

// @desc    Update inquiry status
// @route   PUT /api/inquiries/:id
// @access  Private/Admin
const updateInquiryStatus = asyncHandler(async (req, res) => {
    const inquiry = await Inquiry.findById(req.params.id);

    if (inquiry) {
        inquiry.status = req.body.status || inquiry.status;
        const updatedInquiry = await inquiry.save();
        res.json(updatedInquiry);
    } else {
        res.status(404);
        throw new Error('Inquiry not found');
    }
});

// @desc    Delete inquiry
// @route   DELETE /api/inquiries/:id
// @access  Private/Admin
const deleteInquiry = asyncHandler(async (req, res) => {
    const inquiry = await Inquiry.findById(req.params.id);

    if (inquiry) {
        await inquiry.deleteOne();
        res.json({ message: 'Inquiry removed' });
    } else {
        res.status(404);
        throw new Error('Inquiry not found');
    }
});

module.exports = {
    createInquiry,
    getInquiries,
    updateInquiryStatus,
    deleteInquiry,
};
