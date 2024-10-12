import React from 'react';
import Order from './Order';
import { fetchFromAPI } from '@/utils/fetcher';

// Simulate fetching data (you can replace this with actual API or database fetch)
async function fetchData() {
  const res = await fetchFromAPI('/api/Order');
  return res;
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
