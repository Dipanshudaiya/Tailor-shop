import api from './api';

const orderService = {
    createOrder: (order) => api.post('/orders', order),
    getOrderById: (id) => api.get(`/orders/${id}`),
    getMyOrders: () => api.get('/orders/myorders'),
    getOrders: () => api.get('/orders'),
    updateOrderStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
    updatePaymentStatus: (id, paymentStatus) => api.put(`/orders/${id}/status`, { paymentStatus }),
    deleteOrder: (id) => api.delete(`/orders/${id}`),
};

export default orderService;
