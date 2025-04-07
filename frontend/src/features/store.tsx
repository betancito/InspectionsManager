import { configureStore } from '@reduxjs/toolkit';
import checkModalReducer from './slicers/checkSlice';


export const store = configureStore({
    reducer : {
        checkModal: checkModalReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['checkmodal/setPhoto'],
                ignoredActionPaths: ['payload.photoFile'],
                ignoredPaths: ['checkModal.photoFile'],
            },
        }),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;