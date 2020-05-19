const TWO_PI = Math.PI * 2;

function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

function heading(lat1, lng1, lat2, lng2) {
  lat1 = toRadians(lat1);
  lng1 = toRadians(lng1);
  lat2 = toRadians(lat2);
  lng2 = toRadians(lng2);

  const y = Math.sin(lng2 - lng1) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1);
  let brng = Math.atan2(y, x);
  return (brng + TWO_PI) % TWO_PI;
}

export function parseData(file, speedUp) {
  let data = [];
  const parser = new DOMParser();
  const xml = parser.parseFromString(file, 'text/xml');
  const nodes = xml.querySelectorAll('trkpt');

  for (let i = 0; i < nodes.length; i = i + 1) {
    let next, delay, direction;
    const node = nodes[i];
    const lat = +node.getAttribute('lat');
    const lon = +node.getAttribute('lon');
    const time = new Date(node.querySelector('time').innerHTML);

    if (i < nodes.length - 1) {
      const nextEle = nodes[i + 1];
      next = new Date(nextEle.querySelector('time').innerHTML);
      delay = next - time;
      direction = heading(lat, lon, +nextEle.getAttribute('lat'), +nextEle.getAttribute('lon'));
    }

    data.push({
      lat: lat,
      lon: lon,
      time: time,
      heading: direction,
      delay: delay / speedUp,
    });
  }

  return data;
}

export function getCamera() {
  const viewer = new Cesium.Viewer('map', {
    animation: false,
    baseLayerPicker: false,
    geocoder: false,
    homeButton: false,
    infoBox: false,
    sceneModePicker: false,
    selectionIndicator: false,
    timeline: false,
    navigationHelpButton: false,
    navigationInstructionsInitiallyVisible: false,
  });
  return viewer.camera;
}
