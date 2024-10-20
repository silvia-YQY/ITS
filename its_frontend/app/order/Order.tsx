'use client';

import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TablePagination } from '@mui/material';
import { fetchFromAPI } from '@/utils/fetcher';

interface IOrder {
  carId: number;
  carPlate: string;
  endTime: string;
  fee: number;
  id: number;
  orderStatus: number;
  startTime: string;
  userId: number;
  userName: string;
}
interface IOrderProps {
  orders: IOrder[];
}

const OrderTable: React.FC<IOrderProps> = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchFromAPI('/api/Order').then((res) => {
      console.log(res);
      setOrders(res);
    });
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant='h4' gutterBottom>
        Orders
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Car Plate</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Start Time</TableCell>
              <TableCell>End Time</TableCell>
              <TableCell>Fee</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((record: IOrder) => (
              <TableRow key={record.id}>
                <TableCell>{record.carPlate}</TableCell>
                <TableCell>{record.userName}</TableCell>
                <TableCell>{new Date(record.startTime).toLocaleString()}</TableCell>
                <TableCell>{new Date(record.endTime).toLocaleString()}</TableCell>
                <TableCell>{record.fee.toLocaleString('en-US', { style: 'currency', currency: 'NZD' })}</TableCell>
                <TableCell>{record.status === 0 ? 'Active' : 'Inactive'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component='div'
        count={orders.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </div>
  );
};

export default OrderTable;
