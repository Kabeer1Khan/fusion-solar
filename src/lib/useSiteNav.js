import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { scrollToId, scrollToTop } from "./lenis";

/* One place that decides what a nav click does, on every page:
   - goSection("service")  -> scrolls to that section on the Home page
                              (goes to Home first if you are on another page)
   - goPage("/about")      -> opens another page with the page transition */
export function useSiteNav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const goSection = useCallback(
    (id) => {
      if (id === "contact") return scrollToId("contact"); // footer is on every page
      if (pathname === "/") return id === "home" ? scrollToTop() : scrollToId(id);
      navigate("/", { state: { scrollTo: id } });
    },
    [pathname, navigate]
  );

  const goPage = useCallback(
    (to) => {
      if (pathname === to) return scrollToTop();
      navigate(to);
    },
    [pathname, navigate]
  );

  return { pathname, goSection, goPage };
}