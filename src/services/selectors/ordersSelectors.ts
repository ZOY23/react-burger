import { RootState } from '../store/store';
import { IOrder } from '../../utils/types';

export const selectFeed = (state: RootState): IOrder[] => state.orders.feed;
export const selectUserOrders = (state: RootState) => state.orders.userOrders;
export const selectOrdersLoading = (state: RootState): boolean => state.orders.loading;
export const selectOrdersError = (state: RootState): string | null => state.orders.error;
export const selectTotalOrders = (state: RootState): number => state.orders.total;
export const selectTotalToday = (state: RootState): number => state.orders.totalToday;
export const selectCurrentOrder = (state: RootState): IOrder | null => state.orders.currentOrder;

export const selectOrderByNumber = (state: RootState, number: number): IOrder | undefined => {
  const allOrders = [...state.orders.feed, ...state.orders.userOrders];
  const foundOrder = allOrders.find(order => order.number === number);
  return foundOrder || (state.orders.currentOrder?.number === number ? state.orders.currentOrder : undefined);
};