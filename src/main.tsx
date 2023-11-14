import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./styles/theme";
import App from './App.tsx'
import './index.css'
import {
  PublicClientApplication,
  EventType,
  EventMessage,
  AuthenticationResult,
} from "@azure/msal-browser";
import { msalConfig } from './authConfig';

/**
 * MSAL should be instantiated outside of the component tree to prevent it from being re-instantiated on re-renders.
 * For more, visit: https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/getting-started.md
 */
export const msalInstance = new PublicClientApplication(msalConfig);

msalInstance.initialize().then(() => {
  // Account selection logic is app dependent. Adjust as needed for different use cases.
  const accounts = msalInstance.getAllAccounts();
  if (accounts.length > 0) {
      msalInstance.setActiveAccount(accounts[0]);
  }

  msalInstance.addEventCallback((event: EventMessage) => {
      if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
          const payload = event.payload as AuthenticationResult;
          const account = payload.account;
          msalInstance.setActiveAccount(account);
      }
  });

  const root = ReactDOM.createRoot(
      document.getElementById("root") as HTMLElement
  );
  root.render(
    <Router>
    <ThemeProvider theme={theme}>
        <App pca={msalInstance} />
    </ThemeProvider>
</Router>
  );
});

// // Default to using the first account if no account is active on page load
// if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
//   // Account selection logic is app dependent. Adjust as needed for different use cases.
//   msalInstance.setActiveAccount(msalInstance.getActiveAccount()[0]);
// }

// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
// )
