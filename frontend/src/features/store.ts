import { configureStore } from '@reduxjs/toolkit';
import checkModalReducer from './slicers/dashboard/checkSlice';
import authReducer from './slicers/Auth/authSlice';
import activiyReducer from './slicers/Details/activitiesSlice';


export const store = configureStore({
    reducer: {
      checkModal: checkModalReducer,
      auth: authReducer,
      activities:  activiyReducer,
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
            'auth/refreshToken/rejected',
            //Activity ignored actions
            'activities/fetchActivities/pending',
            'activities/fetchActivities/fulfilled',
            'activities/fetchActivities/rejected',
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