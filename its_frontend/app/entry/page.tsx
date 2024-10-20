'use client';
import React, { useState } from 'react';
import { Button, Box, Typography } from '@mui/material';
import { fetchFromAPI } from '@/utils/fetcher';
import { useUser } from '../context/userContext';

export default function UploadPhoto() {
  const [preview, setPreview] = useState(null);
  const [carPlate, setCarPlate] = useState('');
  const { user } = useUser();

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Generate a preview of the selected image
      const previewURL = URL.createObjectURL(file);
      setPreview(previewURL);
      const reader = new FileReader();
      reader.onload = (e) => {
        const image = new Image();
        image.src = e.target.result;

        image.onload = async () => {
          // Create a canvas element
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          // Set canvas dimensions to the image dimensions
          canvas.width = image.width;
          canvas.height = image.height;

          // Draw the image onto the canvas
          ctx.drawImage(image, 0, 0);

          // Convert the image to a specific format (e.g., JPEG)
          const imageUrl = canvas.toDataURL('image/jpeg', 0.8); // 0.8 is the quality (80%)
          const carPlate = generateRandomCarPlate();
          setCarPlate(generateRandomCarPlate());
          // console.log('Uploaded file:', file, imageUrl, previewURL);
          await handleCreateCar({
            carPlate: carPlate,
            url: imageUrl,
            userId: user.id,
          });
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateCar = async (data) => {
    const res = await fetchFromAPI('/api/Car', { method: 'POST', body: data });
  };
  const handleCreateOrder = async () => {
    const res = await fetchFromAPI('/api/Order', { method: 'POST', body: {} });
  };

  return (
    <Box sx={{ textAlign: 'center', marginTop: '20px' }}>
      <Box sx={{ textAlign: 'left' }}>
        <Typography variant='h6' gutterBottom>
          Upload a Photo
        </Typography>
        <form>
          <input accept='image/*' type='file' id='upload-photo' style={{ display: 'none' }} onChange={handleFileChange} />
          <label htmlFor='upload-photo'>
            <Button variant='contained' component='span'>
              Upload Photo
            </Button>
          </label>
        </form>
      </Box>
      <Box className='flex'>
        {preview && (
          <Box sx={{ marginTop: '20px' }}>
            <Typography variant='body1'>Uploaded Image:</Typography>
            <img src={preview} alt='Uploaded' style={{ width: '200px', height: '200px', objectFit: 'cover' }} />
          </Box>
        )}
        {carPlate && (
          <Box className='ml-3' sx={{ marginTop: '20px' }}>
            <Typography variant='body1'>Car Plate:</Typography>
            <Typography variant='body1'>{carPlate}</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

function generateRandomCarPlate() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // Pool of letters to use
  const numbers = '0123456789'; // Pool of numbers to use

  // Helper function to get a random letter
  const getRandomLetter = () => letters[Math.floor(Math.random() * letters.length)];

  // Helper function to get a random number
  const getRandomNumber = () => numbers[Math.floor(Math.random() * numbers.length)];

  // Define car plate format (e.g., 3 letters followed by 4 numbers: ABC-1234)
  const carPlate = `${getRandomLetter()}${getRandomLetter()}${getRandomLetter()}-${getRandomNumber()}${getRandomNumber()}${getRandomNumber()}${getRandomNumber()}`;

  return carPlate;
}
