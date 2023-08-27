import {
    configureStore,
    ThunkAction,
    Action,
    combineReducers,
} from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import authReducer from '../features/auth/authSlice';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './rootSaga';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

const sagaMiddleware = createSagaMiddleware();

const persistConfig = {
    key: 'root',
    storage: storage,
    whitelist: ['auth'],
};

const rootReducer = combineReducers({
    counter: counterReducer,
    auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
