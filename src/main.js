import "./style.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile.js";
import TileLayerWebGL from "ol/layer/WebGLTile.js";
import VectorTileLayer from "ol/layer/VectorTile.js";
import VectorTileSource from "ol/source/VectorTile.js";
import SourceTileWMS from "ol/source/TileWMS";
import WMTS, { optionsFromCapabilities } from "ol/source/WMTS.js";
import WMTSCapabilities from "ol/format/WMTSCapabilities.js";
import WMTSTileGrid from "ol/tilegrid/WMTS.js";
import MVT from "ol/format/MVT";
import OSM from "ol/source/OSM";
import CircleStyle from "ol/style/Circle.js";
import GeoTIFF from "ol/source/GeoTIFF.js";
import ImageLayer from "ol/layer/Image";

const f = async () => {
  const baseLayer = new TileLayer({
    visible: true,
    source: new SourceTileWMS({
      url: "https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi",
      projection: "EPSG:4326",
      params: {
        LAYERS: "BlueMarble_NextGeneration",
      },
    }),
  });

  const url4 = new URL(
    "./assets/image_export_cls_naip.tif",
    import.meta.url,
  ).href;

  const layer4 = new TileLayerWebGL({
    style: {
      brightness: -0.3
    },
    source: new GeoTIFF({
      sources: [
        {
          url: url4,
        },
      ],
    }),
  });

  // can we avoid CORS-policy ?
  // const localUrf = new URL(
  //   "./assets/EMIT_L2B_CH4PLM_001_20230825T170609_001111_nomask.tif",
  //   import.meta.url,
  // ).href;
  // const methaneSource = new GeoTIFF({
  //   normalize: false,
  //   sources: [
  //     {
  //       url: localUrf,
  //     },
  //   ],
  // });

  const localUrf3 = new URL(
    "./assets/EMIT_L2B_CH4ENH_001_20230825T170609_2323711_011_nomask.tif",
    import.meta.url,
  ).href;
  const methaneEnhancement = new GeoTIFF({
    // crossOrigin: "no-cors",
    normalize: false,
    sources: [
      {
        url: localUrf3,
      },
    ],
  });

  const max = 4040.8093;
  const min = -2853.458;
  const diff = max - min;
  function normalize(value) {
    return ["/", ["-", ["clamp", value, min, max], min], diff];
  }
  const val = normalize(["band", 1]);

  const methaneLayer = new TileLayerWebGL({
    source: methaneEnhancement,
    style: {
      color: ["array", val, 0, 0, ["case", ["==", ["band", 1], 0], 0.0, 0.7]],
    },
  });


  const localUrf2 = new URL("./assets/image_export_cls2.tif", import.meta.url)
    .href;
  const nnSorce = new GeoTIFF({
    sources: [
      {
        url: localUrf2,
      },
    ],
  });

  const segmentLayer = new TileLayerWebGL({
    opacity: 0.25,
    source: nnSorce,
  });

  // const correlationLayer = new TileLayerWebGL({

  // })

  const map = new Map({
    target: "map",
    layers: [baseLayer, layer4, methaneLayer, segmentLayer],
    view: new View({
      projection: "EPSG:4326",
      center: [-96.7540782, 32.5460988],
      zoom: 13,
    }),
  });

  const showBase = document.getElementById("showBase");
  const showMethane = document.getElementById("showMethane");
  const showSegment = document.getElementById("showSegment");
  const showHighResImage = document.getElementById("showHighResImage");

  const hook = () => {
    baseLayer.setVisible(showBase.checked);
    methaneLayer.setVisible(showMethane.checked);
    segmentLayer.setVisible(showSegment.checked);
    layer4.setVisible(showHighResImage.checked);
  };

  showBase.addEventListener("change", hook);
  showMethane.addEventListener("change", hook);
  showSegment.addEventListener("change", hook);
  showHighResImage.addEventListener("change", hook);
};

f();
