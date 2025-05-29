import { createSlice } from "@reduxjs/toolkit"; 

const fetchTheme = () => {
    const theme = localStorage.getItem('theme') || 'light';
    return theme;
}

const themeSlice = createSlice({
    name: 'theme',
    initialState: {
        dataTheme: fetchTheme(),
    },
    reducers: {
        setTheme(state, action) {
            state.dataTheme = action.payload;
            document.body.setAttribute('data-theme', action.payload);
            localStorage.setItem('theme', action.payload);
        },
    },
}) 


export const { setTheme } = themeSlice.actions; 
export default themeSlice.reducer;