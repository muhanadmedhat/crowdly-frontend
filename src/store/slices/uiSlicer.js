import { createSlice } from '@reduxjs/toolkit';

const uiSlicer = createSlice({
  name: 'ui',
  initialState: { loadingCount: 0 },
  reducers: {
    showLoading: (state) => {
      state.loadingCount += 1;
    },
    hideLoading: (state) => {
      state.loadingCount = Math.max(0, state.loadingCount - 1);
    },
  },
});
export default uiSlicer.reducer;
export const { showLoading, hideLoading } = uiSlicer.actions;
