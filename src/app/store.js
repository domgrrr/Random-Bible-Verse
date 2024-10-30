import { configureStore } from '@reduxjs/toolkit';
import verseReducer from '../features/verse/verseSlice';
import uiReducer from '../features/ui/uiSlice';

export const store = configureStore({
  reducer: {
    verse: verseReducer,
    ui: uiReducer,
  },
});