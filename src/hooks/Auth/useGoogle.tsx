import api from '../../utils/api.js';
import { useGoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { setLoading, addToken } from '../../store/slices/authSlicer';
import toast from 'react-hot-toast';
export default function useGoogleLoginHandler() {
  const dispatch = useDispatch();
  return useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (codeResponse) => {
      dispatch(setLoading(true));
      try {
        const response = await api.post(
          '/auth/google/callback/',
          { code: codeResponse.code },
        );
        const data = response.data;
        dispatch(addToken({ token: data.access, user: data.user || null }));
        toast.success('Successfully logged in with Google!');
      } catch (error: any) {
        console.error('Google login error:', error.response?.data || error.message);
        toast.error(error.response?.data?.detail || 'Failed to complete Google login');
      } finally {
        dispatch(setLoading(false));
      }
    },
    onError: () => toast.error('Google Login failed'),
  });
}
