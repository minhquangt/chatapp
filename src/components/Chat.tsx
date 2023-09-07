import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../app/store';
import Input from './Input';
import MessageList from './MessageList';
import { capitalizeWords } from '../utils/capitalizeWords';
import { menuActions } from '../features/menu/menuSlice';

const Chat = () => {
    const menu = useSelector((state: RootState) => state.menu);
    const chat = useSelector((state: RootState) => state.chat);
    const dispatch = useDispatch();
    console.log('chat');
    const handleOpenMenu = () => {
        dispatch(menuActions.openMenu());
    };
    return (
        <div
            className={`lg:flex lg:flex-col w-full relative h-screen overflow-hidden ${
                menu.isOpen ? 'hidden' : 'flex flex-col w-full'
            }`}
        >
            <div className='flex items-center justify-between p-4 border-b-[1px] border-gray-300'>
                <div className='flex items-center gap-2'>
                    <img
                        src={chat.user.photoURL}
                        alt='avatar'
                        className='w-[30px] h-[30px]'
                    />
                    <span className='font-bold'>
                        {capitalizeWords(chat.user?.displayName)}
                    </span>
                </div>
                <i
                    className='fa-solid fa-bars cursor-pointer lg:hidden'
                    onClick={handleOpenMenu}
                ></i>
            </div>
            <MessageList />
            <Input />
        </div>
    );
};

export default Chat;
