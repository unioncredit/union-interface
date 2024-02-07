import { allRoutes, general as generalRoutes } from "../App.routes";
import { matchRoutes } from "react-router-dom";

export const is404 = (location) =>
  !allRoutes.some((r) => {
    // Exact match
    if (r.path === location.pathname) return true;

    // Check for paths parameters
    if (r.path.includes(":")) {
      const index = r.path.indexOf(":");
      const substring = index !== -1 ? r.path.substring(0, index) : r.path;
      return location.pathname.startsWith(substring);
    }
  });

export const isGeneralRoute = (location) => Boolean(matchRoutes(generalRoutes, location));
