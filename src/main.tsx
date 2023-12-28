import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import Map from "./pages/map";
import {
  createHashRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { AppContext } from "./AppContext";
import { socket, SocketContext } from "./context/socketContext";

const router = createHashRouter(
  createRoutesFromElements(
    <>
      <Route path=":maps?/:token?" element={<Map />}></Route>
      <Route path="card/:point?/:token?" element={<Map />}></Route>
    </>
  )
);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <SocketContext.Provider value={socket}>
      <AppContext router={<RouterProvider router={router} />} />
    </SocketContext.Provider>
  </React.StrictMode>
);
