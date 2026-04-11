import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { Provider } from 'react-redux'
import './index.css'
import App from './App.tsx'
createRoot(document.getElementById('root')!).render(
  //add redux here
  <StrictMode>
    <BrowserRouter>
    {/* <Provider store={}> */}
      <App />
    {/* </Provider> */}
    </BrowserRouter>
  </StrictMode>,
)
