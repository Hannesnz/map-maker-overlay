var map = null;
function findMap(parent) {
	props = Object.getOwnPropertyNames(parent);
	for (i = 0; i <= props.length - 1; i++) {
		subProps = Object.getOwnPropertyNames(parent[props[i]]);
		for (j = 0; j <= subProps.length - 1; j++) {
			if (parent[props[i]][subProps[j]] instanceof google.maps.Map) {
				return parent[props[i]][subProps[j]]
			}
		}
	}
}
function getMap() {
	map = findMap(gGeowikiApplication.F.aMa());
}
getMap();
var circle = null;
window.addEventListener("message", function(e) {
  if (e.data.action === 'toggleShowCircle') {
	  if (map == null) {
		  getMap();
	  }
	  if (circle == null) {
		circle = new google.maps.Circle({
		strokeColor: e.data.circleColor,
		strokeOpacity: e.data.opacity,
		strokeWeight: e.data.circleWidth,
		fillOpacity: 0.0,
		editable: true,
		radius: google.maps.geometry.spherical.computeDistanceBetween(map.getBounds().getNorthEast(), map.getBounds().getCenter()) / 3,
		map: map,
		center: map.getCenter()});
	  } else {
		  circle.setVisible(!circle.getVisible());
	  }
  } else if (e.data.action === 'resetPosition') {
	circle.setOptions({center: map.getCenter(),
					   radius: google.maps.geometry.spherical.computeDistanceBetween(map.getBounds().getNorthEast(), map.getBounds().getCenter()) / 3
						});
  } else if (e.data.action === 'toggleHandles') {
	circle.setEditable(!circle.getEditable());
  } else if (e.data.action === 'changeOpacity') {
	circle.setOptions({strokeOpacity: e.data.newValue});
  } else if (e.data.action === 'changeCircleWidth') {
	circle.setOptions({strokeWeight: e.data.newValue});
  } else if (e.data.action === 'changeCircleColor') {
	circle.setOptions({strokeColor: e.data.newValue});
  }
});