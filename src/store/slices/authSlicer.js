import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api.js';

const BASE_URL = import.meta.env.VITE_BASE_BACKEND_URL;

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`${BASE_URL}/users/me/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const token = localStorage.getItem('access_token');

const authSlicer = createSlice({
  name: 'auth',
  initialState: {
    token: token || null,
    user: null,
    isAuthenticated: !!token,
    loading: false,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    addToken: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user || null;
      state.isAuthenticated = true;
      localStorage.setItem('access_token', action.payload.token);
    },
    removeToken: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('access_token');
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.user = null;
        state.loading = false;
      });
  },
});

export const { addToken, removeToken, setLoading } = authSlicer.actions;
export default authSlicer.reducer;
