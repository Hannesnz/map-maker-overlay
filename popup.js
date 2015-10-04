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
							var currentRotation = response.currentRotation;
							var showing = showingCircle || showingImage;
							var ready = response.ready;
							var handlesShowing = response.handlesShowing;
							var imageUrl = response.imageUrl;
							if (ready) {
								$( "#not-ready" ).hide();
								$( "#controls" ).show();
							} else {
								$( "#not-ready" ).show();
								$( "#controls" ).hide();
							}
							$( "#imageUrl").on("click", function () { $(this).select(); });
							function showCorrectControls(type) {
								switch (type) {
									case 'Circle': 
										$('#circle-options').show();
										$('#image-options').hide();
										break;
									case 'Image': 
										$('#circle-options').hide();
										$('#image-options').show();
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
							console.log(imageUrl);
							$( "#imageUrl" ).val(imageUrl);
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
							$( "#setImage" ).button({disabled:!showingImage})
								.click(function( event ) {
									event.preventDefault();
									chrome.tabs.sendMessage(tabs[0].id, {action: 'setImage', newUrl: $("#imageUrl").val()}, function(response) {});
								});
							$( "#toggleCircle" ).button({label:(showingCircle) ? "Hide Overlay" : "Show Overlay"})
								.click(function( event ) {
									event.preventDefault();
									showingCircle = !showingCircle;
									showingImage = false;
									$( "#toggleImage" ).button( "option", "label", "Show Overlay" );
									$("#rotation").slider( "value", 0 );
									showing = showingCircle || showingImage;

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
									$( "#toggleCircle" ).button( "option", "label", "Show Overlay" );
									showing = showingCircle || showingImage;

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