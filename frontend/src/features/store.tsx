import { configureStore } from '@reduxjs/toolkit';
import checkModalReducer from './slicers/checkSlice';


export const store = configureStore({
    reducer : {
        checkModal: checkModalReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;