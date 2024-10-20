import React from 'react';
import Order from './Order';

const OrderPage = async () => {
  return (
    <div>
      {/* Pass the fetched data to the client component */}
      <Order />
    </div>
  );
};

export default OrderPage;
