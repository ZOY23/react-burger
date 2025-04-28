import {
    ADD_CONSTRUCTOR_ITEM,
    REMOVE_CONSTRUCTOR_ITEM,
    RESET_CONSTRUCTOR,
    MOVE_CONSTRUCTOR_ITEM,
    SET_CONSTRUCTOR_BUN,
  } from './types';
  
  const initialState = {
    bun: null,
    ingredients: [],
  };
  
  export const constructorReducer = (state = initialState, action) => {
    switch (action.type) {
      case ADD_CONSTRUCTOR_ITEM:
        return {
          ...state,
          ingredients: [...state.ingredients, action.payload],
        };
      case REMOVE_CONSTRUCTOR_ITEM:
        return {
          ...state,
          ingredients: state.ingredients.filter((_, index) => index !== action.payload),
        };
      case RESET_CONSTRUCTOR:
        return initialState;
      case MOVE_CONSTRUCTOR_ITEM:
        const dragItem = state.ingredients[action.payload.dragIndex];
        const newItems = [...state.ingredients];
        newItems.splice(action.payload.dragIndex, 1);
        newItems.splice(action.payload.hoverIndex, 0, dragItem);
        return {
          ...state,
          ingredients: newItems,
        };
      case SET_CONSTRUCTOR_BUN:
        return {
          ...state,
          bun: action.payload,
        };
      default:
        return state;
    }
  };