import { SocketContext } from "../context/socketContext";
import { replaceOrUpdateArrayByKey } from "../helper/updateObjects";
import { useContext, useEffect } from "react";
import { mapContext } from "../context/mapContext";
import { MapPoint } from "../types/mapPoint";

export const useMapSocket = (
  mapPoints: MapPoint[] | undefined,
  setMapPoints: React.ComponentState,
  slug: string | undefined,
  preview: boolean,
  point: string
) => {
  const {
    latLng,
    setLatLng,
    setEnabled,
    setInitialMarker,
    setInitialMarkerUrl,
    setGeoJson,
  } = useContext(mapContext);
  const socket: any = useContext(SocketContext);

  useEffect(() => {
    // no-op if the socket is already connected
    socket.connect();
    return () => {
      socket.disconnect();
      socket.off("connect");
    };
  }, []);

  useEffect(() => {
    //set map point with updated point!
    const getPoints = async (pnt: MapPoint) => {
      setMapPoints(pnt);
    };
    //update all map points
    const updatePoints = async (pnt: MapPoint) => {
      const arr = mapPoints && [...mapPoints];
      setMapPoints(replaceOrUpdateArrayByKey(arr, pnt));
      setEnabled(pnt.enable);
      if (preview === true && point) {
        setLatLng({
          center: {
            lng:
              pnt.location.center.lng !== latLng?.center.lng
                ? pnt.location.center.lng
                : latLng?.center.lng,
            lat:
              pnt.location.center.lat !== latLng?.center.lng
                ? pnt.location.center.lat
                : latLng?.center.lat,
          },
          zoom:
            pnt.location.zoom !== latLng?.zoom
              ? pnt.location.zoom
              : latLng?.zoom,
          bearing:
            pnt.location.bearing !== latLng?.bearing
              ? pnt.location.bearing
              : latLng?.bearing,
          pitch:
            pnt.location.pitch !== latLng?.pitch
              ? pnt.location.pitch
              : latLng?.pitch,
        });
        setGeoJson(pnt.geoData);
        if (pnt.location.enableMarker) {
          setInitialMarker(pnt.marker);
          pnt.location.defMarkerUrl &&
            setInitialMarkerUrl(pnt.location.defMarkerUrl);
        } else {
          setInitialMarker();
        }
      }
    };
    console.info("socket connected?", socket.connected);

    //preview listen to region
    if (preview === true && !point) {
      //always emit for updates when socket connects
      socket.on("connect", function () {
        console.info("socket connected?", socket.connected);
        //listens to one region draft based on the slug value
        socket.emit("listenToRegionDraft", slug);
        //listens to one region based on the slug value
        socket.emit("listenToRegion", slug);
        //listens to every mapPoint draft
        socket.emit("listenToAllMapPointsDraft", slug);
      });
      socket.on("regionDraft", getPoints);
      socket.on("RegionWithPoint", getPoints);
      socket.on("AllPointsDraft", updatePoints);
    }

    //production listen to region
    else if (preview === false && !point) {
      socket.on("connect", function () {
        console.info("socket connected?", socket.connected);
        //listens to one region based on the slug value
        socket.emit("listenToRegion", slug);
        //listens to every mapPoint
        socket.emit("listenToAllMapPoints", slug);
      });
      socket.on("RegionWithPoint", getPoints);
      socket.on("allMapPoints", updatePoints);
    }

    //production listen to one map point
    else if (preview === false && point) {
      socket.on("connect", function () {
        console.info("socket connected?", socket.connected);
        //listens to one mapPoint based on the slug value
        socket.emit("listenToOneMapPoint", point);
      });
      socket.on("oneMapPoint", updatePoints);
    }

    //preview listen to one map point
    else if (preview === true && point) {
      socket.on("connect", function () {
        console.info("socket connected?", socket.connected);
        //listens to one mapPoint draft based on the slug value
        socket.emit("listenToOneMapPointDraft", point);
        socket.emit("listenToOneMapPoint", point);
      });
      socket.on("oneMapPointDraft", updatePoints);
      socket.on("oneMapPoint", updatePoints);
    }

    return () => {
      //close listeners
      socket.off("RegionWithPoint");
      socket.off("regionDraft");
      socket.off("AllPointsDraft");
      socket.off("oneMapPoint");
      socket.off("oneMapPointDraft");
      socket.off("connect");
    };
  }, [mapPoints]);
};
