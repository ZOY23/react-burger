import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  registerUserRequest,
  loginUserRequest,
  logoutUserRequest,
  getUserRequest,
  updateUserRequest,
  resetPasswordRequest,
  forgotPasswordRequest
} from '../../utils/api';
import { setCookie, deleteCookie } from '../../utils/cookie';
import { IUser, ForgotPasswordData } from '../../utils/types';

interface RegisterUserData {
  email: string;
  password: string;
  name: string;
}

interface LoginUserData {
  email: string;
  password: string;
}

interface UpdateUserData {
  email: string;
  name: string;
  password?: string;
}

interface ResetPasswordData {
  password: string;
  token: string;
}

export const registerUser = createAsyncThunk<IUser, RegisterUserData>(
  'auth/register',
  async (userData, { rejectWithValue }) => {
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

export const loginUser = createAsyncThunk<IUser, LoginUserData>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
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

export const checkUserAuth = createAsyncThunk<IUser | null>(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getUserRequest();
      return data.user;
    } catch (error) {
      if (error instanceof Error && error.message === 'No tokens available') {
        return rejectWithValue(null);
      }
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const updateUser = createAsyncThunk<IUser, UpdateUserData>(
  'auth/updateUser',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await updateUserRequest(userData);
      return data.user;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (data: ResetPasswordData, { rejectWithValue }) => {
    try {
      return await resetPasswordRequest(data);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (data: ForgotPasswordData, { rejectWithValue }) => {
    try {
      return await forgotPasswordRequest(JSON.stringify(data));
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);