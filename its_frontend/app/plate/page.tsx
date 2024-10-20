import React from 'react';
import CarPlate from './Plate';
import { fetchFromAPI } from '@/utils/fetcher';

// Simulate fetching data (you can replace this with actual API or database fetch)
async function fetchData() {
  const res = await fetchFromAPI('/api/Car');
  const carPlates = res.map((item) => item.CarPlate);
  console.log(carPlates);
  return carPlates;
}

const PlatePage = async () => {
  const records = await fetchData();

  return (
    <div>
      {/* Pass the fetched data to the client component */}
      <CarPlate plates={records} />
    </div>
  );
};

export default PlatePage;
