var ready = false;
var showingCircle = false;
var showingImage = false;
var showingKml = false;
var overlayType = 'Circle';
var handlesShowing = true;
var circleWidth;
var circleColor;
var currentRotation;
var opacity;
var rotation;
var imageUrl;
var kmlUrl;

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.action === 'changeOpacity') {
			opacity = request.newValue;
			window.postMessage({action: 'changeOpacity', newValue: opacity}, '*');
		} else if (request.action === 'changeCircleWidth') {
			circleWidth = request.newValue;
			window.postMessage({action: 'changeCircleWidth', newValue: circleWidth}, '*');
		} else if (request.action === 'changeCircleColor') {
			circleColor = request.newValue;
			window.postMessage({action: 'changeCircleColor', newValue: circleColor}, '*');
		} else if (request.action === 'changeRotation') {
			currentRotation = request.newValue;
			window.postMessage({action: 'changeRotation', newValue: currentRotation}, '*');
		} else if (request.action === 'resetPosition') {
			window.postMessage({action: 'resetPosition'}, '*');
			currentRotation = 0;
		} else if (request.action === 'toggleHandles') {
			handlesShowing = !handlesShowing;
			window.postMessage({action: 'toggleHandles'}, '*');
		} else if (request.action === 'setImage') {
			imageUrl = request.newUrl;
			window.postMessage({action: 'setImage', newUrl: request.newUrl}, '*');
		} else if (request.action === 'setKml') {
			kmlUrl = request.newUrl;
			window.postMessage({action: 'setKml', newUrl: request.newUrl}, '*');
		} else if (request.action === 'overlayShowing') {
			sendResponse({'showingCircle': showingCircle,
						  'showingImage': showingImage,
						  'showingKml': showingKml,
						  'overlayType': overlayType,	
						  'handlesShowing' : handlesShowing,
						  'currentRotation' : currentRotation,
						  'ready' : ready,
						  'imageUrl': imageUrl,
						  'kmlUrl': kmlUrl});
		} else if (request.action === 'toggleCircleVisibility') {
			overlayType = 'Circle';
			if (showingImage) {
				showingImage = false;
				window.postMessage({action: 'toggleShowImage'}, '*');
			}
			if (showingKml) {
				showingKml = false;
				window.postMessage({action: 'toggleShowKml'}, '*');
			}
			showingCircle = !showingCircle;
			circleWidth = request.circleWidth;
			circleColor = request.circleColor;
			opacity = request.opacity;
			window.postMessage({action: 'toggleShowCircle', circleColor: request.circleColor, circleWidth: request.circleWidth, opacity: request.opacity}, '*');
		} else if (request.action === 'toggleImageVisibility') {
			overlayType = 'Image';
			if (showingCircle) {
				showingCircle = false;
				window.postMessage({action: 'toggleShowCircle'}, '*');
			}
			if (showingKml) {
				showingKml = false;
				window.postMessage({action: 'toggleShowKml'}, '*');
			}
			showingImage = !showingImage;
			opacity = request.opacity;
			imageUrl = request.imageUrl;
			window.postMessage({action: 'toggleShowImage', imageUrl: request.imageUrl, opacity: request.opacity}, '*');
		} else if (request.action === 'toggleKmlVisibility') {
			overlayType = 'KML';
			if (showingCircle) {
				showingCircle = false;
				window.postMessage({action: 'toggleShowCircle'}, '*');
			}
			if (showingImage) {
				showingImage = false;
				window.postMessage({action: 'toggleShowImage'}, '*');
			}
			showingKml = !showingKml;
			kmlUrl = request.kmlUrl;
			window.postMessage({action: 'toggleShowKml', kmlUrl: request.kmlUrl}, '*');
		}
	}
);

window.addEventListener("message", function (e) {
	if (e.data.action === 'displayKmlStatusMessage') {
		console.log('passingthru:' + e.data.status);
		chrome.runtime.sendMessage({action:'displayKmlStatusMessage', status: e.data.status});
	}
});

function injectJs(link) {
	var scr = document.createElement('script');
	scr.type="text/javascript";
	scr.src=link;
	document.getElementsByTagName('head')[0].appendChild(scr)
}

document.onreadystatechange = function(e) {
	if (document.readyState === 'complete') {
		ready = true;
		injectJs(chrome.extension.getURL('injected.js'));
	}
};