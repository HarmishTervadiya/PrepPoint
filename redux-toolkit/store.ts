import {configureStore} from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import {useDispatch} from 'react-redux';

const store = configureStore({
  reducer: {
    authReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
    //   serializableCheck: false, // Disable serializability check
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

export default store;
