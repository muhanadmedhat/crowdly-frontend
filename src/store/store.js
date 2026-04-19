import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlicer';
import uiReducer from './slices/uiSlicer';

const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
  },
});
export default store;