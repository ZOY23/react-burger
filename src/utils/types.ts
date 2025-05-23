// Типы для ингредиентов
export interface IIngredient {
  _id: string;
  name: string;
  type: 'bun' | 'sauce' | 'main';
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_mobile: string;
  image_large: string;
  __v: number;
  uuid?: string;
  uniqueId?: string;
}

// Типы для заказов
export interface IOrderResponse {
  name: string;
  order: {
    number: number;
  };
  success: boolean;
}

export interface IOrderDetails {
  orderNumber: number | null;
  loading: boolean;
  error: string | null;
}

// Типы для авторизации
export interface IUser {
  email: string;
  name: string;
}

export interface IAuthResponse {
  success: boolean;
  user: IUser;
  accessToken: string;
  refreshToken: string;
}

export interface ITokenResponse {
  success: boolean;
  accessToken: string;
  refreshToken: string;
}

export interface ILogoutResponse {
  success: boolean;
  message: string;
}

export interface IAuthState {
  user: IUser | null;
  isAuth: boolean;
  isLoading: boolean;
  error: string | null;
}

// Типы для конструктора бургера
export interface IngredientsState {
  items: IIngredient[];
  loading: boolean;
  error: string | null;
  currentIngredient: IIngredient | null;
}

// Типы для списка ингредиентов
export interface IngredientsState {
  items: IIngredient[];
  loading: boolean;
  error: string | null;
}

// Общий тип состояния хранилища
export interface IRootState {
  ingredients: IngredientsState;
  burgerConstructor: ConstructorState;
  auth: IAuthState;
  orderDetails: IOrderDetails;
}

// Типы для форм
export interface ILoginForm {
  email: string;
  password: string;
}

export interface IRegisterForm extends ILoginForm {
  name: string;
}

export interface IResetPasswordForm {
  password: string;
  token: string;
}

export interface IForgotPasswordForm {
  email: string;
}

// utils/types.ts
export interface IIngredient {
  _id: string;
  name: string;
  type: 'bun' | 'sauce' | 'main';
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

export interface ConstructorState {
  bun: IIngredient | null;
  ingredients: IIngredient[];
  orderNumber: number | null;
  orderLoading: boolean;
  orderError: string | null;
}
