// authActions.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  registerUserRequest,
  loginUserRequest,
  logoutUserRequest,
  getUserRequest,
  updateUserRequest,
  refreshTokenRequest
} from '../../utils/api';
import { setCookie, deleteCookie, getCookie } from '../../utils/cookie';

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: { email: string; password: string; name: string }, { rejectWithValue }) => {
    try {
      const data = await registerUserRequest(userData);
      setCookie('accessToken', data.accessToken.split('Bearer ')[1], { expires: 1200 });
      localStorage.setItem('refreshToken', data.refreshToken);
      return data.user;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const data = await loginUserRequest(credentials);
      setCookie('accessToken', data.accessToken.split('Bearer ')[1], { expires: 1200 });
      localStorage.setItem('refreshToken', data.refreshToken);
      return data.user;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) throw new Error('No refresh token');
      
      await logoutUserRequest(refreshToken);
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
      return null;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const checkUserAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getUserRequest();
      return data.user;
    } catch (error) {
      if (error instanceof Error && error.message === 'No tokens available') {
        return rejectWithValue(null); // Специальная обработка для случая отсутствия токенов
      }
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (userData: { email: string; name: string; password?: string }, { rejectWithValue }) => {
    try {
      const data = await updateUserRequest(userData);
      return data.user;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);