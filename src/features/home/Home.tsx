import * as React from 'react';
import Sidebar from '../../components/Sidebar';
import Chat from '../../components/Chat';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';

export interface IHomeProps {}

export default function Home(props: IHomeProps) {
    const chat = useSelector((state: RootState) => state.chat);

    return (
        <div className=''>
            <Sidebar />
            {Object.keys(chat.user).length && <Chat />}
        </div>
    );
}
