import { configureStore } from '@reduxjs/toolkit'; 
import ThemeReducer from './theme/index.js';
import AuthReducer from './auth/index.js';
import BlogReducer from './blog/index.js';
const store = configureStore({
    reducer: {
        theme : ThemeReducer,
        auth: AuthReducer,
        blog: BlogReducer
    }, 
}) 



export default store;