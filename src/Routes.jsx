import { useAccount } from "wagmi";
import { Routes as ReactRoutes, Route } from "react-router-dom";

import * as routes from "./App.routes";
import { useMember } from "providers/MemberData";

import ErrorPage from "pages/Error";
import ConnectPage from "pages/Connect";
import LoadingPage from "pages/Loading";

export default function Routes() {
  const { data = {}, isLoading } = useMember();

  const { isConnected } = useAccount();

  const needsToConnect = !isConnected;

  const getElement = (Component, props) =>
    needsToConnect ? (
      <ConnectPage />
    ) : isLoading ? (
      <LoadingPage />
    ) : (
      <Component {...props} />
    );

  /*--------------------------------------------------------------
    App Routes Setup 
   --------------------------------------------------------------*/

  const memberRoutes = routes.member.map(
    ({ path, component: Component, props }) => (
      <Route path={path} element={getElement(Component, props)} />
    )
  );

  const nonMemberRoutes = routes.nonMember.map(
    ({ path, component: Component, props }) => (
      <Route path={path} element={getElement(Component, props)} />
    )
  );

  const generalRoutes = routes.general.map(
    ({ path, component: Component, props }) => (
      <Route path={path} element={<Component {...props} />} />
    )
  );

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <ReactRoutes>
      {
        // If the app needs to connect then make all the routes available
        // as we don't yet know the users membership status. Once connected
        // We then filter the routes and can redirect or 404 routes accordingly
      }
      {needsToConnect
        ? [...memberRoutes, ...nonMemberRoutes]
        : data.isMember
        ? memberRoutes
        : nonMemberRoutes}
      {
        // General routes are available publically without connecting
      }
      {generalRoutes}
      {
        // Fallback to a 404 error if all else fails
      }
      <Route
        path="*"
        element={
          <ErrorPage
            title="Oh no! You just came across an error."
            body="Something broke while you were using the app. Try reloading the page or use one of the helpful links below."
          />
        }
      />
    </ReactRoutes>
  );
}
