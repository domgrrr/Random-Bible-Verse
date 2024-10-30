import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  toast: {
    message: '',
    isShowing: false
  }
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showToast: (state, action) => {
      state.toast.message = action.payload;
      state.toast.isShowing = true;
    },
    hideToast: (state) => {
      state.toast.isShowing = false;
    }
  }
});

export const { showToast, hideToast } = uiSlice.actions;

export default uiSlice.reducer;