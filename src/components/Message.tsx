import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { MessageType } from '../types/Message';
import { User } from '../types/User';

interface MessageProps {
    message: MessageType;
}

const Message = ({ message }: MessageProps) => {
    const currentUser = useSelector(
        (state: RootState) => state.auth.currentUser
    ) as User;
    const chat = useSelector((state: RootState) => state.chat);

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        ref.current?.scrollIntoView({ behavior: 'smooth' });
    }, [message]);

    return (
        <div
            ref={ref}
            className={`message ${
                message?.senderId === currentUser?.uid && 'owner'
            }`}
        >
            <div className='messageInfo'>
                <img
                    src={
                        message?.senderId === currentUser?.uid
                            ? currentUser.photoURL
                            : chat.user?.photoURL
                    }
                    alt=''
                />
                <span>just now</span>
            </div>
            <div className='messageContent'>
                {message.text && <p>{message.text}</p>}
                {message.img && <img src={message.img} alt='' />}
            </div>
        </div>
    );
};

export default Message;
