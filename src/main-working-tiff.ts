import "./styles.css";
import GeoTIFF from "ol/source/GeoTIFF.js";
import Map from "ol/Map.js";
import TileLayer from "ol/layer/WebGLTile.js";
import proj4 from "proj4";
import { createEmpty, extend, getCenter } from "ol/extent.js";
import { register } from "ol/proj/proj4.js";
import { transformExtent } from "ol/proj.js";

proj4.defs("EPSG:4326", "+proj=utm +zone=31 +datum=WGS84 +units=m +no_defs");
proj4.defs("EPSG:4326", "+proj=utm +zone=32 +datum=WGS84 +units=m +no_defs");
register(proj4);

const channels = ["red", "green", "blue"];
for (const channel of channels) {
  const selector = document.getElementById(channel);
  selector!.addEventListener("change", update);
}

function getVariables() {
  const variables: any = {};
  for (const channel of channels) {
    const selector = document.getElementById(channel);
    variables[channel] = parseInt((selector as HTMLInputElement).value, 10);
  }
  return variables;
}

const sourceNames = ["B04", "B03", "B02", "B08"];
const sources = [
  new GeoTIFF({
    sources: sourceNames.map(function (name) {
      return {
        url: `../data/response.tif`,
      };
    }),
  }),
];

const layer = new TileLayer({
  sources: sources,
  style: {
    variables: getVariables(),
    color: [
      "array",
      ["band", ["var", "red"]],
      ["band", ["var", "green"]],
      ["band", ["var", "blue"]],
      ["band", 5],
    ],
  },
});

function update() {
  layer.updateStyleVariables(getVariables());
}

const map = new Map({
  target: "map",
  layers: [layer],
  view: Promise.all(
    sources.map(function (source) {
      return source.getView();
    })
  ).then(function (options) {
    const projection = "EPSG:4326";
    const extent = createEmpty();
    options.forEach(function (options) {
      extend(
        extent,
        transformExtent(options.extent!, options.projection, projection)
      );
    });
    return {
      projection: projection,
      center: getCenter(extent),
      zoom: 0,
      extent: extent,
    };
  }),
});
