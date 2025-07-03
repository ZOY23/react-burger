// services/actions/orderActions.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { IOrder } from '../../utils/types';
import { fetchWithRefresh, request } from '../../utils/api';

export const fetchOrderByNumber = createAsyncThunk<IOrder, number>(
  'orders/fetchOrderByNumber',
  async (number, { rejectWithValue }) => {
    try {
      const response = await request(`/orders/${number}`);
      return response.orders[0];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserOrders = createAsyncThunk<IOrder[]>(
  'orders/fetchUserOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchWithRefresh<{orders: IOrder[]}>('/orders');
      return response.orders;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);