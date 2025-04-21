import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./routes/Router";
import "./index.css";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import 'leaflet/dist/leaflet.css';
import { store } from "./features/store";
import { Provider } from 'react-redux';
import setupAxiosInterceptors from "./services/axiosInterceptor";
import {Auth0Provider} from '@auth0/auth0-react'
import { AUTH0_CLIENT_ID, AUTH0_DOMAIN } from "./utils/types";
//Axios interceptor before main renders
setupAxiosInterceptors();


ReactDOM.createRoot(document.getElementById("root")!).render(
  <Auth0Provider
                domain={AUTH0_DOMAIN}
                clientId={AUTH0_CLIENT_ID}
                authorizationParams={{
                    redirect_uri: window.location.origin
                }}
        >
    <React.StrictMode>
          <Provider store={store}>
              <AppRouter />
          </Provider>
    </React.StrictMode>
   </Auth0Provider>
);
