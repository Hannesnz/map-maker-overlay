var supportedLanguages = ['en', 'en-US', 'en-GB', 'nl', 'ru', 'it', 'de', 'uk', 'pt-BR'];

function OverlayData() {
	this.circleWidth = 7;
	this.circleColor = '#ff0000';
	this.circleOpacity = 0.5;
	this.imageOpacity = 1;
	this.savedImages = [];
	this.hideTranslateMessage = false;
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
			if (items.savedImages != null) {
				data.savedImages = items.savedImages;
			}
			if (items.hideTranslateMessage != null) {
				data.hideTranslateMessage = items.hideTranslateMessage;
			}
		}
		sendResponse();
	});
};

OverlayData.prototype.saveData = function() {
	var data = this;
	chrome.storage.sync.set({circleWidth: data.circleWidth,
							 circleColor: data.circleColor,
							 opacity: data.opacity,
							 hideTranslateMessage: data.hideTranslateMessage,
							 savedImages: data.savedImages}, function() {});
};

OverlayData.prototype.indexOfSavedImageName = function (savedImageName) {
	for (var i = 0; i < this.savedImages.length; i++) {
		if (this.savedImages[i].name == savedImageName) {
			return i;
		}
	}
	return -1;
};

OverlayData.prototype.addSavedImage = function(savedImage) {
	var index = this.indexOfSavedImageName(savedImage.name);
	if (index != -1) {
		this.savedImages.splice(index, 1, savedImage);
	} else {
		this.savedImages.push(savedImage);
	}
	this.saveData();
	return true;
};

OverlayData.prototype.removeSavedImage = function(savedImageName) {
	this.savedImages.splice(this.indexOfSavedImageName(savedImageName), 1);
	this.saveData();
};

OverlayData.prototype.getSavedImage = function(savedImageName) {
	return this.savedImages[this.indexOfSavedImageName(savedImageName)];
};

OverlayData.prototype.hasSavedImageName = function(savedImageName) {
	return this.indexOfSavedImageName(savedImageName) != -1;
};

var overlayData = null;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'showPageAction') {
		chrome.pageAction.show(sender.tab.id);
	}
});

if (supportedLanguages.indexOf(chrome.i18n.getUILanguage()) < 0) {
	chrome.contextMenus.removeAll();
	chrome.contextMenus.create({
		  title: "Help Translate...",
		  contexts: ["page_action"],
		  onclick: function() {
			chrome.tabs.create({ url: "translate.html" });;
		  }
	});
}