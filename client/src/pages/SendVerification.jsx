import React from 'react'
import {z} from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import AuthLayout from '../layouts/AuthLayout'
import {useSelector} from 'react-redux'
import axios from '../utils/Axios'
import {toast} from 'react-toastify'

const SendVerification = () => {
    const email = z.object({
        email: z.string().email('Invalid email address').nonempty('Email is required')
    });
    const user = useSelector(state => state.auth.user)
    const {handleSubmit, register, formState : {
        errors, isSubmitting
    }} = useForm({
        resolver: zodResolver(email),
        defaultValues: {
            email: ''
        }
    });

    const handleSendEmail = async (data) => {
        const email = data.email;
        try {
            const response = await axios.get('/auth/send-verification-email', {
                params: { email }
            });
            if (response.data.status === 1) {
                toast.success('Verification email sent successfully!');
            } else {
                toast.error('Failed to send verification email. Please try again later.');
            }
        } catch (error) {
            console.error('Error sending verification email:', error);
            toast.error('An error occurred while sending the verification email. Please try again later.');
        }
    }
  return (
    <AuthLayout>
        <div className='card'>

            <h1 className='card__header'>Send Verification</h1>    
            <div className='card__body'>
                <form onSubmit={handleSubmit(handleSendEmail)}>
                    <div className='form__group'>
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" id="email"
                            {...register('email')}
                         placeholder='Enter your email' />
                        {errors.email && <p className='error'>{errors.email.message}</p>}
                    </div>

                    <button type='submit' className='btn'
                        disabled={isSubmitting}
                    >Send Email</button>
                    <p className='form__footer'>Don't have an account 🤔? <a href="/register">Register</a></p>
                    
                </form>
            </div>
        </div>
    </AuthLayout>
  )
}

export default SendVerification