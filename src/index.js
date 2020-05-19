import './scss/styles.scss';
import Timeline from './utils/Timeline';
import { parseData, getCamera } from './utils/helpers';
import ride1 from './data/2020.05.07_Ride.gpx';
import ride2 from './data/Evening_Ride_2020.05.12.gpx';
import ride3 from './data/ruta004.gpx';

Cesium.Ion.defaultAccessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwNmU0ZTgwMi0wZGQ2LTRlOGQtOThhZC0yMzAyOWIzZjU4MjAiLCJpZCI6Mjc0NTYsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1ODk1MDUyNDh9.1nwSXeJPnP08Y1Xz4KCkhP-8taxQk95Cs_LaeH3lY74';
const camera = getCamera();
const pushElevation = 20;
const viewAngle = -15;
const speedUp = 10000;
const data = parseData(ride1, speedUp);
const timeline = new Timeline(data, onNewPosition);
let current = 0;

function goTo(delay) {
  const point = data[current];
  timeline.updateProgress(current);

  camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(point.lon, point.lat, pushElevation),
    orientation: {
      heading: point.heading,
      pitch: Cesium.Math.toRadians(viewAngle),
      roll: 0.0,
    },
    duration: delay || point.delay,
    complete: () => {
      ++current;
      if (current < data.length - 1) {
        goTo();
      }
    },
  });
}

function onNewPosition(newI) {
  camera.cancelFlight();
  current = newI;
  goTo(2);
}

goTo();

window.onresize = () => {
  timeline.resize();
};
