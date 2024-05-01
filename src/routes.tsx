import { Navigate, ReactLocation, Route } from "@tanstack/react-location";
import { Game } from "./pages/Game/Game";
import { HowToPlay } from "./pages/HowToPlay/HowToPlay";

export const location = new ReactLocation();

export const routes: Route[] = [
  {
    id: "navigate-to-game",
    path: "/",
    element: <Navigate to="/game" replace />,
  },
  {
    path: "/game",
    element: <Game />,
  },
  {
    path: "/how-to-play",
    element: <HowToPlay />,
  },
];
