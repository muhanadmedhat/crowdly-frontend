import { showLoading, hideLoading } from '../store/slices/uiSlicer.js';
import toast from 'react-hot-toast';
import store from '../store/store.js';

const withLoading = (input: any) => {
  if (input instanceof Promise) {
    store.dispatch(showLoading());
    return input
      .catch((err: any) => {
        const backendMessage = err.response?.data;
        const errorMessage =
          typeof backendMessage === 'string'
            ? backendMessage
            : backendMessage?.message || err.message || 'An error occurred';
        toast.error(errorMessage);
        throw err;
      })
      .finally(() => {
        store.dispatch(hideLoading());
      });
  }

  if (typeof input === 'function') {
    return async (dispatch: any, getState: any) => {
      dispatch(showLoading());
      try {
        return await input(dispatch, getState);
      } catch (err: any) {
        const backendMessage = err.response?.data;
        const errorMessage =
          typeof backendMessage === 'string' ? backendMessage : err.message || 'An error occurred';
        toast.error(errorMessage);
        throw err;
      } finally {
        dispatch(hideLoading());
      }
    };
  }
  return input;
};

export default withLoading;
