import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./routes/Router";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import 'leaflet/dist/leaflet.css';
import { store } from "./features/store";
import { Provider } from 'react-redux';


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <Provider store={store}>
        <AppRouter />
      </Provider>
    </AuthProvider>
  </React.StrictMode>
);
