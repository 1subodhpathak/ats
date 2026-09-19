import { Outlet, useLocation } from "react-router-dom";

import Footer from "./Footer";
import Navbar from "./Navbar";

function AppLayout() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const isPrintMode = queryParams.get("printMode") === "1";
  const isEmbedded = queryParams.get("embeddedPreview") === "1";
  const isResumeGameRoute = location.pathname === "/play-with-resume";
  const isHomeRoute = location.pathname === "/";
  const isDashboardRoute = location.pathname === "/dashboard";
  const isATSStartRoute = location.pathname === "/check-ats";
  const shouldHideNavbar = isResumeGameRoute || isDashboardRoute || isATSStartRoute || isPrintMode || isEmbedded;

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      {!shouldHideNavbar ? <Navbar /> : null}
      <div className={shouldHideNavbar ? "w-full overflow-x-hidden" : "page-shell w-full overflow-x-hidden"}>
        <main className={shouldHideNavbar ? "min-w-0 overflow-x-hidden" : "min-w-0 space-y-4 overflow-x-hidden"}>
          <Outlet />
          {!isResumeGameRoute && isHomeRoute ? <Footer /> : null}
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
