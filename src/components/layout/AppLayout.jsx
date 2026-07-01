import { Outlet, useLocation } from "react-router-dom";

import Footer from "./Footer";
import Navbar from "./Navbar";

function AppLayout() {
  const location = useLocation();
  const isResumeGameRoute = location.pathname === "/play-with-resume";
  const isHomeRoute = location.pathname === "/";
  const isDashboardRoute = location.pathname === "/dashboard";
  const shouldHideNavbar = isResumeGameRoute || isDashboardRoute;

  return (
    <div className="min-h-screen">
      {!shouldHideNavbar ? <Navbar /> : null}
      <div className={shouldHideNavbar ? "w-full" : "page-shell"}>
        <main className={shouldHideNavbar ? "min-w-0" : "min-w-0 space-y-4"}>
          <Outlet />
          {!isResumeGameRoute && isHomeRoute ? <Footer /> : null}
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
