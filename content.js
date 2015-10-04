var ready = false;
var showingCircle = false;
var showingImage = false;
var overlayType = 'Circle';
var handlesShowing = true;
var circleWidth;
var circleColor;
var currentRotation;
var opacity;
var rotation;
var imageUrl;

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
		} else if (request.action === 'overlayShowing') {
			sendResponse({'showingCircle': showingCircle,
						  'showingImage': showingImage,
						  'overlayType': overlayType,	
						  'handlesShowing' : handlesShowing,
						  'currentRotation' : currentRotation,
						  'ready' : ready,
						  'imageUrl': imageUrl});
		} else if (request.action === 'toggleCircleVisibility') {
			overlayType = 'Circle';
			if (showingImage) {
				showingImage = false;
				window.postMessage({action: 'toggleShowImage'}, '*');
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
			showingImage = !showingImage;
			opacity = request.opacity;
			imageUrl = request.imageUrl;
			window.postMessage({action: 'toggleShowImage', imageUrl: request.imageUrl, opacity: request.opacity}, '*');
		}
	}
);

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