import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    serverTimestamp,
    setDoc,
    updateDoc,
    where,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { User } from '../types/User';

const Search = () => {
    const [username, setUsername] = useState('');
    const [user, setUser] = useState<User>({} as User);
    const [err, setErr] = useState(false);
    const currentUser = useSelector(
        (state: RootState) => state.auth.currentUser
    ) as User;

    const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        e.code === 'Enter' && handleSearch();
    };
    const handleSearch = async () => {
        const q = query(
            collection(db, 'users'),
            where('displayName', '==', username)
        );

        try {
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.docs.length) setErr(true);
            querySnapshot.forEach((doc: any) => {
                setErr(false);
                setUser(doc.data());
            });
        } catch (err) {
            setErr(true);
        }
    };
    const handleSelect = async () => {
        //check whether the group(chats in firestore) exists, if not create
        const combinedId =
            currentUser.uid > user.uid
                ? currentUser.uid + user.uid
                : user.uid + currentUser.uid;
        try {
            const res = await getDoc(doc(db, 'chats', combinedId));

            if (!res.exists()) {
                //create a chat in chats collection
                await setDoc(doc(db, 'chats', combinedId), { messages: [] });

                //create user chats
                await updateDoc(doc(db, 'userChats', currentUser.uid), {
                    [combinedId + '.userInfo']: {
                        uid: user.uid,
                        displayName: user.displayName,
                        photoURL: user.photoURL,
                    },
                    [combinedId + '.date']: serverTimestamp(),
                });

                await updateDoc(doc(db, 'userChats', user.uid), {
                    [combinedId + '.userInfo']: {
                        uid: currentUser.uid,
                        displayName: currentUser.displayName,
                        photoURL: currentUser.photoURL,
                    },
                    [combinedId + '.date']: serverTimestamp(),
                });
            }
        } catch (err) {
            console.log(err);
            setErr(true);
        }

        setUser({} as User);
        setUsername('');
    };

    return (
        <div>
            <div>
                <input
                    type='text'
                    placeholder='Find a user'
                    onKeyDown={handleKey}
                    onChange={(e) => setUsername(e.target.value)}
                    value={username}
                    className='mt-2 px-2 py-2 border-b-2 border-gray-300 w-full focus:outline-none'
                />
            </div>
            {err && (
                <div className='w-full bg-gray-300 py-2 px-2'>
                    <span className='font-bold text-red-600'>
                        User not found!
                    </span>
                </div>
            )}
            {!err && Object.keys(user).length > 0 && (
                <div
                    className='w-full bg-gray-100 py-2 px-2 flex items-center cursor-pointer gap-4 hover:bg-gray-300'
                    onClick={handleSelect}
                >
                    <img
                        src={user.photoURL}
                        alt='avatar'
                        className='w-[30px] h-[30px]'
                    />
                    <div className='text-lg font-bold'>
                        <span>{user.displayName}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Search;
