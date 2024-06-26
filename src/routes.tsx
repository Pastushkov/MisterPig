import { Navigate, ReactLocation, Route } from "@tanstack/react-location";
import { Game } from "./pages/Game/Game";
import { HowToPlay } from "./pages/HowToPlay/HowToPlay";

export const location = new ReactLocation();

export const routes: Route[] = [
  {
    path: "/MisterPig",
    children: [
      {
        id: "navigate-to-game",
        path: "/",
        element: <Navigate to="/MisterPig/game" />,
      },
      {
        path: "/game",
        element: <Game />,
      },
      {
        path: "/how-to-play",
        element: <HowToPlay />,
      },
    ],
  },
];
