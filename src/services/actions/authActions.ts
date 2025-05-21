import { createAsyncThunk } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '../store/store';
import { getCookie } from '../../utils/cookie';

interface UserData {
  email: string;
  name: string;
}

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

interface AuthResponse {
  success: boolean;
  user: UserData;
  accessToken: string;
  refreshToken: string;
}

interface TokenResponse {
  success: boolean;
  accessToken: string;
  refreshToken: string;
}

interface LogoutResponse {
  success: boolean;
  message: string;
}

interface ErrorResponse {
  message: string;
  success?: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface TokenRequest {
  token: string;
}

export const registerUser = createAsyncThunk<
  AuthResponse,
  RegisterData,
  {
    dispatch: AppDispatch;
    state: RootState;
    rejectValue: ErrorResponse;
  }
>('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const response = await fetch('https://norma.nomoreparties.space/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      return rejectWithValue({
        message: data.message || 'Ошибка регистрации',
      });
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue({
        message: error.message || 'Неизвестная ошибка',
      });
    }
    return rejectWithValue({
      message: 'Неизвестная ошибка',
    });
  }
});

export const loginUser = createAsyncThunk<
  AuthResponse,
  LoginData,
  {
    dispatch: AppDispatch;
    state: RootState;
    rejectValue: ErrorResponse;
  }
>('auth/login', async (userData, { rejectWithValue }) => {
  try {
    const response = await fetch('https://norma.nomoreparties.space/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      return rejectWithValue({
        message: data.message || 'Ошибка авторизации',
      });
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue({
        message: error.message || 'Неизвестная ошибка',
      });
    }
    return rejectWithValue({
      message: 'Неизвестная ошибка',
    });
  }
});

export const logoutUser = createAsyncThunk<
  LogoutResponse,
  void,
  {
    dispatch: AppDispatch;
    state: RootState;
    rejectValue: ErrorResponse;
  }
>('auth/logout', async (_, { rejectWithValue }) => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      return rejectWithValue({
        message: 'Токен не найден',
      });
    }

    const response = await fetch('https://norma.nomoreparties.space/api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: refreshToken }),
    });

    const data = await response.json();

    if (!response.ok) {
      return rejectWithValue({
        message: data.message || 'Ошибка выхода',
      });
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue({
        message: error.message || 'Неизвестная ошибка',
      });
    }
    return rejectWithValue({
      message: 'Неизвестная ошибка',
    });
  }
});

export const refreshToken = createAsyncThunk<
  TokenResponse,
  void,
  {
    dispatch: AppDispatch;
    state: RootState;
    rejectValue: ErrorResponse;
  }
>('auth/refreshToken', async (_, { rejectWithValue }) => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      return rejectWithValue({
        message: 'Токен не найден',
      });
    }

    const response = await fetch('https://norma.nomoreparties.space/api/auth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: refreshToken }),
    });

    const data = await response.json();

    if (!response.ok) {
      return rejectWithValue({
        message: data.message || 'Ошибка обновления токена',
      });
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue({
        message: error.message || 'Неизвестная ошибка',
      });
    }
    return rejectWithValue({
      message: 'Неизвестная ошибка',
    });
  }
});

export const getUser = createAsyncThunk<
  { success: boolean; user: UserData },
  void,
  {
    dispatch: AppDispatch;
    state: RootState;
    rejectValue: ErrorResponse;
  }
>('auth/getUser', async (_, { rejectWithValue }) => {
  try {
    const accessToken = getCookie('accessToken');
    if (!accessToken) {
      return rejectWithValue({
        message: 'Токен не найден',
      });
    }

    const response = await fetch('https://norma.nomoreparties.space/api/auth/user', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return rejectWithValue({
        message: data.message || 'Ошибка получения данных пользователя',
      });
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue({
        message: error.message || 'Неизвестная ошибка',
      });
    }
    return rejectWithValue({
      message: 'Неизвестная ошибка',
    });
  }
});

export const updateUser = createAsyncThunk<
  { success: boolean; user: UserData },
  { email: string; name: string; password?: string },
  {
    dispatch: AppDispatch;
    state: RootState;
    rejectValue: ErrorResponse;
  }
>('auth/updateUser', async (userData, { rejectWithValue }) => {
  try {
    const accessToken = getCookie('accessToken');
    if (!accessToken) {
      return rejectWithValue({
        message: 'Токен не найден',
      });
    }

    const response = await fetch('https://norma.nomoreparties.space/api/auth/user', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      return rejectWithValue({
        message: data.message || 'Ошибка обновления данных пользователя',
      });
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue({
        message: error.message || 'Неизвестная ошибка',
      });
    }
    return rejectWithValue({
      message: 'Неизвестная ошибка',
    });
  }
});