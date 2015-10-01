function injectJs(link) {
	var scr = document.createElement('script');
	scr.type="text/javascript";
	scr.src=link;
	document.getElementsByTagName('head')[0].appendChild(scr)
}

var ready = false;
var showing = false;
var handlesShowing = true;
var circleWidth;
var circleColor;
var opacity;

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
		} else if (request.action === 'resetPosition') {
			window.postMessage({action: 'resetPosition'}, '*');
		} else if (request.action === 'toggleHandles') {
			handlesShowing = !handlesShowing;
			window.postMessage({action: 'toggleHandles'}, '*');
		} else if (request.action === 'overlayShowing') {
			sendResponse({'showing': showing,
						  'handlesShowing' : handlesShowing,
						  'ready' : ready});
		} else {
			showing = !showing;
			circleWidth = request.circleWidth;
			circleColor = request.circleColor;
			opacity: request.opacity;
			window.postMessage({action: 'toggleShowCircle', circleColor: request.circleColor, circleWidth: request.circleWidth, opacity: request.opacity}, '*');
		}
	}
);

document.onreadystatechange = function(e) {
	if (document.readyState === 'complete') {
		ready = true;
		injectJs(chrome.extension.getURL('injected.js'));
	}
};