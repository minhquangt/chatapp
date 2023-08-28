import React from 'react';
import Header from './Header';
import Search from './Search';
import ConversationList from './ConversationList';

const Sidebar = () => {
    return (
        <div className='w-[300px] h-screen border-r-[1px]'>
            <Header />
            <Search />
            <ConversationList />
        </div>
    );
};

export default Sidebar;
