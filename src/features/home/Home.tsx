import * as React from 'react';
import Sidebar from '../../components/Sidebar';
import Chat from '../../components/Chat';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';

export interface IHomeProps {}

export default function Home(props: IHomeProps) {
    const chat = useSelector((state: RootState) => state.chat);
    console.log(Object.keys(chat.user).length);

    return (
        <div className='lg:flex'>
            <Sidebar />
            {Object.keys(chat.user).length ? <Chat /> : null}
        </div>
    );
}
