import React from 'react';
import Order from './Order';

// Simulate fetching data (you can replace this with actual API or database fetch)
async function fetchData() {
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

const OrderPage = async () => {
  const records = await fetchData();

  return (
    <div>
      {/* Pass the fetched data to the client component */}
      <Order orders={records} />
    </div>
  );
};

export default OrderPage;
