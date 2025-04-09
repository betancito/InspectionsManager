import React from "react";
import ReactDOM from "react-dom/client";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import 'leaflet/dist/leaflet.css';
import "./index.css";
import AppRouter from "./routes/Router";
import { store } from "./features/store";
import { Provider } from 'react-redux';
import setupAxiosInterceptors from "./services/axiosInterceptor";
import { Auth0Provider } from "@auth0/auth0-react";
import { AUTH0_CLIENT_ID, AUTH0_DOMAIN, AUTH0_API_IDENTIFIER} from "./utils/types";

//Axios interceptor before main renders
// setupAxiosInterceptors();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Auth0Provider
      domain={AUTH0_DOMAIN}
      clientId={AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri : window.location.origin,
        audience : AUTH0_API_IDENTIFIER,
      }}
    >
        <Provider store={store}>
          <Auth0Provider>
            <AppRouter />
          </Auth0Provider>
        </Provider>
    </Auth0Provider>
  </React.StrictMode>
);
