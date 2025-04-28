import {
    CREATE_ORDER_REQUEST,
    CREATE_ORDER_SUCCESS,
    CREATE_ORDER_FAILED,
    RESET_ORDER,
  } from './types';
  
  const initialState = {
    orderNumber: null,
    orderRequest: false,
    orderFailed: false,
  };
  
  export const orderReducer = (state = initialState, action) => {
    switch (action.type) {
      case CREATE_ORDER_REQUEST:
        return { ...state, orderRequest: true, orderFailed: false };
      case CREATE_ORDER_SUCCESS:
        return { ...state, orderNumber: action.payload, orderRequest: false };
      case CREATE_ORDER_FAILED:
        return { ...state, orderRequest: false, orderFailed: true };
      case RESET_ORDER:
        return initialState;
      default:
        return state;
    }
  };