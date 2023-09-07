import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { db } from '../config/firebase';
import { MessageType } from '../types/Message';
import Message from './Message';
import Loading from './Loading';

const MessageList = () => {
    const [messages, setMessages] = useState<MessageType[]>([]);
    const chat = useSelector((state: RootState) => state.chat);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    useEffect(() => {
        setIsLoading(true);
        const unSub = onSnapshot(doc(db, 'chats', chat.chatId), (doc) => {
            doc.exists() && setMessages(doc.data().messages);
            setIsLoading(false);
        });

        return () => {
            unSub();
        };
    }, [chat.chatId]);

    console.log(messages);

    return (
        <div className='flex-1 p-4 mb-16 overflow-y-scroll'>
            {!messages.length && <Loading loading={isLoading} />}
            {messages.map((m, index) => (
                <Message message={m} key={index} />
            ))}
        </div>
    );
};

export default MessageList;
