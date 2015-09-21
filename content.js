var diffX;
var diffY;

var container;
var circle;
var horzLine;
var vertLine;
var topLeft;
var topRight;
var bottomRight;
var bottomLeft;

function startTopRightResize(e) {
	e.stopPropagation();
	diffX = e.clientX - parseInt(container.style.width);
	window.addEventListener('mousemove', topRightResize, true);
}

function topRightResize(e) {
	container.style.width = (e.clientX - diffX) + 'px';
	container.style.height = parseInt(container.style.width) + 'px';
	resetCrosshairs();
}

function startBottomLeftResize(e) {
	e.stopPropagation();
	diffY = e.clientY - parseInt(container.style.height);
	window.addEventListener('mousemove', bottomLeftResize, true);
}

function bottomLeftResize(e) {
	container.style.height = (e.clientY - diffY) + 'px';
	container.style.width = parseInt(container.style.height) + 'px';
	resetCrosshairs();
}

function startBottomRightResize(e) {
	e.stopPropagation();
	diffX = e.clientX - parseInt(container.style.width);
	diffY = e.clientY - parseInt(container.style.height);
	window.addEventListener('mousemove', bottomRightResize, true);
}

function bottomRightResize(e) {
	var newHeight = (e.clientY - diffY),
		newWidth = (e.clientX - diffX);

	container.style.height = Math.max(newHeight, newWidth) + 'px';
	container.style.width = Math.max(newHeight, newWidth) + 'px';
	resetCrosshairs();
}

function startMoving(e) {
	e.stopPropagation();
	diffX = e.clientX - parseInt(container.style.left);
	diffY = e.clientY - parseInt(container.style.top);
	window.addEventListener('mousemove', moveContainer, true);
}

function moveContainer(e) {
	container.style.left = (e.clientX - diffX) + 'px';
	container.style.top = (e.clientY - diffY) + 'px';
}

function stopMoving() {
	window.removeEventListener('mousemove', moveContainer, true);
	window.removeEventListener('mousemove', topRightResize, true);
	window.removeEventListener('mousemove', bottomLeftResize, true);
	window.removeEventListener('mousemove', bottomRightResize, true);
}

function resetCrosshairs() {
	horzLine.style.width = (parseInt(container.style.width) - (parseInt(circle.style.borderWidth) * 2)) + 'px';
	vertLine.style.height = (parseInt(container.style.height) - (parseInt(circle.style.borderWidth) * 2)) + 'px';
}

function setOpacity(opacityValue) {
	circle.style.opacity = opacityValue;
	horzLine.style.opacity = opacityValue;
	vertLine.style.opacity = opacityValue;
}

var mostLeft;
var mostTop;
var mainHeight;
var mainWidth;
var gm;
var circleWidth;
var circleColor;
var opacity;

function getMapPositions() {
	gm = document.getElementById('mapv3');
	gm = gm.childNodes[0];
	mainHeight = gm.clientHeight;
	mainWidth = gm.clientWidth;
	gm = gm.childNodes[0];
	mostLeft = Number.MAX_SAFE_INTEGER;
	mostTop = Number.MAX_SAFE_INTEGER;

	var tileOffsetLeft;
	var tileOffsetTop;
	var tiles = gm.childNodes[0].childNodes[0].childNodes[0].childNodes[0];
	var gmBounds = gm.getBoundingClientRect();
	for (i = 0; i < tiles.childNodes.length - 1; i ++) {
		tileBounds = tiles.childNodes[i].getBoundingClientRect();
		if (parseInt(tiles.childNodes[i].style.left) < mostLeft) {
			mostLeft = parseInt(tiles.childNodes[i].style.left);
			tileOffsetLeft = gmBounds.left - tileBounds.left;
		}
		if (parseInt(tiles.childNodes[i].style.top) < mostTop) {
			mostTop = parseInt(tiles.childNodes[i].style.top);
			tileOffsetTop = gmBounds.top - tileBounds.top;
		}
	}
	mostLeft = mostLeft + Math.abs(tileOffsetLeft);
	mostTop = mostTop + Math.abs(tileOffsetTop);

	gm = gm.childNodes[2];
}

function setPosition() {
	getMapPositions();

	container.style.top = (mostTop + (mainHeight / 2)-((mainHeight / 2)/2)) + 'px';
	container.style.left = (mostLeft + (mainWidth / 2)-((mainHeight / 2)/2)) + 'px';
	container.style.width = (mainHeight / 2) + 'px';
	container.style.height = (mainHeight / 2) + 'px';
	resetCrosshairs();
}

function createOverlay() {
	container = document.createElement('div');
	container.setAttribute('id', 'overlay-container');
	container.setAttribute('style', 'position: absolute; display: block');

	circle = document.createElement('div');
	circle.setAttribute('id', 'overlay-circle');
	circle.setAttribute('style', 'position: absolute; display: block; border: ' + circleWidth + 'px solid rgb(222, 15, 15);  border-radius: 50%;  width: 100%; height: 100%; box-sizing: border-box;');
	container.appendChild(circle);

	horzLine = document.createElement('div');
	horzLine.setAttribute('id', 'overlay-horzline');
	horzLine.setAttribute('style', 'position: absolute; display: block; background-color: rgb(222, 15, 15); top: 0; bottom: 0; left: 0; right: 0; margin: auto; width:1px; height: 1px; box-sizing: border-box;');
	container.appendChild(horzLine);

	vertLine = document.createElement('div');
	vertLine.setAttribute('id', 'overlay-vertline');
	vertLine.setAttribute('style', 'position: absolute; display: block; background-color: rgb(222, 15, 15); top: 0; bottom: 0; left: 0; right: 0; margin: auto; height:1px; width: 1px; box-sizing: border-box;');
	container.appendChild(vertLine);

	setOpacity(opacity);
	setCircleColor(circleColor);
	setPosition();
	if (!showCrosshairs) {
		toggleCrosshairs();
	}

	topLeft = document.createElement('div');
	topLeft.setAttribute('id', 'overlay-topleft');
	topLeft.setAttribute('style', 'position: absolute; display: block; cursor: move; border: 1px solid rgb(37, 15, 222);   width: 8px; height: 8px;  left: 0px; top: 0px; background-color: rgb(255, 255, 255);');
	topLeft.addEventListener("mousedown", startMoving, false);
	container.appendChild(topLeft);

	topRight = document.createElement('div');
	topRight.setAttribute('id', 'overlay-topright');
	topRight.setAttribute('style', 'position: absolute; display: block; cursor: ew-resize; right: 0;border: 1px solid rgb(37, 15, 222);   width: 8px; height: 8px;   background-color: rgb(255, 255, 255);"');
	topRight.addEventListener("mousedown", startTopRightResize, false);
	container.appendChild(topRight);

	bottomRight = document.createElement('div');
	bottomRight.setAttribute('id', 'overlay-bottomright');
	bottomRight.setAttribute('style', 'position: absolute; display: block; cursor: nwse-resize; right: 0;bottom: 0;border: 1px solid rgb(37, 15, 222);   width: 8px; height: 8px;   background-color: rgb(255, 255, 255);');
	bottomRight.addEventListener("mousedown", startBottomRightResize, false);
	container.appendChild(bottomRight);

	bottomLeft = document.createElement('div');
	bottomLeft.setAttribute('id', 'overlay-bottomleft');
	bottomLeft.setAttribute('style', 'position: absolute; display: block; cursor: ns-resize; bottom: 0;border: 1px solid rgb(37, 15, 222);   width: 8px; height: 8px;   background-color: rgb(255, 255, 255);');
	bottomLeft.addEventListener("mousedown", startBottomLeftResize, false);
	container.appendChild(bottomLeft);

	gm.appendChild(container);

	window.addEventListener('mouseup', stopMoving, false);
}

function setCircleColor(color) {
	circle.style.borderColor = color;
	horzLine.style.backgroundColor = color;
	vertLine.style.backgroundColor = color;
};

function toggleCrosshairs() {
	horzLine.style.display = (horzLine.style.display == 'block' ? 'none' : 'block');
	vertLine.style.display = (vertLine.style.display == 'block' ? 'none' : 'block');
};

function toggleHandles() {
	topLeft.style.display = (topLeft.style.display == 'block' ? 'none' : 'block');
	topRight.style.display = (topRight.style.display == 'block' ? 'none' : 'block');
	bottomRight.style.display = (bottomRight.style.display == 'block' ? 'none' : 'block');
	bottomLeft.style.display = (bottomLeft.style.display == 'block' ? 'none' : 'block');
};

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.action === 'changeOpacity') {
			setOpacity(request.newValue);
		} else if (request.action === 'changeCircleWidth') {
			circle.style.borderWidth = request.newValue + 'px';
			resetCrosshairs();
		} else if (request.action === 'changeCircleColor') {
			setCircleColor(request.newValue);
		} else if (request.action === 'resetPosition') {
			setPosition();
		} else if (request.action === 'toggleCrosshairs') {
			toggleCrosshairs();
		} else if (request.action === 'toggleHandles') {
			toggleHandles();
		} else if (request.action === 'overlayShowing') {
			var exists = container != null;
			var isShowing = exists;
			var crosshairsShowing = false;
			var handlesShowing = false;
			if (exists) {
				isShowing = container.style.display == 'block';
				crosshairsShowing = horzLine.style.display == 'block';
				handlesShowing = topLeft.style.display == 'block';
			}
			sendResponse({'showing': isShowing,
						  'created': exists,
						  'crosshairsShowing': crosshairsShowing,
						   'handlesShowing' : handlesShowing});
		} else {
			if (container == null) {
				circleWidth = request.circleWidth;
				circleColor = request.circleColor;
				opacity = request.opacity;
				showCrosshairs = request.showCrosshairs;
				createOverlay();
			} else {
				if (container.style.display == 'block') {
					container.style.display = 'none';
				} else {
					container.style.display = 'block';
				}
			}
		}
	}
);