import { createStore, compose, applyMiddleware } from 'redux';
import { rootReducer } from '../reducers';

const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose;

const enhancer = composeEnhancers(applyMiddleware());

// Перенесите объявление store после определения enhancer
const store = createStore(rootReducer, enhancer);

export default store;