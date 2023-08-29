import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { User } from '../types/User';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Conversation, UserInfo } from '../types/Conversation';

const ConversationList = () => {
    const [conversationList, setConversationList] = useState<Conversation[]>(
        []
    );

    const currentUser = useSelector(
        (state: RootState) => state.auth.currentUser
    ) as User;
    // const { dispatch } = useContext(ChatContext);

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

    const handleSelect = (u: UserInfo) => {
        // dispatch({ type: 'CHANGE_USER', payload: u });
    };

    return (
        <div className='chats'>
            {Object.entries(conversationList)
                ?.sort(
                    (a, b) =>
                        new Date(b[1].date).valueOf() -
                        new Date(a[1].date).valueOf()
                )
                .map((conversation) => (
                    <div
                        className='flex items-center gap-3 p-2 hover:bg-gray-200 cursor-pointer'
                        key={conversation[0]}
                        onClick={() => handleSelect(conversation[1].userInfo)}
                    >
                        <img
                            src={conversation[1].userInfo.photoURL}
                            alt='avatar'
                            className='w-[30px] h-[30px]'
                        />
                        <div className='userChatInfo'>
                            <span>{conversation[1].userInfo.displayName}</span>
                            <p>{conversation[1].lastMessage?.text}</p>
                        </div>
                    </div>
                ))}
        </div>
    );
};

export default ConversationList;
