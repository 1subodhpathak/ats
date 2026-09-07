import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";

import App from "./App";
import "./styles/globals.css";
import colorLogo from "./assets/logos/BlueLogo.png";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function cleanupDevServiceWorkers() {
  if (!import.meta.env.DEV || typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return;
  }

  const isLocalhost =
    window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

  if (!isLocalhost) {
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .getRegistrations()
      .then((registrations) => Promise.all(registrations.map((registration) => registration.unregister())))
      .catch(() => {});

    if ("caches" in window) {
      window.caches
        .keys()
        .then((keys) => Promise.all(keys.map((key) => window.caches.delete(key))))
        .catch(() => {});
    }
  });
}

cleanupDevServiceWorkers();


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {PUBLISHABLE_KEY ? (
      <ClerkProvider
        publishableKey={PUBLISHABLE_KEY}
        appearance={{
          variables: {
            colorPrimary: "#112250",
            colorText: "#0f172a",
            colorTextSecondary: "#64748b",
            colorBackground: "#ffffff",
            colorInputBackground: "#f8fafc",
            colorInputText: "#0f172a",
            borderRadius: "0.875rem",
            fontFamily: "inherit",
          },
          layout: {
            logoImageUrl: colorLogo,
            socialButtonsPlacement: "top",
            socialButtonsVariant: "blockButton",
            unsafe_disableDevelopmentModeWarnings: true,
          },
          elements: {
            modalBackdrop: "bg-slate-950/60 backdrop-blur-sm",
            modalContent: "mx-4",
            cardBox: "overflow-hidden rounded-3xl shadow-2xl shadow-slate-950/20",
            card: "border border-slate-200/80 shadow-none",
            logoImage: "h-12 w-12 object-contain",
            headerTitle: "text-2xl font-bold tracking-tight text-slate-900",
            headerSubtitle: "text-sm text-slate-500",
            socialButtonsBlockButton: "h-12 border-slate-200 bg-white text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50",
            dividerLine: "bg-slate-200",
            dividerText: "text-xs font-medium text-slate-400",
            formFieldLabel: "text-xs font-semibold text-slate-700",
            formFieldInput: "h-12 border-slate-200 bg-slate-50 text-sm text-slate-900 shadow-none focus:border-[#112250] focus:ring-[#112250]/20",
            formButtonPrimary: "h-12 bg-[#112250] text-sm font-semibold shadow-md shadow-[#112250]/20 hover:bg-[#3C507D]",
            footerActionText: "text-sm text-slate-500",
            footerActionLink: "text-sm font-semibold text-[#112250] hover:text-[#3C507D]",
            footer: "hidden",
            userButtonPopoverFooter: "hidden",
            userProfileFooter: "hidden",
          },
        }}
      >
        <App />
      </ClerkProvider>
    ) : (
      <App />
    )}
  </React.StrictMode>
);

