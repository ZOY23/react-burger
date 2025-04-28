import {
    ADD_CONSTRUCTOR_ITEM,
    REMOVE_CONSTRUCTOR_ITEM,
    RESET_CONSTRUCTOR,
    MOVE_CONSTRUCTOR_ITEM,
    SET_CONSTRUCTOR_BUN,
  } from './types';
  
  export const addConstructorItem = (item) => ({
    type: ADD_CONSTRUCTOR_ITEM,
    payload: item,
  });
  
  export const removeConstructorItem = (index) => ({
    type: REMOVE_CONSTRUCTOR_ITEM,
    payload: index,
  });
  
  export const resetConstructor = () => ({
    type: RESET_CONSTRUCTOR,
  });
  
  export const moveConstructorItem = (dragIndex, hoverIndex) => ({
    type: MOVE_CONSTRUCTOR_ITEM,
    payload: { dragIndex, hoverIndex },
  });
  
  export const setConstructorBun = (bun) => ({
    type: SET_CONSTRUCTOR_BUN,
    payload: bun,
  });