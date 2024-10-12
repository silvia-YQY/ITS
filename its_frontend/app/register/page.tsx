'use client'; // Ensure the component is client-side

import React, { useRef } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { title } from 'process';
import useModal from '../hooks/useModal';
import { useRouter } from 'next/navigation';
import { fetchFromAPI } from '@/utils/fetcher';

export default function RegisterForm() {
  const router = useRouter();
  // Initialize the form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { showModal } = useModal();

  const onSubmit = async (data) => {
    const { username, password, email } = data;
    // Handle login logic here, such as sending data to an API
    await fetchFromAPI('/api/Auth/register', { method: 'POST', body: { ...data, isAdmin: 1 } })
      .then(() => {
        showModal({
          title: 'register succeeded',
          onConfirm: () => {
            router.replace('/login');
          },
        });
      })
      .catch((err) => {
        showModal({
          title: err.message,
          onConfirm: () => {},
        });
      });
  };

  return (
    <Box component='form' noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }} aria-labelledby='login-form'>
      <Typography id='login-form' variant='h5' component='h1'>
        Register
      </Typography>
      {/* Username Field */}
      <TextField
        label='Username'
        {...register('username', { required: 'Username is required' })}
        variant='outlined'
        fullWidth
        error={!!errors.username}
        helperText={errors.username ? errors.username.message : ''}
        margin='normal'
        required
        aria-label='username'
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

      {/* Email Field */}
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

      {/* Submit Button */}
      <Button type='submit' fullWidth variant='contained' color='primary' sx={{ mt: 3 }} aria-label='submit'>
        Register
      </Button>
      {/* Registration Prompt */}
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant='body2' component='p'>
          <Link component='button' variant='body2' href='/login' sx={{ ml: 1 }} aria-label='register'>
            Login here
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
