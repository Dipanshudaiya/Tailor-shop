const Order = require('../models/Order');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
    const { items, shippingAddress, paymentMethod, totalPrice } = req.body;

    if (items && items.length === 0) {
        res.status(400);
        throw new Error('No order items');
    } else {
        // Auto-set paymentStatus based on method
        let paymentStatus = 'unpaid';
        if (paymentMethod === 'upi' || paymentMethod === 'card') {
            paymentStatus = 'paid';
        }

        const order = new Order({
            items,
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            totalPrice,
            paymentStatus,
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
        res.json(order);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name email');
    res.json(orders);
};

// @desc    Update order to delivered/status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.status = req.body.status || order.status;
        if (req.body.paymentStatus) {
            order.paymentStatus = req.body.paymentStatus;
        }
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
};

// @desc    Delete an order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrder = async (req, res) => {
    try {
        console.log('Attempting to delete order:', req.params.id);
        const order = await Order.findByIdAndDelete(req.params.id);

        if (order) {
            console.log('Order deleted successfully');
            res.json({ message: 'Order removed' });
        } else {
            console.warn('Order not found for deletion');
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error('Delete Order Error:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addOrderItems,
    getOrderById,
    getMyOrders,
    getOrders,
    updateOrderStatus,
    deleteOrder,
};
