import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

import AppRoutes from "./routes/AppRoutes";

function AuthStoreSynchronizer() {
  const { getToken, userId, isLoaded } = useAuth();

  useEffect(() => {
    if (isLoaded) {
      window.clerkGetToken = getToken;
      window.clerkUserId = userId;
    }
  }, [isLoaded, userId, getToken]);

  return null;
}

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AuthStoreSynchronizer />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
