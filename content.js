var ready = false;
var showingCircle = false;
var showingImage = false;
var showingKml = false;
var overlayType = 'Circle';
var circleHandlesShowing = true;
var imageHandlesShowing = true;
var circleWidth;
var circleColor;
var currentRotation;
var currentCircleOpacity;
var currentImageOpacity;
var imageUrl;
var kmlUrl;

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.action === 'changeCircleOpacity') {
			currentCircleOpacity = request.newValue;
			overlayType = 'Circle';
			window.postMessage({action: 'changeCircleOpacity', newValue: currentCircleOpacity}, '*');
		} else if (request.action === 'changeImageOpacity') {
			currentImageOpacity = request.newValue;
			overlayType = 'Image';
			window.postMessage({action: 'changeImageOpacity', newValue: currentImageOpacity}, '*');
		} else if (request.action === 'changeCircleWidth') {
			circleWidth = request.newValue;
			overlayType = 'Circle';
			window.postMessage({action: 'changeCircleWidth', newValue: circleWidth}, '*');
		} else if (request.action === 'changeCircleColor') {
			circleColor = request.newValue;
			overlayType = 'Circle';
			window.postMessage({action: 'changeCircleColor', newValue: circleColor}, '*');
		} else if (request.action === 'changeRotation') {
			currentRotation = request.newValue;
			overlayType = 'Image';
			window.postMessage({action: 'changeRotation', newValue: currentRotation}, '*');
		} else if (request.action === 'resetCirclePosition') {
			overlayType = 'Circle';
			window.postMessage({action: 'resetCirclePosition'}, '*');
		} else if (request.action === 'resetImagePosition') {
			window.postMessage({action: 'resetImagePosition'}, '*');
			overlayType = 'Image';
			currentRotation = 0;
		} else if (request.action === 'circleToggleHandles') {
			circleHandlesShowing = !circleHandlesShowing;
			overlayType = 'Circle';
			window.postMessage({action: 'circleToggleHandles'}, '*');
		} else if (request.action === 'imageToggleHandles') {
			imageHandlesShowing = !imageHandlesShowing;
			overlayType = 'Image';
			window.postMessage({action: 'imageToggleHandles'}, '*');
		} else if (request.action === 'getSaveInfo') {
			window.postMessage({action: 'getSaveInfo', saveAs: request.saveAs}, '*');
		} else if (request.action === 'setImage') {
			overlayType = 'Image';
			showingImage = true;
			imageUrl = request.imageUrl;
			if (request.hasOwnProperty('opacity')) {
				currentImageOpacity = request.opacity;
			}
			if (request.hasOwnProperty('rotation')) {
				currentRotation = request.rotation;
			}
			var values = {};
			for(var k in request) values[k]=request[k];
			window.postMessage(values, '*');
		} else if (request.action === 'setKml') {
			kmlUrl = request.newUrl;
			overlayType = 'KML';
			window.postMessage({action: 'setKml', newUrl: request.newUrl}, '*');
		} else if (request.action === 'getCurrentImageUrl') {
			sendResponse({'imageUrl': imageUrl});
		} else if (request.action === 'overlayShowing') {
			sendResponse({'showingCircle': showingCircle,
						  'showingImage': showingImage,
						  'showingKml': showingKml,
						  'overlayType': overlayType,	
						  'circleHandlesShowing' : circleHandlesShowing,
						  'imageHandlesShowing' : imageHandlesShowing,
						  'currentRotation' : currentRotation,
						  'ready' : ready,
						  'imageUrl': imageUrl,
						  'kmlUrl': kmlUrl});
		} else if (request.action === 'toggleCircleVisibility') {
			overlayType = 'Circle';
			showingCircle = !showingCircle;
			circleWidth = request.circleWidth;
			circleColor = request.circleColor;
			currentCircleOpacity = request.opacity;
			window.postMessage({action: 'toggleShowCircle', circleColor: request.circleColor, circleWidth: request.circleWidth, opacity: request.opacity}, '*');
		} else if (request.action === 'toggleImageVisibility') {
			overlayType = 'Image';
			showingImage = !showingImage;
			currentImageOpacity = request.opacity;
			if (currentRotation == null) {
				currentRotation = 0;
			}
			imageUrl = request.imageUrl;
			window.postMessage({action: 'toggleShowImage', imageUrl: request.imageUrl, opacity: request.opacity, rotation: currentRotation}, '*');
		} else if (request.action === 'toggleKmlVisibility') {
			overlayType = 'KML';
			showingKml = !showingKml;
			kmlUrl = request.kmlUrl;
			window.postMessage({action: 'toggleShowKml', kmlUrl: request.kmlUrl}, '*');
		}
	}
);

window.addEventListener("message", function (e) {
	if (e.data.action === 'displayKmlStatusMessage') {
		chrome.runtime.sendMessage({action:'displayKmlStatusMessage', status: e.data.status});
	} else if (e.data.action === 'mapFound') {
		ready = true;
		chrome.runtime.sendMessage({action:'showPageAction'});
	} else if (e.data.action === 'sendSaveInfo') {
		chrome.runtime.sendMessage({action:'sendSaveInfo',
									neLat: e.data.neLat,
									neLng: e.data.neLng,
									swLat: e.data.swLat,
									swLng: e.data.swLng,
									opacity: currentImageOpacity,
									rotation: currentRotation,
									imageUrl: imageUrl,
									saveAs: e.data.saveAs});
	}
});

function injectJs(link) {
	var scr = document.createElement('script');
	scr.type="text/javascript";
	scr.src=link;
	document.getElementsByTagName('head')[0].appendChild(scr)
}

injectJs(chrome.extension.getURL('injected.js'));