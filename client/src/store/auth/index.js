import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'; 
import axios from '../../utils/Axios';

const initialState = {
    user: null,
    isLoading: true,
    error: null,
} 
export const checkAuth = createAsyncThunk(
    'auth/checkAuth',
    async () => {
        try {
            const response = await axios.get('/profile');
            const user = response.data.user;
            return user;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
);
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth(state, action) {
            state.user = action.payload.user;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(checkAuth.fulfilled, (state, action) => {
            state.user = action.payload;
            state.isLoading = false;
        });
        builder.addCase(checkAuth.rejected, (state, action) => {
            state.user = null;
            state.isLoading = false;
        });
        builder.addCase(checkAuth.pending, (state, action) => {
            state.isLoading = true;
        });
        
    }
});


export default authSlice.reducer;
export const {setAuth} = authSlice.actions;