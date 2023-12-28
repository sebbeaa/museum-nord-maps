export type Position = number[];
export interface GeoJsonObject {
  type: string;
  properties?: Record<string, unknown>;
  geometry?: Geometry;
}

export interface Geometry {
  type: string;
  coordinates?: Position[];
}

export type SanityImage = {
  id: string;
  asset: {
    id: string;
    url: string;
    width: number;
    height: number;
    format: string;
    metadata: Record<string, unknown>;
  };
  crop: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  hotspot: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  caption: string;
  crediting: string;
};

export interface Mark {
  value: string;
  type: string;
}

export type PortableText = {
  _type: string;
  content: string;
  marks?: Record<string, Mark>;
};

export interface mapPoint {
  center: {
    lng: number;
    lat: number;
  };
  defMarkerUrl: string | undefined;
  enableMarker: boolean;
  zoom: number;
  bearing: number;
  pitch: number;
}

export interface color {
  label: string;
  value: string;
}
export interface geoData {
  geoUrl: string;
  layerOptions: {
    layerStyle: string;
    polygonStyle?: {
      polygonOpacity: number;
      polygonColor: color;
      polygonLineWidth: number;
      polygonLineColor: color;
    };
    markerStyle?: {
      markerImageUrl: string;
      markerOpacity: number;
      markerColor: color;
    };
  };
}
export interface MapPoint {
  _id: string;
  _rev: string;
  _type: "mapPoint";
  slug: string;
  title: string;
  body: PortableText;
  imageUrl: URL;
  mainImage: string; // Replace 'Image' with the correct type for 'image' field
  enable: boolean;
  location: mapPoint;
  geoUrl: string;
  marker: boolean;
  geoData: geoData;
}
