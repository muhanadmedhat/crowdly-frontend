import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import './index.css';
import App from './App.tsx';
import store from './store/store.js';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Provider } from 'react-redux';
import StripeWrapper from './stripe/StripeWrapper.tsx';
const googleClientId =
  import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your-google-client-id.apps.googleusercontent.com';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StripeWrapper>
      <Provider store={store}>
        <GoogleOAuthProvider clientId={googleClientId}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </GoogleOAuthProvider>
      </Provider>
    </StripeWrapper>
  </StrictMode>
);
