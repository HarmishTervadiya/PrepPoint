import {configureStore} from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import questionReducer from './features/uploadQuestion/questionSlice';
import subjectReducer from './features/uploadQuestion/subjectSlice';
import questionContentReducer from './features/content/questionSlice';
import userProfileReducer from './features/userProfile/userProfileSlice';

import {useDispatch, useSelector} from 'react-redux';

const store = configureStore({
  reducer: {
    authReducer,
    questionReducer,
    subjectReducer,
    questionContentReducer,
    userProfileReducer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      //   serializableCheck: false, // Disable serializability check
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export default store;
