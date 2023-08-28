export interface UserInfo {
    uid: string;
    photoURL: string;
    displayName: string;
}
export interface Conversation {
    date: Date;
    userInfo: UserInfo;
    lastMessage: {
        text: string;
    };
}
