import "./styles.css";
import TileLayer from "ol/layer/Tile";
import View from "ol/View";
import Map from "ol/Map";
import OSM from "ol/source/OSM";
import LayerGroup from "ol/layer/Group";
import BingMaps from "ol/source/BingMaps";
import TileArcGISRest from "ol/source/TileArcGISRest";

const extentCentralAmerica = [
  -10457339.384086128, 3914447.177745921, -10405327.427643117,
  3936499.4614502764,
];

const extentBeverlySliv = [
  2811031.5665185726, 5393107.291675044, 2821657.957030993, 5398771.537332108,
];
const osmSource = new OSM();
const naipSource = new TileArcGISRest({
  url: "https://naip.imagery1.arcgis.com/arcgis/rest/services/NAIP/ImageServer",
});
const landsatSource = new TileArcGISRest({
  url: "https://landsat2.arcgis.com/arcgis/rest/services/Landsat/MS/ImageServer",
});

const layer = new TileLayer();

const map = new Map({
  view: new View({
    center: [0, 0],
    zoom: 0,
    extent: extentCentralAmerica,
  }),
  layers: [
    new TileLayer({
      source: osmSource,
      //   extent: [
      //     2811031.5665185726, 5393107.291675044, 2821657.957030993,
      //     5398771.537332108,
      //   ],
    }),
    layer,
  ],
  target: "map",
});

// const layerGroup = new LayerGroup({
//   layers: [
//     //Bing Mpas Basemap Layer
//     // new TileLayer({
//     //   source: new BingMaps({
//     //     key: "AgoeXeEzLrhaR_XpVJR8rfC6uWHfmOtALGyWDA49b242iBjQyu5wHy3oXVQV_JQU",
//     //     imagerySet: "Aerial", // Road, Canvas, CanvasGray, CanvasDark, OrdananceSurvey
//     //   }),
//     //   zIndex: 3,
//     // }),

//     // ArcGIS Rest API layer
//     new TileLayer({
//       source: new TileArcGISRest({
//         url: "https://naip.imagery1.arcgis.com/arcgis/rest/services/NAIP/ImageServer",
//       }),
//       visible: false,
//       extent: extentCentralAmerica,
//     }),
//     //ArcGIS Landsat Rest API Layer
//     new TileLayer({
//       source: new TileArcGISRest({
//         url: "https://landsat2.arcgis.com/arcgis/rest/services/Landsat/MS/ImageServer",
//       }),
//       visible: true,
//       extent: extentCentralAmerica,
//     }),
//   ],
// });

map.on("click", (event) => {
  console.log(event.coordinate);
});

console.log(document.getElementById("layers"));
const layers: any = document.getElementById("layers");

layers.addEventListener("change", (layerOption: any) => {
  const layerName = layerOption.target.value;
  if (layerName === "NAIP") {
    layer.setSource(naipSource);
  }
  if (layerName === "LANDSAT") {
    layer.setSource(landsatSource);
  }
  if (layerName === "OPENMAPS") {
    layer.setSource(osmSource);
  }
});
