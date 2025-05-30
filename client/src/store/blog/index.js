import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'; 
import axios from '../../utils/Axios';

const initialState = {
    blogPosts: [],
    isLoading: true,
    currentBlog : null,
    drafts: []
} 
export const getBlogs = createAsyncThunk(
    'blog/getBlogs',
    async () => {
        try {
            const response = await axios.get('/blogs/');
            const blogPosts = response.data.data;
            return blogPosts;
        } catch (error) {
            console.log(error);
            return [];
        }
    }
);

export const getDrafts = createAsyncThunk(
    'blog/getDrafts',
    async () => {
        try {
            const response = await axios.get('/blogs/drafts');
            const blogPosts = response.data.data;
            return blogPosts;
        } catch (error) {
            console.log(error);
            return [];
        }
    }
);

const authSlice = createSlice({
    name: 'blogs',
    initialState,
    reducers: {
        setLoading(state, action) {
            state.isLoading = action.payload;
        },
        addBlog(state, action){
            state.blogPosts.push(action.payload);
        },

        getblog(state, action){
            state.currentBlog = state.blogPosts.filter((blog) => blog.slug == action.payload);
        },

    },
    extraReducers: (builder) => {
        builder.addCase(getBlogs.fulfilled, (state, action) => {
            state.blogPosts = action.payload;
            state.isLoading = false;
        });
        builder.addCase(getBlogs.rejected, (state, action) => {
            state.blogPosts = [];
            state.isLoading = false;
        });
        builder.addCase(getBlogs.pending, (state, action) => {
            state.isLoading = true;
        });

        builder.addCase(getDrafts.fulfilled, (state, action) => {
            state.drafts = action.payload;
            state.isLoading = false;
        });
        builder.addCase(getDrafts.rejected, (state, action) => {
            state.drafts = [];
            state.isLoading = false;
        });
        builder.addCase(getDrafts.pending, (state, action) => {
            state.isLoading = true;
        });
        
    }
});


export default authSlice.reducer;
export const {setLoading} = authSlice.actions;