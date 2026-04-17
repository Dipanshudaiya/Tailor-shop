import api from './api';

const inquiryService = {
    createInquiry: (data) => api.post('/inquiries', data),
    getInquiries: () => api.get('/inquiries'),
    updateInquiryStatus: (id, status) => api.put(`/inquiries/${id}`, { status }),
    deleteInquiry: (id) => api.delete(`/inquiries/${id}`),
};

export default inquiryService;
