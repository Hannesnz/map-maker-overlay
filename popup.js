document.onreadystatechange = function(e) {
	if (document.readyState === 'complete') {
		chrome.runtime.getBackgroundPage(function (bg) {
			if (bg.overlayData == null) {
				bg.overlayData = new bg.OverlayData();
			}
			bg.overlayData.loadData(function () {
				chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
					$(function() {
						chrome.tabs.sendMessage(tabs[0].id, {action: 'overlayShowing'}, function(response) {
							var overlayType = response.overlayType;
							var showingCircle = response.showingCircle;
							var showingImage = response.showingImage;
							var showingKml = response.showingKml;
							var currentRotation = response.currentRotation;
							var showing = showingCircle || showingImage || showingKml;
							var ready = response.ready;
							var handlesShowing = response.handlesShowing;
							var imageUrl = response.imageUrl;
							var kmlUrl = response.kmlUrl;
							if (ready) {
								$( "#not-ready" ).hide();
								$( "#controls" ).show();
							} else {
								$( "#not-ready" ).show();
								$( "#controls" ).hide();
							}
							$( "#imageUrl").on("click", function () { $(this).select(); });
							$( "#kmlUrl").on("click", function () { $(this).select(); });
							function showCorrectControls(type) {
								switch (type) {
									case 'Circle': 
										$('#circle-options').show();
										$('#image-options').hide();
										$('#kml-options').hide();
										$('#non-kml-options').show();
										break;
									case 'Image': 
										$('#circle-options').hide();
										$('#image-options').show();
										$('#kml-options').hide();
										$('#non-kml-options').show();
										break;								
									case 'KML': 
										$('#circle-options').hide();
										$('#image-options').hide();
										$('#kml-options').show();
										$('#non-kml-options').hide();
										break;								
								}
							}
							$( "#overlay-type" ).selectmenu({
								change: function( event, ui ) {
									showCorrectControls(ui.item.value);
								}
							});
							$("#overlay-type").val(overlayType);
							$("#overlay-type").selectmenu("refresh");
							showCorrectControls(overlayType);
							$( "#imageUrl" ).val(imageUrl);
							$( "#kmlUrl" ).val(kmlUrl);
							$( "#opacity" ).slider({
								max: 100,
								min: 10,
								value: (bg.overlayData.opacity * 100),
								disabled: !showing,
								slide: function( event, ui ) {
									bg.overlayData.opacity = ui.value / 100;
									chrome.tabs.sendMessage(tabs[0].id, {action: 'changeOpacity', newValue: ui.value / 100}, function(response) {});
								}
							});
							$( "#circle-width" ).slider({
								max: 15,
								min: 1,
								value: bg.overlayData.circleWidth,
								disabled: !showing,
								slide: function( event, ui ) {
									bg.overlayData.circleWidth = ui.value;
									chrome.tabs.sendMessage(tabs[0].id, {action: 'changeCircleWidth', newValue: ui.value}, function(response) {});
								}
							});
							document.getElementById('circle-color').disabled = !showing;
							$( "#circle-color" ).button().val(bg.overlayData.circleColor).on('input', function() { 
								bg.overlayData.circleColor = $(this).val();
								chrome.tabs.sendMessage(tabs[0].id, {action: 'changeCircleColor', newValue: bg.overlayData.circleColor}, function(response) {});
							});

							$( "#reset" ).button({disabled:!showing})
								.click(function( event ) {
									event.preventDefault();
									
									chrome.tabs.sendMessage(tabs[0].id, {action: 'resetPosition'}, function(response) {});
									$("#rotation").slider( "value", 0 );
								});
							$( "#toggleHandles" ).button({disabled:!showing, label:(handlesShowing) ? "Hide Handles" : "Show Handles"})
								.click(function( event ) {
									event.preventDefault();
									handlesShowing = !handlesShowing;
									$( "#toggleHandles" ).button( "option", "label", (handlesShowing) ? "Hide Handles" : "Show Handles" );
									chrome.tabs.sendMessage(tabs[0].id, {action: 'toggleHandles'}, function(response) {});
								});
							$( "#rotation" ).slider({
								max: 720,
								min: -720,
								value: currentRotation,
								disabled: !showingImage,
								slide: function( event, ui ) {
									chrome.tabs.sendMessage(tabs[0].id, {action: 'changeRotation', newValue: ui.value}, function(response) {});
								}							
							});
							$("#imageUrl").keyup(function(event){
								if(event.keyCode == 13){
									if ($('#setImage').is(':disabled')) {
										$("#toggleImage").click();
									} else {
										$("#setImage").click();
									}
								}
							});
							$("#kmlUrl").keyup(function(event){
								if(event.keyCode == 13){
									if ($('#setKml').is(':disabled')) {
										$("#toggleKml").click();
									} else {
										$("#setKml").click();
									}
								}
							});
							$( "#setImage" ).button({disabled:!showingImage})
								.click(function( event ) {
									event.preventDefault();
									chrome.tabs.sendMessage(tabs[0].id, {action: 'setImage', newUrl: $("#imageUrl").val()}, function(response) {});
								});
							$( "#setKml" ).button({disabled:!showingKml})
								.click(function( event ) {
									event.preventDefault();
									chrome.tabs.sendMessage(tabs[0].id, {action: 'setKml', newUrl: $("#kmlUrl").val()}, function(response) {});
								});
							$( "#toggleCircle" ).button({label:(showingCircle) ? "Hide Overlay" : "Show Overlay"})
								.click(function( event ) {
									event.preventDefault();
									showingCircle = !showingCircle;
									showingImage = false;
									showingKml = false;
									$( "#toggleImage" ).button( "option", "label", "Show Overlay" );
									$( "#toggleKml" ).button( "option", "label", "Show Overlay" );
									$("#rotation").slider( "value", 0 );
									showing = showingCircle || showingImage || showingKml;

									$( "#toggleCircle" ).button( "option", "label", (showingCircle) ? "Hide Overlay" : "Show Overlay" );
									$( "#reset" ).button( "option", "disabled", !showingCircle );
									$( "#opacity" ).slider( "option", "disabled", !showingCircle );
									$( "#circle-width" ).slider( "option", "disabled", !showingCircle );
									$( "#circle-color" ).button( "option", "disabled", !showingCircle );
									$( "#toggleHandles" ).button( "option", "disabled", !showingCircle );

									chrome.tabs.sendMessage(tabs[0].id, {action: 'toggleCircleVisibility',
																		 opacity: bg.overlayData.opacity,
																		 circleWidth: bg.overlayData.circleWidth,
																		 circleColor: bg.overlayData.circleColor
																		 }, function(response) {});
								});
							$( "#toggleImage" ).button({label:(showingImage) ? "Hide Overlay" : "Show Overlay"})
								.click(function( event ) {
									event.preventDefault();
									showingImage = !showingImage;
									showingCircle = false;
									showingKml = false;
									$( "#toggleCircle" ).button( "option", "label", "Show Overlay" );
									$( "#toggleKml" ).button( "option", "label", "Show Overlay" );
									showing = showingCircle || showingImage || showingKml;

									$( "#toggleImage" ).button( "option", "label", (showingImage) ? "Hide Overlay" : "Show Overlay" );
									$( "#reset" ).button( "option", "disabled", !showingImage );
									$( "#opacity" ).slider( "option", "disabled", !showingImage );
									$( "#rotation" ).slider( "option", "disabled", !showingImage );
									$( "#setImage" ).button( "option", "disabled", !showingImage );
									$( "#toggleHandles" ).button( "option", "disabled", !showingImage );

									chrome.tabs.sendMessage(tabs[0].id, {action: 'toggleImageVisibility',
																		 opacity: bg.overlayData.opacity,
																		 imageUrl: $("#imageUrl").val()
																		 }, function(response) {});
								});
							$( "#toggleKml" ).button({label:(showingKml) ? "Hide Overlay" : "Show Overlay"})
								.click(function( event ) {
									event.preventDefault();
									showingKml = !showingKml;
									showingCircle = false;
									showingImage = false;
									$( "#toggleCircle" ).button( "option", "label", "Show Overlay" );
									$( "#toggleImage" ).button( "option", "label", "Show Overlay" );
									showing = showingCircle || showingImage || showingKml;

									$( "#toggleKml" ).button( "option", "label", (showingKml) ? "Hide Overlay" : "Show Overlay" );
									$( "#setKml" ).button( "option", "disabled", !showingKml );
									
									chrome.tabs.sendMessage(tabs[0].id, {action: 'toggleKmlVisibility',
																		 kmlUrl: $("#kmlUrl").val()
																		 }, function(response) {});
								});
							
							window.addEventListener('unload', function() {
								bg.overlayData.saveData();
							});
						});
					});
				});
			});
		});
	}
};

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.action === 'displayKmlStatusMessage') {
			if (request.status == 'OK')	{
				$('label[for="kmlError"]').css('display', 'none');
			} else {
				var engMessage;
				switch (request.status) {
					case 'DOCUMENT_NOT_FOUND': engMessage = 'The document could not be found. Most likely it is an invalid URL, or the document is not publicly available.'; break;
					case 'DOCUMENT_TOO_LARGE': engMessage = 'The document exceeds the file size limits of KmlLayer.'; break;
					case 'FETCH_ERROR': engMessage = 'The document could not be fetched.'; break;
					case 'INVALID_DOCUMENT': engMessage = 'The document is not a valid KML, KMZ or GeoRSS document.'; break;
					case 'INVALID_REQUEST': engMessage = 'The KmlLayer is invalid.'; break;
					case 'LIMITS_EXCEEDED': engMessage = 'The document exceeds the feature limits of KmlLayer.'; break;
					case 'TIMED_OUT': engMessage = 'The document could not be loaded within a reasonable amount of time.'; break;
					case 'UNKNOWN': engMessage = 'The document failed to load for an unknown reason.'; break;
				}
				$('label[for="kmlError"]').text(engMessage);
				$('label[for="kmlError"]').css('display', 'block');
			}
		}
	}
);