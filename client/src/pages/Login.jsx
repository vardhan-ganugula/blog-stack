import React from 'react'
import AuthLayout from '../layouts/AuthLayout'
import axios from '../utils/Axios';
import { loginSchema } from '../schema/auth.schema';
import {useForm} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod';
import {toast} from 'react-toastify';
import {useDispatch} from 'react-redux'
import { setAuth } from '../store/auth/index';

const Login = () => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(loginSchema),
    });
    const dispatch = useDispatch();
    const handleLogin = async(data) => {
        const toastId = toast.loading('Logging in...');
        try {
            const resp = await axios.post('/auth/login', data);
            const {message, user} = resp.data;
            dispatch(setAuth({user}));
            toast.update(toastId, {
                render: message,
                type: 'success',
                isLoading: false,
                autoClose: 2000,
            });
            
        } catch (error) {
            const message = error?.response?.data?.message || 'Something went wrong'
            toast.update(toastId, {
                render: message,
                type: 'error',
                isLoading: false,
                autoClose: 2000,
            });
        }

        
    };

  return (
    <AuthLayout>
        <div className='card'>

            <h1 className='card__header'>Login</h1>    
            <div className='card__body'>
                <form onSubmit={handleSubmit(handleLogin)}>
                    <div className='form__group'>
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" id="email"
                            {...register('email')}
                         placeholder='Enter your email' />
                        {errors.email && <p className='error'>{errors.email.message}</p>}
                    </div>
                    <div className='form__group'>
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" id="password" placeholder='Enter your password' required {...register('password')} />
                        {errors.password && <p className='error'>{errors.password.message}</p>}
                    </div>
                    <button type='submit' className='btn'
                        disabled={isSubmitting}
                    >Login</button>
                    <p className='form__footer'>Don't have an account 🤔? <a href="/register">Register</a></p>
                    
                </form>
            </div>
        </div>
    </AuthLayout>
  )
}

export default Login