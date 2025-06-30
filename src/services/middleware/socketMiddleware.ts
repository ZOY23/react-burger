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
    let reconnectAttempt = 0;
    const maxReconnectAttempts = 3;
    let reconnectTimer: NodeJS.Timeout;
    const wsUrl = 'wss://norma.nomoreparties.space';

    return next => (action: unknown) => {
      const { dispatch } = store;
      const { type, payload } = action as SocketAction;

      if (type === 'orders/connect') {
        const endpoint = payload || '/orders/all';
        socket = new WebSocket(`${wsUrl}${endpoint}`);
        isUser = false;
      }

      if (type === 'orders/connectUser') {
        const token = getCookie('accessToken');
        if (!token) {
          dispatch(wsConnectionError('No access token'));
          return;
        }
        // Удаляем 'Bearer ' из токена, если он есть
        const cleanToken = token.replace('Bearer ', '');
        const endpoint = payload || `/orders?token=${cleanToken}`;
        socket = new WebSocket(`${wsUrl}${endpoint}`);
        isUser = true;
      }

      if (socket) {
        socket.onopen = () => {
          reconnectAttempt = 0;
          clearTimeout(reconnectTimer);
          dispatch(wsConnectionSuccess());
        };

        socket.onmessage = event => {
          const data = JSON.parse(event.data);
          
          if (data.message === 'Invalid or missing token') {
            dispatch(wsConnectionError(data.message));
            socket?.close();
            return;
          }
          
          const { success, orders, total, totalToday, message } = data;
          
          if (message === 'Invalid or missing token') {
            dispatch(wsConnectionError(message));
            socket?.close();
            return;
          }

          if (success) {
            dispatch(updateFeed({ orders, total, totalToday, isUser }));
          }
        };

        socket.onerror = (event) => {
          dispatch(wsConnectionError('WebSocket error'));
        };

        socket.onclose = (event) => {
          dispatch(wsConnectionClosed());
          
          if (isUser && reconnectAttempt < maxReconnectAttempts && !event.wasClean) {
            reconnectAttempt++;
            reconnectTimer = setTimeout(() => {
              const token = getCookie('accessToken');
              if (token) {
                const cleanToken = token.replace('Bearer ', '');
                const endpoint = payload || `/orders?token=${cleanToken}`;
                socket = new WebSocket(`${wsUrl}${endpoint}`);
              }
            }, 3000 * reconnectAttempt);
          }
        };
      }

      if (type === 'orders/disconnect' && socket) {
        clearTimeout(reconnectTimer);
        socket.close();
        socket = null;
      }

      return next(action);
    };
  };
};