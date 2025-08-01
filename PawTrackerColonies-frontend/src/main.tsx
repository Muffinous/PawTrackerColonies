import * as React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { UserProvider } from './components/contexts/UserContextType';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <UserProvider>
    {/* <React.StrictMode> */}
    <App />
    {/* </React.StrictMode> */}
  </UserProvider>

);