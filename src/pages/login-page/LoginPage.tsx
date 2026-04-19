import axios from 'axios';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { addToken } from '../../store/slices/authSlicer';
import toast from 'react-hot-toast';
import GoogleButton from '../../components/GoogleButton/GoogleButton';
import LoginForm from './LoginForm';
import LoginLeftPanel from './LoginLeftPanel';
import withLoading from '../../utils/WithLoading.tsx';

const backendURL = import.meta.env.VITE_BASE_BACKEND_URL;

export default function LoginPage() {
  const dispatch = useDispatch();


  const loginUser = (values: any) =>
    withLoading(async (dispatch) => {
      const token = localStorage.getItem("access_token");
      
      if (token) {
        dispatch(addToken({ token, user: null }));
        return
      }

      const response = await axios.post(`${backendURL}/auth/login/`, values, {
        withCredentials: true,
      });
      const data = response.data;
      
      dispatch(addToken({ token: data.access, user: data.user }));
      toast.success('Successfully logged in!');
    });


  const handleLogin = (values: any) => {
    dispatch(loginUser(values) as any);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden font-[var(--font-display)] antialiased bg-white">
      {/* Left Panel — hidden on mobile */}
      <div className="hidden md:flex md:flex-1 lg:flex-[1.1]">
        <LoginLeftPanel />
      </div>
      {/* Right Panel */}
      <div className="flex-1 lg:flex-[1.4] bg-white flex justify-center items-center p-8 lg:p-12 h-full overflow-y-auto relative border-l border-[#f1f1f1]">
        <div className="w-full max-w-[420px]">
          <h2 className="text-3xl md:text-4xl font-bold text-[#111] mb-2 tracking-tight">
            Log in to your account
          </h2>
          <p className="font-[var(--font-serif)] italic text-lg md:text-xl text-[#666] mb-8">
            Help drive the next big human-first initiative.
          </p>

          <GoogleButton />

          <div className="flex items-center text-center mb-8">
            <div className="flex-1 border-b border-[#eee]"></div>
            <span className="px-4 text-[#aaa] text-[10px] font-bold tracking-[0.15em] uppercase">
              OR CONTINUE WITH
            </span>
            <div className="flex-1 border-b border-[#eee]"></div>
          </div>
          <LoginForm handleLogin={handleLogin} />
          <div className="flex justify-end mb-8">
            <Link
              to="/send-reset-password"
              className="text-[10px] font-bold tracking-[0.1em] text-[#666] uppercase no-underline border-b border-[#aaa] pb-[1px] transition-colors hover:text-[#333] hover:border-[#333]"
            >
              FORGOT YOUR PASSWORD?
            </Link>
          </div>

          <div className="text-center text-[15px] text-[#666]">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-[#ff5021] hover:text-[#ff5021] opacity-90 hover:opacity-100 font-bold no-underline ml-1 transition-colors"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
