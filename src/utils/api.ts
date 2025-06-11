import { setCookie, getCookie, deleteCookie } from './cookie';

export const API_URL = 'https://norma.nomoreparties.space/api';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  [key: string]: any;
}

interface TokenResponse {
  success: boolean;
  accessToken: string;
  refreshToken: string;
}

interface RefreshTokenRequest {
  token: string;
}

interface UserRegistrationRequest {
  email: string;
  password: string;
  name: string;
}

interface UserLoginRequest {
  email: string;
  password: string;
}

interface UserUpdateRequest {
  email: string;
  name: string;
  password?: string;
}

interface OrderRequest {
  ingredients: string[];
}

interface ResetPasswordRequest {
  password: string;
  token: string;
}

interface ForgotPasswordRequest {
  email: string;
}

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null): void => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export async function request<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

export const refreshTokenRequest = async (
  token: string
): Promise<TokenResponse> => {
  try {
    const response = await fetch(`${API_URL}/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Token refresh failed');
    }

    const data = await response.json();

    if (!data.success || !data.accessToken || !data.refreshToken) {
      throw new Error('Invalid token response structure');
    }

    return {
      success: data.success,
      accessToken: data.accessToken.replace('Bearer ', ''),
      refreshToken: data.refreshToken,
    };
  } catch (error) {
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
    throw error;
  }
};

export const fetchWithRefresh = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  let accessToken = getCookie('accessToken');

  if (!accessToken) {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) throw new Error('No tokens available');

    try {
      const { accessToken: newToken, refreshToken: newRefreshToken } = 
        await refreshTokenRequest(refreshToken);
      
      accessToken = newToken;
      setCookie('accessToken', accessToken, { expires: 1200 });
      localStorage.setItem('refreshToken', newRefreshToken);
    } catch (error) {
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
      throw error;
    }
  }

  try {
    return await request<T>(endpoint, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error) {
    if (error instanceof Error && 
        (error.message.includes('jwt expired') || 
         error.message.includes('Invalid or missing token'))) {
      
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => fetchWithRefresh<T>(endpoint, options))
          .catch(err => { throw err; });
      }

      isRefreshing = true;
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        deleteCookie('accessToken');
        localStorage.removeItem('refreshToken');
        throw new Error('No refresh token');
      }

      try {
        const { accessToken: newToken, refreshToken: newRefreshToken } = 
          await refreshTokenRequest(refreshToken);
        
        setCookie('accessToken', newToken, { expires: 1200 });
        localStorage.setItem('refreshToken', newRefreshToken);
        processQueue(null, newToken);
        
        return request<T>(endpoint, {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${newToken}`,
          },
        });
      } catch (refreshError) {
        processQueue(refreshError, null);
        throw refreshError;
      } finally {
        isRefreshing = false;
      }
    }
    throw error;
  }
};

export const registerUserRequest = (
  userData: UserRegistrationRequest
): Promise<ApiResponse> => {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

export const loginUserRequest = (
  credentials: UserLoginRequest
): Promise<ApiResponse> => {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
};

export const logoutUserRequest = (
  token: string
): Promise<ApiResponse> => {
  return request('/auth/logout', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
};

export const getUserRequest = (): Promise<ApiResponse> => {
  return fetchWithRefresh('/auth/user', {
    method: 'GET',
  });
};

export const updateUserRequest = (
  userData: UserUpdateRequest
): Promise<ApiResponse> => {
  return fetchWithRefresh('/auth/user', {
    method: 'PATCH',
    body: JSON.stringify(userData),
  });
};

export const createOrderRequest = (
  ingredientIds: string[]
): Promise<ApiResponse<{order: {number: number}}>> => {
  return fetchWithRefresh('/orders', {
    method: 'POST',
    body: JSON.stringify({ ingredients: ingredientIds }),
  });
};

export const forgotPasswordRequest = (
  email: string
): Promise<ApiResponse> => {
  return request('/password-reset', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
};

export const resetPasswordRequest = (
  data: ResetPasswordRequest
): Promise<ApiResponse> => {
  return request('/password-reset/reset', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};