'use client';

import React, { useState } from 'react';
import { TextField, Button, List, ListItem, ListItemText, IconButton, Typography, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchFromAPI } from '@/utils/fetcher';

const PlatePage = () => {
  const [carPlate, setCarPlate] = useState('');
  const [carPlates, setCarPlates] = useState<string[]>([]); // List to store submitted car plates

  // Handle input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCarPlate(event.target.value);
  };

  // Handle form submission to add a new car plate
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const plate = carPlate.trim();
    if (plate) {
      await fetchFromAPI('/api/Car', { method: 'POST', body: { CarPlate: plate } });
      setCarPlates((prev) => [...new Set([...prev, plate])]);
      setCarPlate(''); // Clear the input field
    }
  };

  // Handle delete action
  const handleDelete = (plate: string) => {
    setCarPlates((prev) => prev.filter((p) => p !== plate));
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant='h4' gutterBottom>
        Car Plate Management
      </Typography>

      {/* Input Form */}
      <form onSubmit={handleSubmit}>
        <TextField label='Car Plate' variant='outlined' value={carPlate} onChange={handleInputChange} fullWidth margin='normal' required />
        <Button type='submit' variant='contained' color='primary' sx={{ mt: 2 }}>
          Submit Car Plate
        </Button>
      </form>

      {/* List of Car Plates */}
      <Typography variant='h6' sx={{ mt: 4 }}>
        My Car Plates
      </Typography>
      <List>
        {carPlates.map((plate, index) => (
          <ListItem
            key={index}
            secondaryAction={
              <IconButton edge='end' aria-label='delete' onClick={() => handleDelete(plate)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText primary={plate} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default PlatePage;
