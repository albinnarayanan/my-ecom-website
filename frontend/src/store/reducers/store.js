import {configureStore} from '@reduxjs/toolkit';
import { productReducer } from './ProductReducers';
import { errorReducer } from './ErrorReducer';
import { cartReducer } from './cartReducer';
import { authReducer } from './authReducer';
import { paymentMethodReducer } from './paymentMethodReducer';
import { adminReducer } from './adminReducer';
import { orderReducer } from './orderReducer';
import { sellerReducer } from './sellerReducer';


const cartItems = localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [];

const selectUserCheckoutAddress = localStorage.getItem("CHECKOUT_ADDRESS")
    ? JSON.parse(localStorage.getItem("CHECKOUT_ADDRESS"))
    : [];

const user = localStorage.getItem("auth")
    ? JSON.parse(localStorage.getItem("auth"))
    : null;

const initialState = {
    products :{
        products: JSON.parse(localStorage.getItem("products")) || [],
    },
    carts : {
        cart:cartItems
    },
    auth:{
        user: user,
        selectUserCheckoutAddress
    },
    
};

const Store = configureStore({
    reducer: {
        products: productReducer,
        errors: errorReducer,
        carts:cartReducer,
        auth:authReducer,
        payment: paymentMethodReducer,
        admin: adminReducer,
        order: orderReducer,
        seller:sellerReducer,

        
    },
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // skip deep checking of the large products array
                ignoredPaths: ['products.products'],
            },
            immutableCheck: {
                // skip immutable check for the same path to avoid heavy traversal
                ignoredPaths: ['products.products'],
            },
        }),
    devTools: process.env.NODE_ENV !== 'production',
});
export default Store;