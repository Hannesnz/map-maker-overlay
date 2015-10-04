var overlay,
	neMarker,
	swMarker,
	nwMarker,
	seMarker,
	centerMarker,
	centerPreviousPos,
    map;

var circleIcon = {
    strokeWeight: 1.08,
    strokeColor: 'red',
    fillColor: 'white',
    fillOpacity: 1,
    path: google.maps.SymbolPath.CIRCLE,
    scale: 6
};

SizeableOverlay.prototype = new google.maps.OverlayView();

var
  swPosition,
  nePosition,
  nwPosition,
  sePosition,
  bounds
  imgSrc = 'http://homepages.slingshot.co.nz/~hannes.nz/overlays/Amazeme.png';

function resetBounds() {
	var distance = google.maps.geometry.spherical.computeDistanceBetween(map.getBounds().getNorthEast(), map.getBounds().getSouthWest());
    
    swBound = google.maps.geometry.spherical.computeOffset(map.getBounds().getSouthWest(), distance / 6, 45);
    neBound = google.maps.geometry.spherical.computeOffset(map.getBounds().getNorthEast(), distance / 6, 225);
    nwBound = new google.maps.LatLng(neBound.lat(), swBound.lng())
    seBound = new google.maps.LatLng(swBound.lat(), neBound.lng())
    bounds = new google.maps.LatLngBounds(swBound, neBound);
}

function addImage() {
    resetBounds();

    overlay = new SizeableOverlay(bounds, imgSrc, map);

    swMarker = new google.maps.Marker({
        position: swBound,
        icon: circleIcon,
        map: map,
        cursor: 'nesw-resize',
        draggable: true,
        crossOnDrag: false
    });

    neMarker = new google.maps.Marker({
        position: neBound,
        map: map,
        icon: circleIcon,
        draggable: true,
        cursor: 'nesw-resize',
        crossOnDrag: false
    });
    
    nwMarker = new google.maps.Marker({
        position: nwBound,
        map: map,
        icon: circleIcon,
        draggable: true,
        cursor: 'nwse-resize',
        crossOnDrag: false
    });

    seMarker = new google.maps.Marker({
        position: seBound,
        map: map,
        icon: circleIcon,
        draggable: true,
        cursor: 'nwse-resize',
        crossOnDrag: false
    });

    centerMarker = new google.maps.Marker({
        position: bounds.getCenter(),
        map: map,
        icon: circleIcon,
        draggable: true,
        cursor: 'move',
        crossOnDrag: false
    });
    centerPreviousPos = centerMarker.getPosition();

    google.maps.event.addListener(swMarker, 'drag', function () {

        var newBounds = new google.maps.LatLngBounds(swMarker.getPosition(), neMarker.getPosition());
        nwMarker.setPosition(new google.maps.LatLng(neMarker.getPosition().lat(), swMarker.getPosition().lng()));
        seMarker.setPosition(new google.maps.LatLng(swMarker.getPosition().lat(), neMarker.getPosition().lng()));
        centerMarker.setPosition(newBounds.getCenter());
        centerPreviousPos = centerMarker.getPosition();
        overlay.updateBounds(newBounds);
    });

    google.maps.event.addListener(neMarker, 'drag', function () {

        var newBounds = new google.maps.LatLngBounds(swMarker.getPosition(), neMarker.getPosition());
        nwMarker.setPosition(new google.maps.LatLng(neMarker.getPosition().lat(), swMarker.getPosition().lng()));
        seMarker.setPosition(new google.maps.LatLng(swMarker.getPosition().lat(), neMarker.getPosition().lng()));
        centerMarker.setPosition(newBounds.getCenter());
        centerPreviousPos = centerMarker.getPosition();
        overlay.updateBounds(newBounds);
    });

    google.maps.event.addListener(nwMarker, 'drag', function () {

        neMarker.setPosition(new google.maps.LatLng(nwMarker.getPosition().lat(), seMarker.getPosition().lng()));
        swMarker.setPosition(new google.maps.LatLng(seMarker.getPosition().lat(), nwMarker.getPosition().lng()));
        var newBounds = new google.maps.LatLngBounds(swMarker.getPosition(), neMarker.getPosition());
        centerMarker.setPosition(newBounds.getCenter());
        centerPreviousPos = centerMarker.getPosition();
        overlay.updateBounds(newBounds);
    });

    google.maps.event.addListener(seMarker, 'drag', function () {

        neMarker.setPosition(new google.maps.LatLng(nwMarker.getPosition().lat(), seMarker.getPosition().lng()));
        swMarker.setPosition(new google.maps.LatLng(seMarker.getPosition().lat(), nwMarker.getPosition().lng()));
        var newBounds = new google.maps.LatLngBounds(swMarker.getPosition(), neMarker.getPosition());
        centerMarker.setPosition(newBounds.getCenter());
        centerPreviousPos = centerMarker.getPosition();
        overlay.updateBounds(newBounds);
    });

    google.maps.event.addListener(centerMarker, 'drag', function () {
        var newPointSW = new google.maps.LatLng(swMarker.getPosition().lat() + (centerMarker.getPosition().lat() - centerPreviousPos.lat()), swMarker.getPosition().lng() + (centerMarker.getPosition().lng() - centerPreviousPos.lng()));
        var newPointNE = new google.maps.LatLng(neMarker.getPosition().lat() + (centerMarker.getPosition().lat() - centerPreviousPos.lat()), neMarker.getPosition().lng() + (centerMarker.getPosition().lng() - centerPreviousPos.lng()));
        swMarker.setPosition(newPointSW);
        neMarker.setPosition(newPointNE);
        nwMarker.setPosition(new google.maps.LatLng(neMarker.getPosition().lat(), swMarker.getPosition().lng()));
        seMarker.setPosition(new google.maps.LatLng(swMarker.getPosition().lat(), neMarker.getPosition().lng()));
        centerPreviousPos = centerMarker.getPosition();
        var newBounds = new google.maps.LatLngBounds(newPointSW, newPointNE);
        overlay.updateBounds(newBounds);
    });
}

function SizeableOverlay(bounds, image, map) {

    this.bounds_ = bounds;
    this.image_ = image;
    this.map_ = map;
    this.div_ = null;
    this.setMap(map);
}

SizeableOverlay.prototype.onAdd = function () {

    var div = document.createElement('div');
    div.style.borderStyle = 'none';
    div.style.borderWidth = '0px';
    div.style.position = 'absolute';
    imgOverlay = document.createElement('img');
    imgOverlay.src = this.image_;
    imgOverlay.style.width = '100%';
    imgOverlay.style.height = '100%';
    imgOverlay.style.opacity = overlayOpacity;
    imgOverlay.style.position = 'absolute';
    div.appendChild(imgOverlay);
    this.div_ = div;
    var panes = this.getPanes();
    panes.overlayLayer.appendChild(div);
};

SizeableOverlay.prototype.draw = function () {
    var overlayProjection = this.getProjection();
    var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
    var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());
    var div = this.div_;
    div.style.left = sw.x + 'px';
    div.style.top = ne.y + 'px';
    div.style.width = (ne.x - sw.x) + 'px';
    div.style.height = (sw.y - ne.y) + 'px';
};


SizeableOverlay.prototype.updateBounds = function (bounds) {
    this.bounds_ = bounds;
    this.draw();
};

SizeableOverlay.prototype.onRemove = function () {
    this.div_.parentNode.removeChild(this.div_);
    this.div_ = null;
};

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
var usingCircle
var overlayOpacity;
var imgOverlay;
window.addEventListener("message", function(e) {
  if (e.data.action === 'toggleShowCircle') {
	  usingCircle = true;
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
  } else if (e.data.action === 'toggleShowImage') {
    usingCircle = false;
	imgSrc = e.data.imageUrl;
	if (overlay == null ) {
		overlayOpacity = e.data.opactiy;
		addImage();
	} else {
		if (overlay.getMap() == null) {
			overlay.setMap(map);
			swMarker.setMap(map);
			neMarker.setMap(map);
			nwMarker.setMap(map);
			seMarker.setMap(map);
			centerMarker.setMap(map);
		} else {
			overlay.setMap(null);
			swMarker.setMap(null);
			neMarker.setMap(null);
			nwMarker.setMap(null);
			seMarker.setMap(null);
			centerMarker.setMap(null);
		}
	}
  } else if (e.data.action === 'resetPosition') {
	if (usingCircle) {
		circle.setOptions({center: map.getCenter(),
						   radius: google.maps.geometry.spherical.computeDistanceBetween(map.getBounds().getNorthEast(), map.getBounds().getCenter()) / 3
							});
	} else {
		resetBounds();
        overlay.updateBounds(bounds);
		swMarker.setPosition(swBound);
		neMarker.setPosition(neBound);
		nwMarker.setPosition(nwBound);
		seMarker.setPosition(seBound);
		centerMarker.setPosition(bounds.getCenter());
		centerPreviousPos = centerMarker.getPosition();
	}
	if (imgOverlay != null)	{
		imgOverlay.style.transform = 'rotate(0deg)';
	}

  } else if (e.data.action === 'toggleHandles') {
	if (usingCircle) {
		circle.setEditable(!circle.getEditable());
	} else {
		if (swMarker.getMap() == null) {
			swMarker.setMap(map);
			neMarker.setMap(map);
			nwMarker.setMap(map);
			seMarker.setMap(map);
			centerMarker.setMap(map);
		} else {
			swMarker.setMap(null);
			neMarker.setMap(null);
			nwMarker.setMap(null);
			seMarker.setMap(null);
			centerMarker.setMap(null);
		}
	}
  } else if (e.data.action === 'setImage') {
	  overlay.image_ = e.data.newUrl;
	  imgOverlay.src = e.data.newUrl;
  } else if (e.data.action === 'changeOpacity') {
	if (usingCircle) {
	  circle.setOptions({strokeOpacity: e.data.newValue});
	} else {
		overlayOpacity = e.data.newValue;
		imgOverlay.style.opacity = overlayOpacity;
	}
  } else if (e.data.action === 'changeRotation') {
		imgOverlay.style.transform = 'rotate('+e.data.newValue/8+'deg)';
  } else if (e.data.action === 'changeCircleWidth') {
	circle.setOptions({strokeWeight: e.data.newValue});
  } else if (e.data.action === 'changeCircleColor') {
	circle.setOptions({strokeColor: e.data.newValue});
  }
});