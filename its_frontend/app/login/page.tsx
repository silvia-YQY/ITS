'use client'; // Ensure the component is client-side
import React from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import useModal from '../hooks/useModal';
import { fetchFromAPI } from '@/utils/fetcher';
import Cookies from 'js-cookie';
import { useUser } from '../context/userContext';

export default function LoginForm() {
  const router = useRouter();
  // Initialize the form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { showModal } = useModal({ title: 'xx' });
  const { setUser } = useUser();

  const onSubmit = async (data) => {
    await fetchFromAPI('/api/Auth/login', { method: 'POST', body: { ...data } })
      .then((res) => {
        Cookies.set('token', res.Token);
        setUser({
          ...res?.user,
          role: res.user.isAdmin ? 'admin' : 'user',
        });
        showModal({
          title: 'login succeeded',
          onConfirm: () => {
            router.replace('/order');
          },
        });
      })
      .catch((err) => {
        showModal({
          title: err.error,
          onConfirm: () => {},
        });
      });
  };

  return (
    <Box component='form' noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }} aria-labelledby='login-form'>
      <Typography id='login-form' variant='h5' component='h1'>
        Login
      </Typography>
      <TextField
        label='Email'
        {...register('email', { required: 'Email is required' })}
        variant='outlined'
        fullWidth
        error={!!errors.email}
        helperText={errors.email ? errors.email.message : ''}
        margin='normal'
        required
        aria-label='email'
        inputProps={{ 'aria-required': 'true' }}
      />

      {/* Password Field */}
      <TextField
        label='Password'
        {...register('password', { required: 'Password is required' })}
        type='password'
        variant='outlined'
        fullWidth
        margin='normal'
        required
        error={!!errors.password}
        helperText={errors.password ? errors.password.message : ''}
        aria-label='password'
        inputProps={{ 'aria-required': 'true' }}
      />

      {/* Submit Button */}
      <Button type='submit' fullWidth variant='contained' color='primary' sx={{ mt: 3 }} aria-label='submit'>
        Login
      </Button>
      {/* Registration Prompt */}
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant='body2' component='p'>
          Don't have an account?{' '}
          <Link component='button' variant='body2' href='/register' sx={{ ml: 1 }} aria-label='register'>
            Register here
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
