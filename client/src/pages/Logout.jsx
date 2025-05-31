import React, { useEffect } from 'react'
import axiosInstance from '../utils/Axios';
import { toast } from 'react-toastify';

const Logout = () => {
    useEffect(() => {
        const logout = async () => {
            try {
                const result = await axiosInstance.get('/auth/logout');
                toast.success(result.data.message);
                window.location.href = '/login';
            } catch (error) {
                console.error('Error during logout:', error);
                toast.error('Logout failed. Please try again.');
            }
        };
        logout();
    })
  return (
    <main>
        
    </main>
  )
}

export default Logout