import { createContext } from "react";

export const mapPointsContext = createContext({
  mapPoints: [] as any,
  setMapPoints: Function as any,
});
