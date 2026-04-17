const axios = require('axios');

const testAddProduct = async () => {
    try {
        const response = await axios.post('http://localhost:5000/api/products', {
            name: 'Test Product',
            price: 1000,
            description: 'Test description',
            image: 'https://via.placeholder.com/150',
            category: 'men',
            subCategory: 'shirt'
        });
        console.log('Success:', response.status);
    } catch (error) {
        console.error('Error:', error.response ? error.response.status : error.message);
        console.error('Data:', error.response ? error.response.data : '');
    }
};

testAddProduct();
