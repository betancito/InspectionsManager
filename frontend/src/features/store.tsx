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
        // Ignore these action types
        ignoredActions: ['checkModal/setPhoto'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.photo'],
        // Ignore these paths in the state
        ignoredPaths: ['checkModal.photo'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;