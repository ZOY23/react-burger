// src/services/middleware/socketMiddleware.ts
import { Middleware, MiddlewareAPI } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '../store/store';
import { updateFeed, wsConnectionSuccess, wsConnectionError, wsConnectionClosed } from '../slices/orderSlice';

interface SocketAction {
  type: 'orders/connect' | 'orders/disconnect';
  payload?: string;
}

export const socketMiddleware = (wsUrl: string): Middleware<{}, RootState> => {
  return (store: MiddlewareAPI<AppDispatch, RootState>) => {
    let socket: WebSocket | null = null;

    return (next) => (action: unknown) => {
      const typedAction = action as SocketAction;
      const { dispatch } = store;
      const { type } = typedAction;

      if (type === 'orders/connect') {
        socket = new WebSocket(wsUrl);
        
        socket.onopen = () => {
          dispatch(wsConnectionSuccess());
        };

        socket.onerror = (error) => {
          dispatch(wsConnectionError());
          console.log('WebSocket error:', error);
        };

        socket.onmessage = (event) => {
          const data = JSON.parse(event.data) as {
            success: boolean;
            orders: any[];
            total: number;
            totalToday: number;
          };
          
          if (data.success) {
            dispatch(updateFeed({
              orders: data.orders,
              total: data.total,
              totalToday: data.totalToday
            }));
          }
        };

        socket.onclose = () => {
          dispatch(wsConnectionClosed());
        };
      }

      if (type === 'orders/disconnect' && socket) {
        socket.close();
        socket = null;
      }

      return next(action);
    };
  };
};