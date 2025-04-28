import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './rootReducer';

// Создаем store
const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
});

// Экспортируем store как default
export default store;

// Для TypeScript типов
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;