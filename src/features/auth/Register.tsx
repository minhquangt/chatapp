import { yupResolver } from '@hookform/resolvers/yup';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { useAppDispatch } from '../../app/hooks';
import Loading from '../../components/Loading';
import { auth, db, storage } from '../../config/firebase';
import { toastNotiError, toastNotiSuccess } from '../../utils/toastNotifi';
import { authActions } from './authSlice';

export interface IRegisterProps {}
type FormValues = {
    name: string;
    email: string;
    password: string;
};

const schema = yup
    .object({
        name: yup
            .string()
            .required('Name is required')
            .min(3, 'Password must be at least 3 character'),
        email: yup
            .string()
            .required('Email is required')
            .matches(
                /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                'Please enter a valid email address'
            ),
        password: yup
            .string()
            .required('Password is required')
            .min(6, 'Password must be at least 1 character'),
    })
    .required();

export default function Register(props: IRegisterProps) {
    const navigate = useNavigate();
    const [file, setFile] = React.useState<any>(null);
    const [loading, setLoading] = React.useState<boolean>(false);
    const dispatch = useAppDispatch();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit: SubmitHandler<FormValues> = async ({
        email,
        name,
        password,
    }) => {
        try {
            setLoading(true);
            //Create user in authentication
            const res = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            //Create a unique image name
            const date = new Date().getTime();
            const storageRef = ref(storage, `${name + date}`);

            await uploadBytesResumable(storageRef, file).then(() => {
                getDownloadURL(storageRef).then(async (downloadURL) => {
                    try {
                        //Update profile
                        await updateProfile(res.user, {
                            displayName: name,
                            photoURL: downloadURL,
                        });
                        //create user on firestore
                        await setDoc(doc(db, 'users', res.user.uid), {
                            uid: res.user.uid,
                            displayName: name,
                            email,
                            photoURL: downloadURL,
                        });
                        const newUser = {
                            uid: res.user.uid || '',
                            photoURL: downloadURL,
                            displayName: name,
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
        } finally {
            setLoading(false);
        }
    };

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
                                {...register('name')}
                            />
                            {errors.name && (
                                <p className='text-sm text-red-600'>
                                    {errors.name.message}
                                </p>
                            )}
                        </div>
                        <div className='py-4'>
                            <span className='mb-2 text-md'>Email</span>
                            <input
                                type='text'
                                className='w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500'
                                id='email'
                                {...register('email')}
                            />{' '}
                            {errors.email && (
                                <p className='text-sm text-red-600'>
                                    {errors.email.message}
                                </p>
                            )}
                        </div>
                        <div className='py-4'>
                            <span className='mb-2 text-md'>Password</span>
                            <input
                                type='password'
                                id='pass'
                                className='w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500'
                                {...register('password')}
                            />
                            {errors.password && (
                                <p className='text-sm text-red-600'>
                                    {errors.password.message}
                                </p>
                            )}
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
                        <button
                            disabled={loading}
                            className='w-full bg-black text-white p-2 rounded-lg mb-6 hover:bg-white hover:text-black hover:border hover:border-gray-300'
                        >
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
            <Loading loading={loading} />
        </div>
    );
}
