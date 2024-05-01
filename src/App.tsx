import { Outlet, Router } from "@tanstack/react-location";
import { location, routes } from "./routes";

const App = () => {
  return (
    <div>
      <Router routes={routes} location={location}>
        <Outlet />
      </Router>
    </div>
  );
};

export default App;
