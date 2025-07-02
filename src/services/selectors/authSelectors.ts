import { RootState } from '../store/store';
import { IUser } from '../../utils/types';

export const selectIsAuthenticated = (state: RootState): boolean => state.auth.isAuth;
export const selectUser = (state: RootState): IUser | null => state.auth.user;
export const selectAuthError = (state: RootState): string | null => state.auth.error;
export const selectAuthLoading = (state: RootState): boolean => state.auth.isLoading;
export const selectAuthState = (state: RootState) => state.auth;