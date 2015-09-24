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
							var showing = response.showing;
							var created = response.created;
							var crosshairsShowing;
							var handlesShowing;
							var keepingAspect;
							var currentRotation;
							if (created) {
								crosshairsShowing = response.crosshairsShowing;
								handlesShowing = response.handlesShowing;
								keepingAspect = response.keepingAspect;
								currentRotation = response.currentRotation;
							} else {
								crosshairsShowing = bg.overlayData.showCrosshairs;
								handlesShowing = true;
								keepingAspect = true;
								currentRotation = 0;
							}
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
							$( "#rotation" ).slider({
								max: 720,
								min: 0,
								value: currentRotation,
								disabled: !showing,
								slide: function( event, ui ) {
									chrome.tabs.sendMessage(tabs[0].id, {action: 'changeRotation', newValue: ui.value}, function(response) {});
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
								});
							$( "#toggleKeepAspect" ).prop('checked', keepingAspect).button({disabled:!showing, icons: {primary: (keepingAspect) ? "ui-icon-check" : "ui-icon-closethick"}}).button("refresh")
								.click(function( event ) {
									keepingAspect = !keepingAspect;
									$( "#toggleKeepAspect" ).prop('checked', keepingAspect).button("refresh").button( "option", "icons", {primary: (keepingAspect) ? "ui-icon-check" : "ui-icon-closethick"} );
									chrome.tabs.sendMessage(tabs[0].id, {action: 'toggleKeepAspect'}, function(response) {});
								});
							$( "#toggleCrosshairs" ).button({disabled:!showing, label:(crosshairsShowing) ? "Hide Crosshairs" : "Show Crosshairs"})
								.click(function( event ) {
									event.preventDefault();
									crosshairsShowing = !crosshairsShowing;
									bg.overlayData.showCrosshairs = crosshairsShowing;
									$( "#toggleCrosshairs" ).button( "option", "label", (crosshairsShowing) ? "Hide Crosshairs" : "Show Crosshairs" );
									chrome.tabs.sendMessage(tabs[0].id, {action: 'toggleCrosshairs'}, function(response) {});
								});
							$( "#toggleHandles" ).button({disabled:!showing, label:(handlesShowing) ? "Hide Handles" : "Show Handles"})
								.click(function( event ) {
									event.preventDefault();
									handlesShowing = !handlesShowing;
									$( "#toggleHandles" ).button( "option", "label", (handlesShowing) ? "Hide Handles" : "Show Handles" );
									chrome.tabs.sendMessage(tabs[0].id, {action: 'toggleHandles'}, function(response) {});
								});
							$( "#toggle" ).button({label:(showing) ? "Hide Overlay" : "Show Overlay"})
								.click(function( event ) {
									event.preventDefault();
									showing = !showing;

									$( "#toggle" ).button( "option", "label", (showing) ? "Hide Overlay" : "Show Overlay" );
									$( "#reset" ).button( "option", "disabled", !showing );
									$( "#opacity" ).slider( "option", "disabled", !showing );
									$( "#rotation" ).slider( "option", "disabled", !showing );
									$( "#circle-width" ).slider( "option", "disabled", !showing );
									$( "#circle-color" ).button( "option", "disabled", !showing );
									$( "#toggleCrosshairs" ).button( "option", "disabled", !showing );
									$( "#toggleHandles" ).button( "option", "disabled", !showing );
									$( "#toggleKeepAspect" ).button( "option", "disabled", !showing );

									chrome.tabs.sendMessage(tabs[0].id, {action: 'toggleVisibility',
																		 opacity: bg.overlayData.opacity,
																		 circleWidth: bg.overlayData.circleWidth,
																		 circleColor: bg.overlayData.circleColor,
																		 showCrosshairs: bg.overlayData.showCrosshairs}, function(response) {});
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