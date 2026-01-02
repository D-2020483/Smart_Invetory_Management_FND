import { createSlice } from "@reduxjs/toolkit";

const savedTheme = typeof window !== "undefined" ? localStorage.getItem("theme") : null;


const initialState = {
    mode: savedTheme === "dark" || savedTheme === "light" ? savedTheme : "light",
};

const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        //toggle between light and dark theme
        toggleTheme: (state) => {
            state.mode = state.mode === "light" ? "dark" : "light";
        },

        //set theme
    setTheme: (state, action) => {
        state.mode = action.payload;
        },
    },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;