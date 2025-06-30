// src/utils/types.ts
export type TIngredientType = 'bun' | 'sauce' | 'main';

export interface IIngredient {
  _id: string;
  name: string;
  type: TIngredientType;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_mobile: string;
  image_large: string;
  __v: number;
  uniqueId?: string;
}

export type TOrderStatus = 'created' | 'pending' | 'done';

export interface IOrder {
  _id: string;
  ingredients: string[];
  status: TOrderStatus;
  name: string;
  createdAt: string;
  updatedAt: string;
  number: number;
}

export interface IOrderWithIngredients extends Omit<IOrder, 'ingredients'> {
  ingredients: IIngredient[];
  totalPrice: number;
}

export interface IOrdersResponse {
  success: boolean;
  orders: IOrder[];
  total: number;
  totalToday: number;
}

export interface IOrderResponse {
  name: string;
  order: {
    number: number;
  };
  success: boolean;
}

export interface IUser {
  email: string;
  name: string;
}

export interface IApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  [key: string]: any;
}

export interface ITokens {
  accessToken: string;
  refreshToken: string;
}

export interface IAuthResponse extends IApiResponse {
  user: IUser;
  accessToken: string;
  refreshToken: string;
}

export interface ICookieOptions {
  expires?: number | Date | string;
  [key: string]: any;
}

export interface IConstructorState {
  bun: IIngredient | null;
  ingredients: IIngredient[];
  orderNumber: number | null;
  orderLoading: boolean;
  orderError: string | null;
}

export interface IIngredientsState {
  items: IIngredient[];
  loading: boolean;
  error: string | null;
  currentIngredient: IIngredient | null;
}

export interface IAuthState {
  isAuth: boolean;
  user: IUser | null;
  isLoading: boolean;
  error: string | null;
}

export interface IOrdersState {
  feed: IOrder[];
  userOrders: IOrder[];
  loading: boolean;
  error: string | null;
  total: number;
  totalToday: number;
  currentOrder: IOrder | null;
  wsConnected: boolean;
}

export interface RootState {
  auth: IAuthState;
  ingredients: IIngredientsState;
  burgerConstructor: IConstructorState;
  orders: IOrdersState;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  password: string;
  token: string;
}

// Добавляем типы для WebSocket
export interface SocketAction {
  type: 'orders/connect' | 'orders/disconnect';
  payload?: string;
}

export interface IOrdersState {
  feed: IOrder[];
  userOrders: IOrder[];
  loading: boolean;
  error: string | null;
  total: number;
  totalToday: number;
  currentOrder: IOrder | null;
  wsConnected: boolean;
  wsError: string | null; // Добавлено это поле
}

export interface IOrderWithIngredients extends Omit<IOrder, 'ingredients'> {
  ingredients: IIngredient[];
  totalPrice: number;
}