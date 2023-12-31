import { useContext, lazy, useEffect, useState, Suspense, useRef } from "react";
import { useMediaQuery } from "usehooks-ts";
import { urlFor } from "../lib/imageBuilder";
import { PortableText } from "@portabletext/react";
import { BlockContent } from "../lib/blockContent";
import { mapContext } from "../context/mapContext";
import { useMapSocket } from "../hooks/useMapSocket";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useParams } from "react-router-dom";
import axios from "axios";
import { MapPoint } from "../types/mapPoint";
const MainMap = lazy(() => import("../components/mainMap"));

const Map = () => {
  const {
    mapPoints,
    setMapPoints,
    setLatLng,
    setEnabled,
    setInitialMarker,
    setInitialMarkerUrl,
    setGeoJson,
  } = useContext(mapContext);
  const { token, maps, point } = useParams();
  const [show, setShow] = useState<boolean>(true);
  const [cardY, setCardY] = useState<number>(-200);
  const [slug, setSlug] = useState<string | undefined>();
  const [listNum, setListNum] = useState<number>(0);
  let num = 0;

  const { scrollY } = useScroll();

  const updatePos = (pt: MapPoint) => {
    setLatLng({
      center: {
        lng: pt.location.center.lng,
        lat: pt.location.center.lat,
      },
      zoom: pt.location.zoom,
      bearing: pt.location.bearing,
      pitch: pt.location.pitch,
    });
    setGeoJson(pt.geoData);
    setEnabled(pt.enable);
    if (pt.marker) {
      setInitialMarker(pt.marker);
      pt.location.defMarkerUrl && setInitialMarkerUrl(pt.location.defMarkerUrl);
    } else {
      setInitialMarker();
    }
  };

  const handleClick = (pt: MapPoint) => {
    toggleMenClick();
    updatePos(pt);
  };

  const changeCard = (increment: boolean | string, pt: MapPoint) => {
    if (increment) {
      setListNum((listNum) => (listNum += 1));
      setCardY(200);
    } else {
      setListNum((listNum) => (listNum -= 1));
      setCardY(-200);
    }
    updatePos(pt);
  };

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (mapPoints) {
      if (num === -1) {
        listNum !== 0 && changeCard(false, mapPoints[listNum - 1]);
      } else if (num === 1) {
        listNum !== mapPoints.length - 1 &&
          changeCard("increment", mapPoints[listNum + 1]);
      }
    }
    setTimeout(() => {
      num = latest;
    }, 175);
  });
  const scrollRef = useRef(null);

  const variants = {
    show: { x: 0, rotate: 0 },
    hide: { x: 220 },
  };

  const matches = useMediaQuery("(min-width: 855px)");

  const toggleMenu = (matches: boolean) => {
    matches ? setShow(true) : setShow(false);
  };

  const toggleMenClick = () => {
    setShow((show) => !show);
  };
  const initMap = (data: Array<MapPoint>) => {
    if (data) {
      const point = data[0].location;
      setMapPoints(data);
      setLatLng({
        center: {
          lng: point.center.lng,
          lat: point.center.lat,
        },

        zoom: point.zoom,
        bearing: point.bearing,
        pitch: point.pitch,
      });
      setEnabled(data[0].enable);
      setGeoJson(data[0].geoData);
      try {
        if (data[0].marker) {
          setInitialMarker(data[0].marker);
          data[0].location.defMarkerUrl &&
            setInitialMarkerUrl(data[0].location.defMarkerUrl);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  const GetMapPoints = async () => {
    const headers = {
      production: {
        headers: {
          Authorization: `token ${import.meta.env.VITE_ACCESS_KEY}`,
        },
      },
      preview: {
        headers: {
          Authorization: `token ${token}`,
        },
      },
    };
    if (token && !point) {
      await axios
        .get(
          // `https://gaia-maps-api-6xwo7d2lmq-lz.a.run.app/preview/${maps}`,
          `http://localhost:3000/preview/${maps}`,
          headers.preview
        )
        .then((r) => {
          setSlug(r.data[0].slug.current);
          initMap(r.data[0].Points);
        });
    } else if (!token && !point) {
      await axios
        .get(
          // `https://gaia-maps-api-6xwo7d2lmq-lz.a.run.app/${maps}`,
          `http://localhost:3000/${maps}`,
          headers.production
        )
        .then((r) => {
          setSlug(r.data[0].slug.current);
          initMap(r.data[0].Points);
        });
    }
    if (token && point) {
      await axios
        .get(
          // `https://gaia-maps-api-6xwo7d2lmq-lz.a.run.app/preview/one/${point}`,
          `http://localhost:3000/preview/one/${point}`,
          headers.preview
        )
        .then((r) => {
          initMap([r.data[0]]);
        });
    } else if (!token && point) {
      await axios
        // .get(`http://localhost:3000/one/${point}`, headers.production)
        .get(
          // `https://gaia-maps-api-6xwo7d2lmq-lz.a.run.app/one/${point}`,
          `http://localhost:3000/one/${point}`,
          headers.production
        )
        .then((r) => {
          initMap([r.data[0]]);
        });
    }
  };
  useEffect(() => {
    GetMapPoints();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mapSocket = useMapSocket(
    mapPoints,
    setMapPoints,
    slug,
    token ? true : false,
    point
  );
  useEffect(() => {
    mapSocket;
  }, [mapSocket]);

  useEffect(() => {
    toggleMenu(matches);
  }, [matches]);

  return (
    <div className="container">
      <Suspense
        fallback={
          <div
            style={{
              height: "100vh",
              width: "100vw",
              display: "grid",
              placeItems: "center",
            }}
          >
            <h1>🗺️</h1>
          </div>
        }
      >
        <div>
          <div className="mapContainer">
            <MainMap />
          </div>
        </div>
        <div className="layoutContainer">
          {mapPoints && mapPoints[listNum] !== null && (
            <div ref={scrollRef} className={`mapMenu`}>
              {listNum !== 0 && (
                <>
                  <button
                    style={{ position: "fixed", right: 0, top: 0, zIndex: 200 }}
                    onClick={() => changeCard(false, mapPoints[listNum - 1])}
                  >
                    prev
                  </button>
                </>
              )}
              <>
                {listNum >= 0 && (
                  <>
                    <motion.div
                      key={mapPoints[listNum]._id}
                      className="mapMenuContainer"
                      animate={show ? "show" : "hide"}
                      variants={variants}
                      transition={{
                        type: "spring",

                        duration: 0.5,
                      }}
                    >
                      <motion.div
                        initial={{ opacity: 0, y: cardY }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ root: scrollRef }}
                        onClick={() => handleClick(mapPoints[listNum])}
                        transition={{
                          type: "spring",
                          duration: 0.5,
                        }}
                        className="mapMenuCard"
                      >
                        <div style={{ alignSelf: "start" }}>
                          <h3>{mapPoints[listNum].title}</h3>
                          {mapPoints[listNum].mainImage && (
                            <>
                              <img
                                className="mapPointMainImage"
                                src={
                                  mapPoints[listNum].mainImage
                                    ? urlFor(mapPoints[listNum].mainImage)
                                    : mapPoints[listNum].imageUrl
                                }
                              />
                            </>
                          )}
                          <div className="richTextContainer">
                            <PortableText
                              value={mapPoints[listNum].body}
                              components={BlockContent}
                            />
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  </>
                )}
              </>
              {listNum !== mapPoints.length - 1 && (
                <>
                  <button
                    style={{
                      position: "fixed",
                      right: 0,
                      bottom: 0,
                      zIndex: 200,
                    }}
                    onClick={() =>
                      changeCard("increment", mapPoints[listNum + 1])
                    }
                  >
                    next
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </Suspense>
    </div>
  );
};

export default Map;
