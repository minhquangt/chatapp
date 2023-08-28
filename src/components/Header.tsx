import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useAppDispatch } from '../app/hooks';
import { authActions } from '../features/auth/authSlice';

const Header = () => {
    const currentUser = useSelector(
        (state: RootState) => state.auth.currentUser
    );
    const dispatch = useAppDispatch();
    const handleLogout = () => {
        signOut(auth);
        dispatch(authActions.logout());
    };
    return (
        <div className='px-4 py-2 border-b-[1px]'>
            <span className='text-2xl font-bold'>Chat App</span>
            <div className='flex justify-between mt-3'>
                <div className='flex gap-3 items-center'>
                    <img
                        src={currentUser?.photoURL}
                        alt='avatar'
                        className='w-[40px] h-[40px]'
                    />
                    <span>{currentUser?.displayName}</span>
                </div>
                <button
                    className='bg-black text-white px-2 rounded-lg'
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Header;
