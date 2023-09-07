import React from 'react';
import Header from './Header';
import Search from './Search';
import ConversationList from './ConversationList';
import { RootState } from '../app/store';
import { useSelector } from 'react-redux';

const Sidebar = () => {
    const menu = useSelector((state: RootState) => state.menu);
    return (
        <div
            className={`w-full lg:w-[300px] h-screen border-r-[1px] transition-transform ${
                menu.isOpen ? 'translate-x-0' : 'translate-x-[-100%]'
            }`}
        >
            <Header />
            <Search />
            <ConversationList />
        </div>
    );
};

export default Sidebar;
