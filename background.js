function OverlayData() {
	this.circleWidth = 7;
	this.circleColor = '#ff0000';
	this.opacity = 0.5;
}

OverlayData.prototype.loadData = function (sendResponse) {
	var data = this;
	chrome.storage.sync.get(null, function (items) {
		if (!chrome.runtime.error) {
			if (items.circleWidth != null) {
				data.circleWidth = items.circleWidth;
			}
			if (items.circleColor != null) {
				data.circleColor = items.circleColor;
			}
			if (items.opacity != null) {
				data.opacity = items.opacity;
			}
		}
		sendResponse();
	});
};

OverlayData.prototype.saveData = function() {
	var data = this;
	chrome.storage.sync.set({circleWidth: data.circleWidth,
							 circleColor: data.circleColor,
							 opacity: data.opacity}, function() {});
};

var overlayData = null;

chrome.runtime.onInstalled.addListener(function() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlContains: '/mapmaker' }
          })
        ],
        actions: [ new chrome.declarativeContent.ShowPageAction() ]
      }
    ]);
  });
});

