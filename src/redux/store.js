import {createStore, applyMiddleware} from 'redux';
import reducer from './reducer';
import {persistReducer} from 'redux-persist';
import {createLogger} from 'redux-logger';
import AsyncStorage from '@react-native-community/async-storage';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['LoginReducer'],
};

const persitedReducer = persistReducer(persistConfig, reducer);
const store = createStore(persitedReducer, applyMiddleware());

export default store;
