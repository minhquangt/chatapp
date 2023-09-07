import {
    Timestamp,
    arrayUnion,
    doc,
    serverTimestamp,
    updateDoc,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { v4 as uuid } from 'uuid';
import { RootState } from '../app/store';
import Img from '../assets/img.png';
import { db, storage } from '../config/firebase';
import { User } from '../types/User';

const Input = () => {
    const [text, setText] = useState('');
    const [img, setImg] = useState<any>(null);

    const currentUser = useSelector(
        (state: RootState) => state.auth.currentUser
    ) as User;
    const chat = useSelector((state: RootState) => state.chat);

    const handleSend = async () => {
        if (img) {
            const storageRef = ref(storage, uuid());

            const uploadTask = uploadBytesResumable(storageRef, img);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    // Observe state change events such as progress, pause, and resume
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                        case 'paused':
                            console.log('Upload is paused');
                            break;
                        case 'running':
                            console.log('Upload is running');
                            break;
                    }
                },
                (error) => {
                    //TODO:Handle Error
                    console.log(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(
                        async (downloadURL) => {
                            await updateDoc(doc(db, 'chats', chat.chatId), {
                                messages: arrayUnion({
                                    id: uuid(),
                                    text,
                                    senderId: currentUser.uid,
                                    date: Timestamp.now(),
                                    img: downloadURL,
                                }),
                            });
                        }
                    );
                }
            );
        } else {
            await updateDoc(doc(db, 'chats', chat.chatId), {
                messages: arrayUnion({
                    id: uuid(),
                    text,
                    senderId: currentUser.uid,
                    date: Timestamp.now(),
                }),
            });
        }
        setText('');
        setImg(null);

        await updateDoc(doc(db, 'userChats', currentUser.uid), {
            [chat.chatId + '.lastMessage']: {
                text,
            },
            [chat.chatId + '.date']: serverTimestamp(),
        });

        await updateDoc(doc(db, 'userChats', chat.user.uid), {
            [chat.chatId + '.lastMessage']: {
                text,
            },
            [chat.chatId + '.date']: serverTimestamp(),
        });
    };
    const handleKeydown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.keyCode === 13) {
            handleSend();
        }
    };
    return (
        <div
            className={`bg-white flex items-center justify-between px-4 py-2 border border-gray-300 fixed bottom-0 right-0 w-full lg:w-[calc(100%-250px)]`}
        >
            {img && (
                <div className='relative w-[80px] h-[80px]'>
                    <img
                        src={img && URL.createObjectURL(img)}
                        alt='imgSend'
                        className='w-full h-full object-cover'
                    />
                    <i
                        className='fa-regular fa-circle-xmark text-xl cursor-pointer fixed top-0 right-0 text-white'
                        onClick={() => setImg(null)}
                    ></i>
                </div>
            )}
            <input
                type='text'
                placeholder='Type something...'
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeydown}
                value={text}
                className={`outline-none py-2 w-full ${img && 'pl-4'}`}
            />
            <div className='flex items-center gap-2'>
                <input
                    type='file'
                    style={{ display: 'none' }}
                    id='file'
                    onChange={(e) => {
                        if (!e.target.files) return;
                        setImg(e.target.files[0]);
                    }}
                />
                <label htmlFor='file'>
                    <img
                        src={Img}
                        alt='file'
                        className='w-[60px] lg:w-[50px] cursor-pointer'
                    />
                </label>
                <button
                    className='bg-black text-white rounded-md px-3 py-1'
                    onClick={handleSend}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default Input;
