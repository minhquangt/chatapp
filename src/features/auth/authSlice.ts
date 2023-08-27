import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types/User';

export interface UserState {
    currentUser: User | null;
}

const initialState: UserState = {
    currentUser: null,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        registerSuccess: (state, action: PayloadAction<User>) => {
            state.currentUser = action.payload;
        },
        loginSuccess: (state, action: PayloadAction<User>) => {
            state.currentUser = action.payload;
        },
    },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
