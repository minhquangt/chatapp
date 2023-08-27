import { signInWithEmailAndPassword } from 'firebase/auth';
import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../app/hooks';
import { auth } from '../../config/firebase';
import { toastNotiError, toastNotiSuccess } from '../../utils/toastNotifi';
import { authActions } from './authSlice';
export interface ILoginProps {}

export default function Login(props: ILoginProps) {
    const navigate = useNavigate();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const dispatch = useAppDispatch();
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const res = await signInWithEmailAndPassword(auth, email, password);
            const newUser = {
                uid: res.user.uid || '',
                photoURL: res.user.photoURL || '',
                displayName: res.user.displayName || '',
                email: res.user.email || '',
            };
            dispatch(authActions.loginSuccess(newUser));
            toastNotiSuccess('Đăng nhập thành công');
            navigate('/');
        } catch (err) {
            toastNotiError('Đăng nhập thất bại. Vui lòng thử lại.');
        }
    };
    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'email') {
            setEmail(value);
        } else {
            setPassword(value);
        }
    };
    return (
        <div className='flex items-center justify-center min-h-screen bg-gray-100'>
            <div className='relative flex flex-col m-6 space-y-8 bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0'>
                <div className='flex flex-col justify-center p-8 md:p-14'>
                    <span className='mb-3 text-4xl font-bold text-center'>
                        Login
                    </span>
                    <form onSubmit={handleSubmit}>
                        <div className='py-4'>
                            <span className='mb-2 text-md'>Email</span>
                            <input
                                type='text'
                                className='w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500'
                                name='email'
                                id='email'
                                onChange={handleChangeInput}
                                value={email}
                            />
                        </div>
                        <div className='py-4'>
                            <span className='mb-2 text-md'>Password</span>
                            <input
                                type='password'
                                name='pass'
                                id='pass'
                                className='w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500'
                                onChange={handleChangeInput}
                                value={password}
                            />
                        </div>
                        <button
                            type='submit'
                            className='w-full bg-black text-white p-2 rounded-lg mb-6 hover:bg-white hover:text-black hover:border hover:border-gray-300'
                        >
                            Login
                        </button>
                    </form>
                    <div className='text-center text-gray-400'>
                        Dont'have an account?
                        <Link to={'/register'}>
                            <span className='font-bold text-black'>
                                {' '}
                                Register
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
