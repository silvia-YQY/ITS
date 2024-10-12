'use client';

import React, { useEffect, useState } from 'react';
import { Container } from '@mui/material';
import { PieChart, PieSeries } from '@mui/x-charts'; // Import from MUI X Charts

import { fetchFromAPI } from '@/utils/fetcher';

const DashboardPage = () => {
  const [data, setData] = useState([]);

  // Fetch data using useEffect (client-side)
  useEffect(() => {
    async function fetchData() {
      try {
        
        const res = await fetchFromAPI('/api/Order');
        setData(res); // Assuming res is an array of data you want to display
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, []);

  // Dummy data for PieChart (if you want to show data from API, replace this)
  const pieData = [
    { id: 0, value: 10, label: 'Series A' },
    { id: 1, value: 15, label: 'Series B' },
    { id: 2, value: 20, label: 'Series C' },
  ];

  return (
    <Container maxWidth="sm">
      <PieChart
        series={[
          {
            data: pieData, // Replace this with fetched data if applicable
            innerRadius: 50,
            outerRadius: 100,
          },
        ]}
        width={400}
        height={300}
      />
    </Container>
  );
};

export default DashboardPage;
