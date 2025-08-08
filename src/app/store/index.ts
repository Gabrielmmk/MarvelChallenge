import { configureStore } from '@reduxjs/toolkit';
import comicsReducer from './comicsSlice';

export const store = configureStore({
  reducer: {
    comics: comicsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
