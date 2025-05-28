// authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  registerUser,
  loginUser,
  logoutUser,
  checkUserAuth,
  updateUser
} from '../actions/authActions';
import { setCookie, deleteCookie } from '../../utils/cookie';

interface User {
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isAuth: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuth: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    forceLogout: (state) => {
      state.isAuth = false;
      state.user = null;
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkUserAuth.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        if (action.payload === 'No tokens available') {
          state.isAuth = false;
          state.user = null;
        } else {
          state.error = action.payload;
        }
      })
      .addCase(logoutUser.fulfilled, (state: AuthState) => {
        state.isLoading = false;
        state.isAuth = false;
        state.user = null;
        deleteCookie('accessToken');
        localStorage.removeItem('refreshToken');
      })
      .addMatcher(
        (action) => action.type.startsWith('auth/') && action.type.endsWith('/pending'),
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith('auth/') && action.type.endsWith('/rejected'),
        (state, action: PayloadAction<string>) => {
          state.isLoading = false;
          state.error = action.payload;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith('auth/') && 
                 action.type.includes('fulfilled') && 
                 !action.type.includes('logout'),
        (state, action: PayloadAction<{user: User; accessToken?: string; refreshToken?: string}>) => {
          state.isLoading = false;
          state.isAuth = true;
          state.user = action.payload.user;
          if (action.payload.accessToken) {
            setCookie('accessToken', action.payload.accessToken.split('Bearer ')[1], { expires: 1200 });
          }
          if (action.payload.refreshToken) {
            localStorage.setItem('refreshToken', action.payload.refreshToken);
          }
        }
      );
  },
});

export const { clearError, forceLogout } = authSlice.actions;
export default authSlice.reducer;