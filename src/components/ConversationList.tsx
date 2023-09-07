import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../app/hooks';
import { RootState } from '../app/store';
import { db } from '../config/firebase';
import { Conversation, UserInfo } from '../types/Conversation';
import { User } from '../types/User';
import { ChatState, chatActions } from '../features/chat/chatSlice';
import { capitalizeWords } from '../utils/capitalizeWords';
import { menuActions } from '../features/menu/menuSlice';

const ConversationList = () => {
    const [conversationList, setConversationList] = useState<Conversation[]>(
        []
    );

    const currentUser = useSelector(
        (state: RootState) => state.auth.currentUser
    ) as User;
    const dispatch = useAppDispatch();

    useEffect(() => {
        const getConversationList = () => {
            const unsub = onSnapshot(
                doc(db, 'userChats', currentUser.uid),
                (doc: any) => {
                    setConversationList(doc.data());
                }
            );

            return () => {
                unsub();
            };
        };

        currentUser.uid && getConversationList();
    }, [currentUser.uid]);

    const handleCloseMenu = () => {
        dispatch(menuActions.closeMenu());
    };

    const handleSelect = (u: UserInfo) => {
        const newChat: ChatState = {
            chatId:
                currentUser.uid > u.uid
                    ? currentUser.uid + u.uid
                    : u.uid + currentUser.uid,
            user: u,
        };
        dispatch(chatActions.setChatUser(newChat));
        if (window.innerWidth < 1024) {
            handleCloseMenu();
        }
    };

    return (
        <div>
            {Object.entries(conversationList)
                ?.sort(
                    (a, b) =>
                        new Date(b[1].date).valueOf() -
                        new Date(a[1].date).valueOf()
                )
                .map((conversation) => (
                    <div
                        className='w-full flex items-center gap-3 p-2 hover:bg-gray-200 cursor-pointer'
                        key={conversation[0]}
                        onClick={() => handleSelect(conversation[1].userInfo)}
                    >
                        <img
                            src={conversation[1].userInfo.photoURL}
                            alt='avatar'
                            className='w-[30px] h-[30px]'
                        />
                        <div className='userChatInfo'>
                            <p className='font-bold'>
                                {capitalizeWords(
                                    conversation[1].userInfo.displayName
                                )}
                            </p>
                            <p className='text-xs italic truncate w-[150px]'>
                                {conversation[1].lastMessage?.text}
                            </p>
                        </div>
                    </div>
                ))}
        </div>
    );
};

export default ConversationList;
