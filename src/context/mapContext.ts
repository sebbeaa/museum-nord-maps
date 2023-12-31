import { createContext } from "react";
import { geoData, MapPoint, mapPoint } from "../types/mapPoint";
//initial map state
export const mapContext = createContext({
  mapPoints: [] as MapPoint[] | undefined,
  setMapPoints: Function as React.ComponentState,
  latLng: {
    center: {
      lng: 15.39809795685471,
      lat: 68.70617912489878,
    },
    zoom: 14,
    bearing: 0,
    pitch: 0,
  } as mapPoint | undefined,
  setLatLng: Function as React.ComponentState,
  enabled: false as boolean,
  setEnabled: Function as React.ComponentState,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialMarker: {} as any,
  setInitialMarker: Function as React.ComponentState,
  initalMarkerUrl: "" as string | undefined,
  setInitialMarkerUrl: Function as React.ComponentState,
  geoJson: {
    geoUrl: "" as string,
    layerOptions: {
      layerStyle: "" as string,
      polygonStyle: {
        polygonOpacity: 0 as number,
        polygonColor: {
          label: "" as string,
          value: "" as string,
        },
        polygonLineColor: {
          label: "" as string,
          value: "#ccc" as string,
        },
      },
    },
  } as geoData | undefined,
  setGeoJson: Function as React.ComponentState,
});

export default Map;
