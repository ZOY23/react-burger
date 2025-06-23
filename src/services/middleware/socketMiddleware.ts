import { Middleware, MiddlewareAPI } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '../store/store';
import { updateFeed, wsConnectionSuccess, wsConnectionError, wsConnectionClosed } from '../slices/orderSlice';
import { getCookie } from '../../utils/cookie';

interface SocketAction {
  type: 'orders/connect' | 'orders/disconnect' | 'orders/connectUser';
  payload?: string;
}

export const socketMiddleware = (): Middleware => {
  return (store: MiddlewareAPI<AppDispatch, RootState>) => {
    let socket: WebSocket | null = null;
    let isUser = false;

    return next => (action: unknown) => {
      const { dispatch } = store;
      const { type } = action as SocketAction;

      if (type === 'orders/connect') {
        socket = new WebSocket('wss://norma.nomoreparties.space/orders/all');
        isUser = false;
      }

      if (type === 'orders/connectUser') {
        const token = getCookie('accessToken')?.split(' ')[1];
        if (!token) return;
        socket = new WebSocket(`wss://norma.nomoreparties.space/orders?token=${token}`);
        isUser = true;
      }

      if (socket) {
        socket.onopen = () => {
          dispatch(wsConnectionSuccess());
        };

        socket.onmessage = event => {
          const { success, orders, total, totalToday } = JSON.parse(event.data);
          if (success) {
            dispatch(updateFeed({ orders, total, totalToday, isUser }));
          }
        };

        socket.onerror = () => {
          dispatch(wsConnectionError());
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