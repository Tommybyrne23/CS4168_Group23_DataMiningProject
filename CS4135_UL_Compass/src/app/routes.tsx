import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Home } from "./components/pages/Home";
import { Map } from "./components/pages/Map";
import { Search } from "./components/pages/Search";
import { Favorites } from "./components/pages/Favorites";
import { RoomDetails } from "./components/pages/RoomDetails";
import { NotFound } from "./components/pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "map", Component: Map },
      { path: "search", Component: Search },
      { path: "favorites", Component: Favorites },
      { path: "room/:roomId", Component: RoomDetails },
      { path: "*", Component: NotFound },
    ],
  },
]);
