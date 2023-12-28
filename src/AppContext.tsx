import "./App.css";
import { useState } from "react";
import { useMemo } from "react";
import { geoData, MapPoint, mapPoint } from "./types/mapPoint";
import { mapContext } from "./context/mapContext";
export const AppContext = ({ router }: { router: unknown }) => {
  const [mapPoints, setMapPoints] = useState<MapPoint[] | undefined>();
  const [latLng, setLatLng] = useState<mapPoint | undefined>();
  const [enabled, setEnabled] = useState<boolean>(false);
  const [initialMarker, setInitialMarker] = useState<any | undefined>(
    undefined
  );
  const [initalMarkerUrl, setInitialMarkerUrl] = useState<string>("");
  const [geoJson, setGeoJson] = useState<geoData | undefined>();
  const mapMemo = useMemo(
    () => ({
      mapPoints: mapPoints,
      setMapPoints: setMapPoints,
      latLng: latLng,
      setLatLng: setLatLng,
      enabled: enabled,
      setEnabled: setEnabled,
      initialMarker: initialMarker,
      setInitialMarker: setInitialMarker,
      initalMarkerUrl: initalMarkerUrl,
      setInitialMarkerUrl: setInitialMarkerUrl,
      geoJson: geoJson,
      setGeoJson: setGeoJson,
    }),
    [
      mapPoints,
      setMapPoints,
      latLng,
      setLatLng,
      enabled,
      setEnabled,
      initialMarker,
      setInitialMarker,
      initalMarkerUrl,
      setInitialMarkerUrl,
      geoJson,
      setGeoJson,
    ]
  );
  return (
    <mapContext.Provider value={mapMemo}>
      {router as JSX.Element}
    </mapContext.Provider>
  );
};
