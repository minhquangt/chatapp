import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db, storage } from '../../config/firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import { toastNotiError, toastNotiSuccess } from '../../utils/toastNotifi';
import { useAppDispatch } from '../../app/hooks';
import { authActions } from './authSlice';
import { useForm } from 'react-hook-form';
export interface IRegisterProps {}

export default function Register(props: IRegisterProps) {
    const navigate = useNavigate();
    const [displayName, setDisplayName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [file, setFile] = React.useState<any>(null);
    const dispatch = useAppDispatch();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const onSubmit = (data: any) => console.log(data);

    const handleSubmitt = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            //Create user in authentication
            const res = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            //Create a unique image name
            const date = new Date().getTime();
            const storageRef = ref(storage, `${displayName + date}`);

            await uploadBytesResumable(storageRef, file).then(() => {
                getDownloadURL(storageRef).then(async (downloadURL) => {
                    try {
                        //Update profile
                        await updateProfile(res.user, {
                            displayName,
                            photoURL: downloadURL,
                        });
                        //create user on firestore
                        await setDoc(doc(db, 'users', res.user.uid), {
                            uid: res.user.uid,
                            displayName,
                            email,
                            photoURL: downloadURL,
                        });
                        const newUser = {
                            uid: res.user.uid || '',
                            photoURL: downloadURL,
                            displayName: displayName,
                            email: email,
                        };
                        dispatch(authActions.registerSuccess(newUser));

                        //create empty user chats on firestore
                        await setDoc(doc(db, 'userChats', res.user.uid), {});
                        toastNotiSuccess('Đăng ký thành công');
                        navigate('/');
                    } catch (err) {
                        toastNotiError('Đăng ký thất bại. Vui lòng thử lại.');
                        console.log(err);
                    }
                });
            });
        } catch (error) {
            toastNotiError('Đăng ký thất bại. Vui lòng thử lại.');
            console.log(error);
        }
    };
    console.log(errors);

    return (
        <div className='flex items-center justify-center min-h-screen bg-gray-100'>
            <div className='relative flex flex-col m-6 space-y-8 bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0'>
                <div className='flex flex-col justify-center p-8 md:p-14'>
                    <span className='mb-3 text-4xl font-bold text-center'>
                        Register
                    </span>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className='py-4'>
                            <span className='mb-2 text-md'>Name</span>
                            <input
                                type='text'
                                className='w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500'
                                id='name'
                                {...register('name', {
                                    required: true,
                                    maxLength: 20,
                                })}
                            />
                            {errors.name?.type === 'required' && (
                                <p>Name is required</p>
                            )}
                        </div>
                        <div className='py-4'>
                            <span className='mb-2 text-md'>Email</span>
                            <input
                                type='text'
                                className='w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500'
                                id='email'
                                {...register('email', {
                                    required: true,
                                    maxLength: 20,
                                })}
                            />
                        </div>
                        <div className='py-4'>
                            <span className='mb-2 text-md'>Password</span>
                            <input
                                type='password'
                                id='pass'
                                className='w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500'
                                {...register('password', {
                                    required: true,
                                    maxLength: 20,
                                })}
                            />
                        </div>
                        <div className='py-4'>
                            <span className='mb-2 text-md'>Avatar</span>
                            <input
                                type='file'
                                name='avatar'
                                id='paavatarss'
                                className='w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500'
                                onChange={(e) => {
                                    if (!e.target.files) return;
                                    setFile(e.target.files[0]);
                                }}
                                required
                            />
                        </div>
                        <button className='w-full bg-black text-white p-2 rounded-lg mb-6 hover:bg-white hover:text-black hover:border hover:border-gray-300'>
                            Register
                        </button>
                    </form>
                    <div className='text-center text-gray-400'>
                        Already have an account?
                        <Link to={'/login'}>
                            <span className='font-bold text-black'> Login</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
