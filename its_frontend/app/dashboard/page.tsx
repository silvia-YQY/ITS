"use client";

import React, { useEffect, useState } from "react";
import {
  fetchTotalCarsParked,
  fetchTotalRevenue,
  fetchTotalPendingOrders,
  fetchOrderStatistics,
} from "@/api/dashboard";
import {
  OrderStatisticsResponse,
  TopUsersResponse,
} from "@/interface/dashboard";

const Dashboard: React.FC = () => {
  const [totalCars, setTotalCars] = useState<number>(0);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [pendingOrders, setPendingOrders] = useState<number>(0);
  const [orderStats, setOrderStats] = useState<OrderStatisticsResponse | null>(
    null
  );
  const [topUsers, setTopUsers] = useState<TopUsersResponse[]>([]);

  useEffect(() => {
    // Fetch dashboard data on mount
    async function loadDashboardData() {
      const cars = await fetchTotalCarsParked();
      const revenue = await fetchTotalRevenue();
      const pending = await fetchTotalPendingOrders();
      const stats = await fetchOrderStatistics();
      // const users = await fetchTopUsers();

      setTotalCars(cars.totalCarsParked);
      setTotalRevenue(revenue.totalRevenue);
      setPendingOrders(pending.totalPendingOrders);
      setOrderStats(stats);
      // setTopUsers(users);
    }

    loadDashboardData();
  }, []);

  return (
    <div>
      <h1>Car Park Dashboard</h1>
      <p>Total Cars Parked: {totalCars}</p>
      <p>Total Revenue: ${totalRevenue}</p>
      <p>Pending Orders: {pendingOrders}</p>

      {orderStats && (
        <div>
          <h2>Order Statistics</h2>
          <p>Completed Orders: {orderStats.completedOrders}</p>
          <p>Pending Orders: {orderStats.pendingOrders}</p>
          <p>Canceled Orders: {orderStats.canceledOrders}</p>
        </div>
      )}

      <h2>Top Users</h2>
      <ul>
        {topUsers.map((user) => (
          <li key={user.userId}>
            {user.username} - {user.totalOrders} orders
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
