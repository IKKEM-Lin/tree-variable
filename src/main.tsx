import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import SettingList from './SettingList'
import { BrowserRouter, Routes, Route, Outlet  } from "react-router-dom";
import './index.css'

const Main = () => {
  // const location = useLocation();
  return (
    <section>
        <Routes>
          <Route path="/" element={<Outlet />}>
            <Route
              path="/"
              element={
                  <SettingList />
              }
            />
            <Route path="/:id" element={<App />} />
          </Route>
        </Routes>
    </section>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Main />
    </BrowserRouter>
  </React.StrictMode>,
)
