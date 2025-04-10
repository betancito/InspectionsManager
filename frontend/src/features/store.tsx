import { configureStore } from '@reduxjs/toolkit';
import checkModalReducer from './slicers/dashboard/checkSlice';
import authSlice from './slicers/Auth/authSlice';
import activitiesSlice from './slicers/Details/activitiesSlice';


export const store = configureStore({
    reducer: {
      checkModal: checkModalReducer,
      auth: authSlice,
      createActivity:  activitiesSlice,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          // Ignore these specific action types
          ignoredActions: [
            'checkModal/setPhoto',
            //Auth ignored actions
            'auth/refreshToken/pending',
            'auth/refreshToken/fulfilled',
            'auth/refreshToken/rejected'
          ],
          // Or ignore specific paths
          ignoredActionPaths: ['payload.photo'],
          ignoredPaths: ['checkModal.photo'],

          //Auth ignored actions
          
        },
      }),
  });

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;