import api from './api';

const userService = {
    getUsers: () => api.get('/users'),
    deleteUser: (id) => api.delete(`/users/${id}`),
};

export default userService;
