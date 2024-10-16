"use client";

import React, { useEffect, useState } from "react";
import {
  fetchTotalCarsParked,
  fetchTotalRevenue,
  fetchTotalPendingOrders,
  fetchOrderStatistics,
  fetchRevenueByDate,
} from "@/api/dashboard";
import {
  TotalCarsParkedResponse,
  TotalRevenueResponse,
  TotalPendingOrdersResponse,
  OrderStatisticsResponse,
  RevenueByDateResponse,
} from "@/interface/dashboard";
import { Card, Col, Row, Statistic, Spin, DatePicker } from "antd";
import type { RangePickerProps } from "antd/es/date-picker";
import moment from "moment";
import { Order } from "@/interface/order";

const { RangePicker } = DatePicker;

const Dashboard: React.FC = () => {
  const [totalCars, setTotalCars] = useState<number>(0);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [orderStats, setOrderStats] = useState<OrderStatisticsResponse | null>(
    null
  );
  const [revenueByDate, setRevenueByDate] = useState<RevenueByDateResponse[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      try {
        const carsResponse = await fetchTotalCarsParked();
        const totalRevenue = await fetchTotalRevenue();
        const totalPendingOrders: Order[] = await fetchTotalPendingOrders();
        const orderStatsResponse: OrderStatisticsResponse =
          await fetchOrderStatistics();

        setTotalCars(carsResponse);
        setTotalRevenue(totalRevenue);
        setPendingOrders(totalPendingOrders);
        setOrderStats(orderStatsResponse);

        console.log("carsResponse", carsResponse);
        console.log("orderStatsResponse", orderStatsResponse);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      }
      setLoading(false);
    }

    loadDashboardData();
  }, []);

  // Date range change handler
  const onDateChange: RangePickerProps["onChange"] = async (
    dates,
    dateStrings
  ) => {
    if (dates && dates.length === 2) {
      const [startDate, endDate] = dateStrings;
      const revenueData: RevenueByDateResponse[] = await fetchRevenueByDate(
        startDate,
        endDate
      );
      setRevenueByDate(revenueData);
    }
  };

  return (
    <div>
      <h1>Car Park Dashboard</h1>
      {loading ? (
        <Spin size="large" />
      ) : (
        <>
          <Row gutter={16}>
            <Col span={8}>
              <Card bordered={false}>
                <Statistic
                  title="Total Cars Parked"
                  value={totalCars}
                  valueStyle={{ color: "#3f6600" }}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card bordered={false}>
                <Statistic
                  title="Pending Orders"
                  value={pendingOrders.length}
                  valueStyle={{ color: "#cf1322" }}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card bordered={false}>
                <Statistic
                  title="Total Revenue ($)"
                  value={totalRevenue}
                  precision={2}
                  valueStyle={{ color: "#1890ff" }}
                />
              </Card>
            </Col>
          </Row>

          {orderStats && (
            <Row gutter={16} style={{ marginTop: "20px" }}>
              <Col span={24}>
                <Card bordered={false}>
                  <h2>Order Statistics</h2>
                  <Row>
                    <Col span={6}>
                      <Statistic
                        title="Total Orders"
                        value={orderStats.totalOrders}
                      />
                    </Col>
                    <Col span={6}>
                      <Statistic
                        title="Completed Orders"
                        value={orderStats.completedOrders}
                      />
                    </Col>
                    <Col span={6}>
                      <Statistic
                        title="Pending Orders"
                        value={orderStats.pendingOrders}
                      />
                    </Col>
                    <Col span={6}>
                      <Statistic
                        title="Canceled Orders"
                        value={orderStats.canceledOrders}
                      />
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          )}

          {/* <Row gutter={16} style={{ marginTop: "20px" }}>
            <Col span={24}>
              <Card bordered={false}>
                <h2>Revenue By Date Range</h2>
                <RangePicker
                  onChange={onDateChange}
                  defaultValue={[
                    moment().startOf("month"),
                    moment().endOf("month"),
                  ]}
                />
                {revenueByDate.length > 0 && (
                  <ul style={{ marginTop: "20px" }}>
                    {revenueByDate.map((entry) => (
                      <li key={entry.date}>
                        {entry.date}: ${entry.revenue.toFixed(2)}
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            </Col>
          </Row> */}
        </>
      )}
    </div>
  );
};

export default Dashboard;
