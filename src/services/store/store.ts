import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import rootReducer from './rootReducer';
import { IIngredient } from '../../utils/types';

// Используем ReturnType для автоматического вывода типа
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActionPaths: ['payload.timestamp'],
        ignoredPaths: ['items.dates'],
      },
    }),
});

export const useAppDispatch = () => useDispatch<AppDispatch>();
export type IngredientsSelector = (state: RootState) => IIngredient[];
export type AuthStateSelector = (state: RootState) => RootState['auth'];