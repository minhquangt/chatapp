import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import Add from '../assets/add.png';
import Cam from '../assets/cam.png';
import More from '../assets/more.png';
import Input from './Input';
import MessageList from './MessageList';

const Chat = () => {
    const chat = useSelector((state: RootState) => state.chat);

    return (
        <div className='chat'>
            <div className='chatInfo'>
                <span>{chat.user?.displayName}</span>
                <div className='chatIcons'>
                    <img src={Cam} alt='' />
                    <img src={Add} alt='' />
                    <img src={More} alt='' />
                </div>
            </div>
            <MessageList />
            <Input />
        </div>
    );
};

export default Chat;
