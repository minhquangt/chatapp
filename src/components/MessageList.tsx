import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { db } from '../config/firebase';
import { MessageType } from '../types/Message';
import Message from './Message';

const MessageList = () => {
    const [messages, setMessages] = useState<MessageType[]>([]);
    const chat = useSelector((state: RootState) => state.chat);
    useEffect(() => {
        const unSub = onSnapshot(doc(db, 'chats', chat.chatId), (doc) => {
            doc.exists() && setMessages(doc.data().messages);
        });

        return () => {
            unSub();
        };
    }, [chat.chatId]);

    console.log(messages);

    return (
        <div className='messages'>
            {messages.map((m, index) => (
                <Message message={m} key={index} />
            ))}
        </div>
    );
};

export default MessageList;
