import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { business } from "../config/business";
export function StoreLayout() {
  const location = useLocation();
  const previousPath = useRef(location.pathname);
  useEffect(() => {
    window.scrollTo(0, 0);
    const title =
      location.pathname === "/"
        ? "Homeware & everyday essentials"
        : location.pathname
            .split("/")
            .filter(Boolean)
            .map((part) => part.replace(/-/g, " "))
            .join(" · ");
    document.title = `${title.charAt(0).toUpperCase() + title.slice(1)} | ${business.businessName}`;
    if (previousPath.current !== location.pathname) {
      document.getElementById("main")?.focus({ preventScroll: true });
    }
    previousPath.current = location.pathname;
  }, [location.pathname]);
  return (
    <>
      <Header />
      <div className="demo-notice">
        DEVELOPMENT PREVIEW{" "}
        <span>
          Sample products & illustrative artwork. Real catalogue products coming
          next.
        </span>
      </div>
      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
