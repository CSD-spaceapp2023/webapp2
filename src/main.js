import "./style.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile.js";
import VectorTileLayer from "ol/layer/VectorTile.js";
import VectorTileSource from "ol/source/VectorTile.js";
import WMTS from "ol/source/WMTS.js";
import WMTSTileGrid from "ol/tilegrid/WMTS.js";
import MVT from "ol/format/MVT";
import OSM from "ol/source/OSM";
import CircleStyle from "ol/style/Circle.js";

var base = new TileLayer({
  extent: [-180, -90, 180, 90],
  crossOrigin: "anonymous",
  source: new WMTS({
    url: "https://gibs-{a-c}.earthdata.nasa.gov/wmts/epsg4326/best/wmts.cgi?TIME=2020-04-27",
    layer: "BlueMarble_NextGeneration",
    format: "image/jpeg",
    matrixSet: "500m",
    tileGrid: new WMTSTileGrid({
      origin: [-180, 90],
      resolutions: [
        0.140625, 0.0703125, 0.03515625, 0.017578125, 0.0087890625,
        0.00439453125, 0.002197265625,
      ],
      matrixIds: [2, 3, 4, 5, 6, 7, 8],
      tileSize: 512,
    }),
  }),
});

const map = new Map({
  target: "map",
  layers: [
    base,
    // new TileLayer({
    //   source: new OSM(),
    // }),
  ],
  view: new View({
    projection: "EPSG:4326",
    center: [0, 0],
    zoom: 2,
  }),
});
