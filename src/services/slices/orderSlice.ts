import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { IOrder, IOrdersResponse } from '../../utils/types';
import { fetchWithRefresh, request } from '../../utils/api';

interface OrdersState {
  feed: IOrder[];
  userOrders: IOrder[];
  loading: boolean;
  error: string | null;
  total: number;
  totalToday: number;
  currentOrder: IOrder | null;
  wsConnected: boolean;
}

const initialState: OrdersState = {
  feed: [],
  userOrders: [],
  loading: false,
  error: null,
  total: 0,
  totalToday: 0,
  currentOrder: null,
  wsConnected: false,
};

export const connect = () => ({ type: 'orders/connect' });
export const connectUser = () => ({ type: 'orders/connectUser' });
export const disconnect = () => ({ type: 'orders/disconnect' });

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

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    updateFeed: (state, action: PayloadAction<{
      orders: IOrder[];
      total: number;
      totalToday: number;
      isUser: boolean;
    }>) => {
      if (action.payload.isUser) {
        state.userOrders = action.payload.orders;
      } else {
        state.feed = action.payload.orders;
      }
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
    },
    wsConnectionSuccess: (state) => {
      state.wsConnected = true;
    },
    wsConnectionError: (state) => {
      state.wsConnected = false;
    },
    wsConnectionClosed: (state) => {
      state.wsConnected = false;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.userOrders = action.payload;
      });
  },
});

export const { 
  updateFeed,
  wsConnectionSuccess,
  wsConnectionError,
  wsConnectionClosed,
  clearCurrentOrder
} = ordersSlice.actions;
export default ordersSlice.reducer;