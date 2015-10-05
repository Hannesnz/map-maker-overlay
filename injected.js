var overlay,
neMarker,
swMarker,
nwMarker,
seMarker,
leftMarker,
topMaker,
rightMarker,
bottomMarker,
centerMarker,
centerPreviousPos,
kmlOverlay,
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
bounds,
imgSrc,
kmlSrc;

function resetBounds() {
    swBound = google.maps.geometry.spherical.interpolate(map.getBounds().getSouthWest(), map.getBounds().getNorthEast(), 0.15);
    neBound = google.maps.geometry.spherical.interpolate(map.getBounds().getNorthEast(), map.getBounds().getSouthWest(), 0.15);
    nwBound = new google.maps.LatLng(neBound.lat(), swBound.lng());
    seBound = new google.maps.LatLng(swBound.lat(), neBound.lng());
    leftBound = google.maps.geometry.spherical.interpolate(nwBound, swBound, 0.5);
    topBound = google.maps.geometry.spherical.interpolate(neBound, nwBound, 0.5);
    rightBound = google.maps.geometry.spherical.interpolate(neBound, seBound, 0.5);
    bottomBound = google.maps.geometry.spherical.interpolate(seBound, swBound, 0.5);

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

    leftMarker = new google.maps.Marker({
        position: leftBound,
        icon: circleIcon,
        map: map,
        cursor: 'ew-resize',
        draggable: true,
        crossOnDrag: false
    });

    topMarker = new google.maps.Marker({
        position: topBound,
        map: map,
        icon: circleIcon,
        draggable: true,
        cursor: 'ns-resize',
        crossOnDrag: false
    });

    rightMarker = new google.maps.Marker({
        position: rightBound,
        map: map,
        icon: circleIcon,
        draggable: true,
        cursor: 'ew-resize',
        crossOnDrag: false
    });

    bottomMarker = new google.maps.Marker({
        position: bottomBound,
        map: map,
        icon: circleIcon,
        draggable: true,
        cursor: 'ns-resize',
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

    google.maps.event.addListener(leftMarker, 'drag', function () {
        nwMarker.setPosition(new google.maps.LatLng(neMarker.getPosition().lat(), leftMarker.getPosition().lng()));
        swMarker.setPosition(new google.maps.LatLng(seMarker.getPosition().lat(), leftMarker.getPosition().lng()));
        var newBounds = new google.maps.LatLngBounds(swMarker.getPosition(), neMarker.getPosition());
        leftMarker.setPosition(google.maps.geometry.spherical.interpolate(nwMarker.getPosition(), swMarker.getPosition(), 0.5));
        topMarker.setPosition(google.maps.geometry.spherical.interpolate(neMarker.getPosition(), nwMarker.getPosition(), 0.5));
        bottomMarker.setPosition(google.maps.geometry.spherical.interpolate(seMarker.getPosition(), swMarker.getPosition(), 0.5));
        centerMarker.setPosition(newBounds.getCenter());
        centerPreviousPos = centerMarker.getPosition();
        overlay.updateBounds(newBounds);
    });

    google.maps.event.addListener(rightMarker, 'drag', function () {
        neMarker.setPosition(new google.maps.LatLng(nwMarker.getPosition().lat(), rightMarker.getPosition().lng()));
        seMarker.setPosition(new google.maps.LatLng(swMarker.getPosition().lat(), rightMarker.getPosition().lng()));
        var newBounds = new google.maps.LatLngBounds(swMarker.getPosition(), neMarker.getPosition());
        rightMarker.setPosition(google.maps.geometry.spherical.interpolate(neMarker.getPosition(), seMarker.getPosition(), 0.5));
        topMarker.setPosition(google.maps.geometry.spherical.interpolate(neMarker.getPosition(), nwMarker.getPosition(), 0.5));
        bottomMarker.setPosition(google.maps.geometry.spherical.interpolate(seMarker.getPosition(), swMarker.getPosition(), 0.5));
        centerMarker.setPosition(newBounds.getCenter());
        centerPreviousPos = centerMarker.getPosition();
        overlay.updateBounds(newBounds);
    });

    google.maps.event.addListener(topMarker, 'drag', function () {
        neMarker.setPosition(new google.maps.LatLng(topMarker.getPosition().lat(), seMarker.getPosition().lng()));
        nwMarker.setPosition(new google.maps.LatLng(topMarker.getPosition().lat(), swMarker.getPosition().lng()));
        var newBounds = new google.maps.LatLngBounds(swMarker.getPosition(), neMarker.getPosition());
        topMarker.setPosition(google.maps.geometry.spherical.interpolate(neMarker.getPosition(), nwMarker.getPosition(), 0.5));
        leftMarker.setPosition(google.maps.geometry.spherical.interpolate(nwMarker.getPosition(), swMarker.getPosition(), 0.5));
        rightMarker.setPosition(google.maps.geometry.spherical.interpolate(neMarker.getPosition(), seMarker.getPosition(), 0.5));
        centerMarker.setPosition(newBounds.getCenter());
        centerPreviousPos = centerMarker.getPosition();
        overlay.updateBounds(newBounds);
    });

    google.maps.event.addListener(bottomMarker, 'drag', function () {
        seMarker.setPosition(new google.maps.LatLng(bottomMarker.getPosition().lat(), neMarker.getPosition().lng()));
        swMarker.setPosition(new google.maps.LatLng(bottomMarker.getPosition().lat(), nwMarker.getPosition().lng()));
        var newBounds = new google.maps.LatLngBounds(swMarker.getPosition(), neMarker.getPosition());
        bottomMarker.setPosition(google.maps.geometry.spherical.interpolate(seMarker.getPosition(), swMarker.getPosition(), 0.5));
        leftMarker.setPosition(google.maps.geometry.spherical.interpolate(nwMarker.getPosition(), swMarker.getPosition(), 0.5));
        rightMarker.setPosition(google.maps.geometry.spherical.interpolate(neMarker.getPosition(), seMarker.getPosition(), 0.5));
        centerMarker.setPosition(newBounds.getCenter());
        centerPreviousPos = centerMarker.getPosition();
        overlay.updateBounds(newBounds);
    });

    google.maps.event.addListener(swMarker, 'drag', function () {

        var newBounds = new google.maps.LatLngBounds(swMarker.getPosition(), neMarker.getPosition());
        nwMarker.setPosition(new google.maps.LatLng(neMarker.getPosition().lat(), swMarker.getPosition().lng()));
        seMarker.setPosition(new google.maps.LatLng(swMarker.getPosition().lat(), neMarker.getPosition().lng()));
        leftMarker.setPosition(google.maps.geometry.spherical.interpolate(nwMarker.getPosition(), swMarker.getPosition(), 0.5));
        topMarker.setPosition(google.maps.geometry.spherical.interpolate(neMarker.getPosition(), nwMarker.getPosition(), 0.5));
        rightMarker.setPosition(google.maps.geometry.spherical.interpolate(neMarker.getPosition(), seMarker.getPosition(), 0.5));
        bottomMarker.setPosition(google.maps.geometry.spherical.interpolate(seMarker.getPosition(), swMarker.getPosition(), 0.5));
        centerMarker.setPosition(newBounds.getCenter());
        centerPreviousPos = centerMarker.getPosition();
        overlay.updateBounds(newBounds);
    });

    google.maps.event.addListener(neMarker, 'drag', function () {

        var newBounds = new google.maps.LatLngBounds(swMarker.getPosition(), neMarker.getPosition());
        nwMarker.setPosition(new google.maps.LatLng(neMarker.getPosition().lat(), swMarker.getPosition().lng()));
        seMarker.setPosition(new google.maps.LatLng(swMarker.getPosition().lat(), neMarker.getPosition().lng()));
        leftMarker.setPosition(google.maps.geometry.spherical.interpolate(nwMarker.getPosition(), swMarker.getPosition(), 0.5));
        topMarker.setPosition(google.maps.geometry.spherical.interpolate(neMarker.getPosition(), nwMarker.getPosition(), 0.5));
        rightMarker.setPosition(google.maps.geometry.spherical.interpolate(neMarker.getPosition(), seMarker.getPosition(), 0.5));
        bottomMarker.setPosition(google.maps.geometry.spherical.interpolate(seMarker.getPosition(), swMarker.getPosition(), 0.5));
        centerMarker.setPosition(newBounds.getCenter());
        centerPreviousPos = centerMarker.getPosition();
        overlay.updateBounds(newBounds);
    });

    google.maps.event.addListener(nwMarker, 'drag', function () {

        neMarker.setPosition(new google.maps.LatLng(nwMarker.getPosition().lat(), seMarker.getPosition().lng()));
        swMarker.setPosition(new google.maps.LatLng(seMarker.getPosition().lat(), nwMarker.getPosition().lng()));
        var newBounds = new google.maps.LatLngBounds(swMarker.getPosition(), neMarker.getPosition());
        leftMarker.setPosition(google.maps.geometry.spherical.interpolate(nwMarker.getPosition(), swMarker.getPosition(), 0.5));
        topMarker.setPosition(google.maps.geometry.spherical.interpolate(neMarker.getPosition(), nwMarker.getPosition(), 0.5));
        rightMarker.setPosition(google.maps.geometry.spherical.interpolate(neMarker.getPosition(), seMarker.getPosition(), 0.5));
        bottomMarker.setPosition(google.maps.geometry.spherical.interpolate(seMarker.getPosition(), swMarker.getPosition(), 0.5));
        centerMarker.setPosition(newBounds.getCenter());
        centerPreviousPos = centerMarker.getPosition();
        overlay.updateBounds(newBounds);
    });

    google.maps.event.addListener(seMarker, 'drag', function () {

        neMarker.setPosition(new google.maps.LatLng(nwMarker.getPosition().lat(), seMarker.getPosition().lng()));
        swMarker.setPosition(new google.maps.LatLng(seMarker.getPosition().lat(), nwMarker.getPosition().lng()));
        var newBounds = new google.maps.LatLngBounds(swMarker.getPosition(), neMarker.getPosition());
        leftMarker.setPosition(google.maps.geometry.spherical.interpolate(nwMarker.getPosition(), swMarker.getPosition(), 0.5));
        topMarker.setPosition(google.maps.geometry.spherical.interpolate(neMarker.getPosition(), nwMarker.getPosition(), 0.5));
        rightMarker.setPosition(google.maps.geometry.spherical.interpolate(neMarker.getPosition(), seMarker.getPosition(), 0.5));
        bottomMarker.setPosition(google.maps.geometry.spherical.interpolate(seMarker.getPosition(), swMarker.getPosition(), 0.5));
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
        leftMarker.setPosition(google.maps.geometry.spherical.interpolate(nwMarker.getPosition(), swMarker.getPosition(), 0.5));
        topMarker.setPosition(google.maps.geometry.spherical.interpolate(neMarker.getPosition(), nwMarker.getPosition(), 0.5));
        rightMarker.setPosition(google.maps.geometry.spherical.interpolate(neMarker.getPosition(), seMarker.getPosition(), 0.5));
        bottomMarker.setPosition(google.maps.geometry.spherical.interpolate(seMarker.getPosition(), swMarker.getPosition(), 0.5));
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

function findMap(F) {
	for (func in F) {
		if (func.length == 3 && typeof F[func] == "function") {
			parent = F[func]();
			if (parent != null)	{
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
		}
	}
}

function getMap() {
    map = findMap(gGeowikiApplication.F);
}
getMap();
var circle = null;
var usingCircle
var overlayOpacity;
var imgOverlay;
window.addEventListener("message", function (e) {
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
                center: map.getCenter()
            });
        } else {
            circle.setVisible(!circle.getVisible());
        }
    } else if (e.data.action === 'toggleShowKml') {
        usingCircle = false;
		kmlSrc = e.data.kmlUrl;
        if (kmlOverlay == null) {
		    kmlOverlay = new google.maps.KmlLayer({
				url: kmlSrc,
				clickable: false,
				map: map
			});
			
			google.maps.event.addListener(kmlOverlay, 'status_changed', function () {
				status = kmlOverlay.getStatus();
				window.postMessage({action: 'displayKmlStatusMessage', 'status': status.toString()}, '*');
			});
        } else {
            if (kmlOverlay.getMap() == null) {
				kmlOverlay.setMap(map);
			} else {
				kmlOverlay.setMap(null);
			}
        }
    } else if (e.data.action === 'toggleShowImage') {
        usingCircle = false;
        imgSrc = e.data.imageUrl;
        if (overlay == null) {
            overlayOpacity = e.data.opactiy;
            addImage();
        } else {
            if (overlay.getMap() == null) {
                overlay.setMap(map);
                swMarker.setMap(map);
                neMarker.setMap(map);
                nwMarker.setMap(map);
                seMarker.setMap(map);
                leftMarker.setMap(map);
                topMarker.setMap(map);
                rightMarker.setMap(map);
                bottomMarker.setMap(map);
                centerMarker.setMap(map);
            } else {
                overlay.setMap(null);
                swMarker.setMap(null);
                neMarker.setMap(null);
                nwMarker.setMap(null);
                seMarker.setMap(null);
                leftMarker.setMap(null);
                topMarker.setMap(null);
                rightMarker.setMap(null);
                bottomMarker.setMap(null);
                centerMarker.setMap(null);
            }
        }
    } else if (e.data.action === 'resetPosition') {
        if (usingCircle) {
            circle.setOptions({
                center: map.getCenter(),
                radius: google.maps.geometry.spherical.computeDistanceBetween(map.getBounds().getNorthEast(), map.getBounds().getCenter()) / 3
            });
        } else {
            resetBounds();
            overlay.updateBounds(bounds);
            swMarker.setPosition(swBound);
            neMarker.setPosition(neBound);
            nwMarker.setPosition(nwBound);
            seMarker.setPosition(seBound);
            leftMarker.setPosition(leftBound);
            topMarker.setPosition(topBound);
            rightMarker.setPosition(rightBound);
            bottomMarker.setPosition(bottomBound);
            centerMarker.setPosition(bounds.getCenter());
            centerPreviousPos = centerMarker.getPosition();
        }
        if (imgOverlay != null) {
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
                leftMarker.setMap(map);
                topMarker.setMap(map);
                rightMarker.setMap(map);
                bottomMarker.setMap(map);
                centerMarker.setMap(map);
            } else {
                swMarker.setMap(null);
                neMarker.setMap(null);
                nwMarker.setMap(null);
                seMarker.setMap(null);
                leftMarker.setMap(null);
                topMarker.setMap(null);
                rightMarker.setMap(null);
                bottomMarker.setMap(null);
                centerMarker.setMap(null);
            }
        }
    } else if (e.data.action === 'setImage') {
        overlay.image_ = e.data.newUrl;
        imgOverlay.src = e.data.newUrl;
    } else if (e.data.action === 'setKml') {
        kmlSrc = e.data.newUrl;
        kmlOverlay.setUrl(e.data.newUrl);
    } else if (e.data.action === 'changeOpacity') {
        if (usingCircle) {
            circle.setOptions({
                strokeOpacity: e.data.newValue
            });
        } else {
            overlayOpacity = e.data.newValue;
            imgOverlay.style.opacity = overlayOpacity;
        }
    } else if (e.data.action === 'changeRotation') {
        imgOverlay.style.transform = 'rotate(' + e.data.newValue / 8 + 'deg)';
    } else if (e.data.action === 'changeCircleWidth') {
        circle.setOptions({
            strokeWeight: e.data.newValue
        });
    } else if (e.data.action === 'changeCircleColor') {
        circle.setOptions({
            strokeColor: e.data.newValue
        });
    }
});