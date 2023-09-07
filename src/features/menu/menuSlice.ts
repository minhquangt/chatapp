import { createSlice } from '@reduxjs/toolkit';

export interface MenuState {
    isOpen: boolean;
}

const initialState: MenuState = {
    isOpen: true,
};

export const menuSlice = createSlice({
    name: 'toggleMenu',
    initialState,
    reducers: {
        openMenu: (state) => {
            state.isOpen = true;
        },
        closeMenu: (state) => {
            state.isOpen = false;
        },
    },
});

export const menuActions = menuSlice.actions;

export default menuSlice.reducer;
