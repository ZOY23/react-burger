import authReducer, { 
  clearError, 
  forceLogout 
} from './authSlice';
import { 
  registerUser, 
  loginUser, 
  logoutUser, 
  checkUserAuth, 
  updateUser 
} from '../actions/authActions';

const initialState = {
  user: null,
  isAuth: false,
  isLoading: false,
  error: null,
};

describe('auth reducer', () => {
  it('should return initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle clearError', () => {
    const state = { ...initialState, error: 'Some error' };
    expect(authReducer(state, clearError())).toEqual(initialState);
  });

  it('should handle forceLogout', () => {
    const state = { 
      ...initialState, 
      isAuth: true, 
      user: { email: 'test@test.com', name: 'Test User' } 
    };
    expect(authReducer(state, forceLogout())).toEqual(initialState);
  });

  it('should handle registerUser.pending', () => {
    const action = { type: registerUser.pending.type };
    const state = authReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      isLoading: true,
      error: null
    });
  });

  it('should handle registerUser.fulfilled', () => {
    const user = { email: 'test@test.com', name: 'Test User' };
    const action = { 
      type: registerUser.fulfilled.type, 
      payload: { user, accessToken: 'token', refreshToken: 'refresh' } 
    };
    const state = authReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      isAuth: true,
      isLoading: false,
      user
    });
  });

  it('should handle registerUser.rejected', () => {
    const error = 'Registration failed';
    const action = { type: registerUser.rejected.type, payload: error };
    const state = authReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      isLoading: false,
      error
    });
  });

  it('should handle loginUser.pending', () => {
    const action = { type: loginUser.pending.type };
    const state = authReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      isLoading: true,
      error: null
    });
  });

  it('should handle logoutUser.fulfilled', () => {
    const state = { 
      ...initialState, 
      isAuth: true, 
      user: { email: 'test@test.com', name: 'Test User' } 
    };
    const action = { type: logoutUser.fulfilled.type };
    expect(authReducer(state, action)).toEqual(initialState);
  });

  it('should handle checkUserAuth.rejected with no tokens', () => {
    const action = { 
      type: checkUserAuth.rejected.type, 
      payload: 'No tokens available' 
    };
    expect(authReducer(initialState, action)).toEqual(initialState);
  });

  it('should handle updateUser.fulfilled', () => {
    const user = { email: 'updated@test.com', name: 'Updated User' };
    const action = { 
      type: updateUser.fulfilled.type, 
      payload: { user } 
    };
    const state = authReducer(
      { ...initialState, isAuth: true, user: { email: 'test@test.com', name: 'Test User' } },
      action
    );
    expect(state).toEqual({
      ...initialState,
      isAuth: true,
      isLoading: false,
      user
    });
  });
});