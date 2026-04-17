import { create } from 'zustand';

const useCartStore = create((set, get) => ({
    items: (JSON.parse(localStorage.getItem('cartItems')) || []).filter(item => item && item.product),

    addItem: (product, qty = 1) => {
        const items = get().items;
        // The product ID could be in ._id (raw product) or .product (existing cart item)
        const productId = product._id || product.product;
        
        if (!productId) return;

        const existItem = items.find((x) => x.product === productId);

        const cartItem = {
            product: productId,
            name: product.name,
            image: product.image,
            price: Number(product.price),
            discount: Number(product.discount || 0),
            category: product.category,
            subCategory: product.subCategory,
            qty
        };

        let newItems;
        if (existItem) {
            newItems = items.map((x) =>
                x.product === existItem.product ? cartItem : x
            );
        } else {
            newItems = [...items, cartItem];
        }

        localStorage.setItem('cartItems', JSON.stringify(newItems));
        set({ items: newItems });
    },

    removeItem: (id) => {
        const newItems = get().items.filter((x) => x.product !== id);
        localStorage.setItem('cartItems', JSON.stringify(newItems));
        set({ items: newItems });
    },

    clearCart: () => {
        localStorage.removeItem('cartItems');
        set({ items: [] });
    },

    getSubtotal: () => {
        return get().items.reduce((acc, item) => acc + item.price * item.qty, 0);
    },

    getDiscountTotal: () => {
        return get().items.reduce((acc, item) => {
            const discountAmount = (item.price * item.discount) / 100;
            return acc + discountAmount * item.qty;
        }, 0);
    },

    getTotalPrice: () => {
        return get().items.reduce((acc, item) => {
            const discountedPrice = item.price * (1 - item.discount / 100);
            return acc + Math.floor(discountedPrice) * item.qty;
        }, 0);
    },
}));

export default useCartStore;
