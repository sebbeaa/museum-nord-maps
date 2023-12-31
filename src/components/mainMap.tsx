/* eslint-disable @typescript-eslint/no-explicit-any */
//add comments to this!!!
import mapboxgl from "mapbox-gl";
import { useState } from "react";
import { createContext, useContext, useEffect, useMemo, useRef } from "react";
import { mapContext } from "../context/mapContext";

mapboxgl.accessToken =
  "pk.eyJ1Ijoic2ViYmV0YXN0aWFuIiwiYSI6ImNsZnc4b2x2czA1OHMzbHBvaHdlYmUwM2EifQ.LnGDu09dXFAPFSBJcInSDQ";

export const mapCurrentContext = createContext({});

const MainMap = () => {
  const {
    latLng,
    setLatLng,
    enabled,
    initialMarker,
    initalMarkerUrl,
    geoJson,
  } = useContext(mapContext);
  const mapContainer = useRef<MapConstructor | null>(null);
  const map: any = useRef<null | any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const mapMemo = useMemo(
    () => ({
      map,
    }),
    [map]
  );

  useEffect(() => {
    // initialize map only once
    if (map.current) {
      return;
    }
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/sebbetastian/clg0utw06000201qoij8gqhtn",
      center: [15.39809795685471, 68.70617912489878],
      interactive: true,
      zoom: 1,
    });
    map.current.on("load", () => {
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!loading && latLng?.center.lng) {
      map.current.flyTo({
        center: [latLng.center.lng, latLng.center.lat],
        bearing: latLng.bearing === undefined ? 0 : latLng.bearing,
        pitch: latLng.pitch === undefined ? 0 : latLng.pitch,
        zoom: latLng.zoom === undefined ? 0 : latLng.zoom,
      });

      setLatLng();
    }
  }, [latLng, setLatLng, loading]);

  useEffect(() => {
    const initalMarkerSource = map.current.getSource("initialPoint");
    const source = map.current.getSource("geoJson");
    const markerSource = map.current.getSource("points");

    markerSource &&
      markerSource.setData({
        type: "FeatureCollection",
        features: [],
      });

    initialMarker
      ? map.current.loadImage(initalMarkerUrl, (error: any, image: any) => {
          initalMarkerSource && initalMarkerSource.setData(initialMarker);
          if (error) throw error;
          if (map.current.hasImage("inital-marker")) {
            if (map.current.hasImage(initalMarkerUrl)) {
              map.current.removeImage(initalMarkerUrl);
              map.current.addImage(initalMarkerUrl, image);
              map.current.setLayoutProperty(
                "initialPoints",
                "icon-image",
                initalMarkerUrl
              );
            } else {
              map.current.addImage(initalMarkerUrl);
              map.current.setLayoutProperty(
                "initialPoins",
                "icon-image",
                initalMarkerUrl
              );
            }
            initalMarkerSource && initalMarkerSource.setData(initialMarker);
            return;
          } else {
            !initalMarkerSource && map.current.addImage("inital-marker", image);
            map.current.addSource("initialPoint", {
              type: "geojson",
              data: {
                type: "FeatureCollection",
                features: [initialMarker],
              },
            });
            // Add a symbol layer
            map.current.addLayer({
              id: "initialPoints",
              type: "symbol",
              source: "initialPoint",
              layout: {
                "icon-image": "inital-marker",
                "icon-size": 1,
                "text-offset": [0, 1.25],
                "text-anchor": "top",
              },
              filter: ["==", "$type", "Point"],
            });
          }
        })
      : initalMarkerSource &&
        initalMarkerSource.setData({
          type: "FeatureCollection",
          features: [],
        });
    if (enabled && geoJson && !loading) {
      // const layer = map.current.getLayer("filled");
      if (source && geoJson?.geoUrl) {
        source.setData(geoJson.geoUrl);

        map.current.setPaintProperty(
          "filled",
          "fill-color",
          geoJson.layerOptions.polygonStyle?.polygonColor.value
        );
        map.current.setPaintProperty(
          "filled",
          "fill-opacity",
          geoJson.layerOptions.polygonStyle?.polygonOpacity
        );
        map.current.setPaintProperty(
          "outline",
          "line-width",
          geoJson.layerOptions.polygonStyle?.polygonLineWidth
        );
        map.current.setPaintProperty(
          "outline",
          "line-color",
          geoJson.layerOptions.polygonStyle?.polygonLineColor.value
        );
      } else if (!source && geoJson?.geoUrl) {
        map.current.addSource("geoJson", {
          type: "geojson",
          // Use a URL for the value for the `data` property.
          data: geoJson?.geoUrl,
        });

        map.current.addLayer({
          id: "filled",
          type: "fill",
          source: "geoJson",
          paint: {
            "fill-color":
              geoJson?.layerOptions.polygonStyle?.polygonColor.value,
            "fill-opacity": geoJson?.layerOptions.polygonStyle?.polygonOpacity,
          },
          filter: ["==", "$type", "Polygon"],
        });
        map.current.addLayer({
          id: "outline",
          type: "line",
          source: "geoJson",
          paint: {
            "line-width": geoJson?.layerOptions.polygonStyle?.polygonLineWidth,
            "line-color":
              geoJson?.layerOptions.polygonStyle?.polygonLineColor.value,
          },
          filter: ["!=", "$type", "Point"],
        });
      } else if (!geoJson?.geoUrl) {
        source &&
          source.setData({
            type: "FeatureCollection",
            features: [],
          });
      }
      geoJson?.layerOptions.markerStyle?.markerImageUrl
        ? map.current.loadImage(
            geoJson?.layerOptions.markerStyle?.markerImageUrl,
            (error: any, image: any) => {
              if (error) throw error;
              if (map.current.hasImage("custom-marker")) {
                if (
                  map.current.hasImage(
                    geoJson?.layerOptions.markerStyle?.markerImageUrl
                  )
                ) {
                  map.current.removeImage(
                    geoJson?.layerOptions.markerStyle?.markerImageUrl
                  );
                  map.current.addImage(
                    geoJson?.layerOptions.markerStyle?.markerImageUrl,
                    image
                  );
                  map.current.setLayoutProperty(
                    "points",
                    "icon-image",
                    geoJson?.layerOptions.markerStyle?.markerImageUrl
                  );
                } else {
                  map.current.addImage(
                    geoJson?.layerOptions.markerStyle?.markerImageUrl,
                    image
                  );
                  map.current.setLayoutProperty(
                    "points",
                    "icon-image",
                    geoJson?.layerOptions.markerStyle?.markerImageUrl
                  );
                }
                markerSource && markerSource.setData(geoJson.geoUrl);
                return;
              } else {
                // Add a GeoJSON source with 2 points
                // Add a symbol layer
                if (!markerSource) {
                  map.current.addImage("custom-marker", image);
                  map.current.addSource("points", {
                    type: "geojson",
                    data: geoJson.geoUrl,
                  });
                  // Add a symbol layer
                  map.current.addLayer({
                    id: "points",
                    type: "symbol",
                    source: "points",
                    layout: {
                      "icon-image": "custom-marker",
                      "icon-size": 1,
                      "text-offset": [0, 1.25],
                      "text-anchor": "top",
                    },
                    filter: ["==", "$type", "Point"],
                  });
                }
              }
            }
          )
        : markerSource &&
          markerSource.setData({
            type: "FeatureCollection",
            features: [],
          });
    } else {
      source &&
        source.setData({
          type: "FeatureCollection",
          features: [],
        });
    }
  }, [enabled, geoJson, loading, initialMarker, initalMarkerUrl]);

  return (
    <mapCurrentContext.Provider value={mapMemo}>
      <div className="mapContainer" ref={mapContainer as any} />
    </mapCurrentContext.Provider>
  );
};

export default MainMap;
