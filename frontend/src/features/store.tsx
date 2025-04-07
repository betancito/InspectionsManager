import { configureStore } from '@reduxjs/toolkit';
import checkModalReducer from './slicers/checkSlice';


export const store = configureStore({
    reducer: {
      checkModal: checkModalReducer,
      // other reducers
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          // Ignore these specific action types
          ignoredActions: ['checkModal/setPhoto'],
          // Or ignore specific paths
          ignoredActionPaths: ['payload.photo'],
          ignoredPaths: ['checkModal.photo'],
        },
      }),
  });

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;