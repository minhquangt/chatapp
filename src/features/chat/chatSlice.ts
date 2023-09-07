import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types/User';
import { UserInfo } from '../../types/Conversation';

export interface ChatState {
    chatId: string;
    user: UserInfo;
}

const initialState: ChatState = {
    chatId: '',
    user: {} as User,
};

export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setChatUser: (state, action: PayloadAction<ChatState>) => {
            state.user = action.payload.user;
            state.chatId = action.payload.chatId;
        },
    },
});

export const chatActions = chatSlice.actions;

export default chatSlice.reducer;

// currentUser.uid > action.payload.uid
// ? currentUser.uid + action.payload.uid
// : action.payload.uid + currentUser.uid,
