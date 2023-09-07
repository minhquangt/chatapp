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

    console.log('message', message);

    return (
        <div
            ref={ref}
            className={`mt-3 flex ${
                message?.senderId !== currentUser?.uid && 'justify-end '
            }`}
        >
            <div
                className={`flex gap-2 items-center max-w-[80%] ${
                    message?.senderId !== currentUser?.uid && 'flex-row-reverse'
                }`}
            >
                <img
                    src={
                        message?.senderId === currentUser?.uid
                            ? currentUser.photoURL
                            : chat.user?.photoURL
                    }
                    alt='avatar'
                    className='w-[30px] h-[30px]'
                />
                <div
                    className={`inline-block rounded-lg px-2 py-2 ${
                        message?.senderId !== currentUser?.uid
                            ? 'bg-gray-300'
                            : 'bg-blue-400'
                    }`}
                >
                    {message.text && (
                        <p
                            className={`text-lg ${
                                message?.senderId !== currentUser?.uid
                                    ? 'text-black'
                                    : 'text-white'
                            }`}
                        >
                            {message.text}
                        </p>
                    )}
                    {message.img && <img src={message.img} alt='' />}
                </div>
            </div>
            {/* <div>
                <span className='text-sm'>just now</span>
            </div> */}
        </div>
    );
};

export default Message;
