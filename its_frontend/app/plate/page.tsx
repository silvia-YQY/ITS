import React from 'react';
import CarPlate from './Plate';
import { fetchFromAPI } from '@/utils/fetcher';

// Simulate fetching data (you can replace this with actual API or database fetch)
async function fetchData() {
  const res = await fetchFromAPI('/api/Car');
  console.log(res);
  return [
    {
      id: 0,
      carId: 0,
      car: {
        id: 0,
        carPlate: 'ABC123',
        user: {
          id: 0,
          username: 'user1',
          email: 'user1@example.com',
        },
      },
      startTime: '2024-10-10T22:48:25.809Z',
      endTime: '2024-10-10T22:48:25.809Z',
      fee: 999999.99,
      status: 0,
    },
    // Add more records as needed
  ];
}

const PlatePage = async () => {
  const records = await fetchData();

  return (
    <div>
      {/* Pass the fetched data to the client component */}
      <CarPlate orders={records} />
    </div>
  );
};

export default PlatePage;
