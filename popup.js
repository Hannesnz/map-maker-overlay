var background = null;

function setProperty(selector, prop, msg) {
    document.querySelector(selector)[prop] = chrome.i18n.getMessage(msg);
}

function loadI18nMessages() {
	setProperty('#loadingMessage', 'innerText', 'loading');
	setProperty('#overlayTypeMessage', 'innerText', 'selectOverlayType');
	setProperty('#circleLabel', 'innerText', 'circleLabel');
	setProperty('#imageLabel', 'innerText', 'imageLabel');
	setProperty('#kmlLabel', 'innerText', 'kmlLabel');
	setProperty('#setImage', 'innerText', 'updateImage');
	setProperty('#setKml', 'innerText', 'updateKml');
	setProperty('#resetImage', 'innerText', 'resetPosition');
	setProperty('#resetCircle', 'innerText', 'resetPosition');
	setProperty('#circleWidthLabel', 'innerText', 'circleWidth');
	setProperty('#circleColorLabel', 'innerText', 'circleColor');
	setProperty('#circleOpacityLabel', 'innerText', 'opacity');
	setProperty('#imageOpacityLabel', 'innerText', 'opacity');
	setProperty('#rotationLabel', 'innerText', 'rotation');
	setProperty('#imageUrlLabel', 'innerText', 'imageUrl');
	setProperty('#kmlUrlLabel', 'innerText', 'kmlUrl');
	setProperty('#btnYes', 'innerText', 'yesButton');
	setProperty('#btnNo', 'innerText', 'noButton');
	setProperty('#btnYesOverwrite', 'innerText', 'yesButton');
	setProperty('#btnNoOverwrite', 'innerText', 'noButton');
	setProperty('#showSaves', 'innerText', 'savedImageButton');
	setProperty('#imagesSavedLabel', 'innerText', 'savedImageLabel');
	setProperty('#btnLoad', 'innerText', 'loadselected');
	setProperty('#btnDelete', 'innerText', 'deleteselected');
	setProperty('#save-image', 'innerText', 'saveCurrentImage');
	setProperty('#txtSaveAsLabel', 'innerText', 'saveCurrentImageDialog');
	setProperty('#saveDialog', 'title', 'saveCurrentImageDialogTitle');
	setProperty('#confirmDeleteDialog', 'title', 'confirmDialogTitle');
	setProperty('#confirmOverwriteDialog', 'title', 'confirmDialogTitle');
	setProperty('#deleteDialogMessage', 'innerText', 'deleteSelectedImageDialog');
	setProperty('#overwriteDialogMessage', 'innerText', 'overwriteImageDialog');
	setProperty('#btnSave', 'innerText', 'saveButton');
	setProperty('#btnCancel', 'innerText', 'cancelButton');
}

document.onreadystatechange = function (e) {
    if (document.readyState === 'complete') {
        chrome.runtime.getBackgroundPage(function (bg) {
            background = bg;
            if (bg.overlayData == null) {
                bg.overlayData = new bg.OverlayData();
            }
            bg.overlayData.loadData(function () {
                chrome.tabs.query({
                    active: true,
                    currentWindow: true
                }, function (tabs) {
                    $(function () {
                        chrome.tabs.sendMessage(tabs[0].id, {
                            action: 'overlayShowing'
                        }, function (response) {
                            loadI18nMessages();
                            var overlayType = response.overlayType;
                            var showingCircle = response.showingCircle;
                            var showingImage = response.showingImage;
                            var showingKml = response.showingKml;
                            var currentRotation = response.currentRotation;
                            var circleHandlesShowing = response.circleHandlesShowing;
                            var imageHandlesShowing = response.imageHandlesShowing;
                            var imageUrl = response.imageUrl;
                            var kmlUrl = response.kmlUrl;
                            var showingSaves = false;
							var googleDriveId = /(\/d\/)([^\/]+)(?=\/)|(id\=)([^\/]+)(?=\/|)/i;
                            for (var i = 0; i < bg.overlayData.savedImages.length; i++) {
                                $('#images-saved').append(new Option(bg.overlayData.savedImages[i].name));
                            }
                            $("#loading").hide();
                            $("#container").show();
                            $("#imageUrl").on("click", function () {
                                $(this).select();
                            });
                            $("#kmlUrl").on("click", function () {
                                $(this).select();
                            });

                            function showCorrectControls(type) {
                                switch (type) {
                                    case 'Circle':
                                        $('#circle-options').show();
                                        $('#image-options').hide();
                                        $('#kml-options').hide();
                                        break;
                                    case 'Image':
                                        $('#circle-options').hide();
                                        $('#image-options').show();
                                        $('#kml-options').hide();
                                        break;
                                    case 'KML':
                                        $('#circle-options').hide();
                                        $('#image-options').hide();
                                        $('#kml-options').show();
                                        break;
                                }
                            }
							if (!bg.overlayData.hideTranslateMessage) {
								if (bg.supportedLanguages.indexOf(chrome.i18n.getUILanguage()) < 0) {
									$('#translateHelp').show();
								}	
							}
							$("#closeTranslate").button({icons: {primary: "ui-icon-close"}, text: false})
								.click(function (event) {
								event.preventDefault();
								$("#translateHelp").hide();
								bg.overlayData.hideTranslateMessage = true;
								bg.overlayData.saveData();
							});
							$("#overlay-type").buttonset();
							$("#" + overlayType).prop('checked', true).button('refresh');
							$("#Circle").button().click(function (event) {
                                event.preventDefault();
								overlayType = 'Circle';
								showCorrectControls(overlayType);
								if (showingSaves) {
									$("#showSaves").click();
								}							
							});
							$("#Image").button().click(function (event) {
                                event.preventDefault();
								overlayType = 'Image';
								showCorrectControls(overlayType);
								if (showingSaves) {
									$("#showSaves").click();
								}							
							});
							$("#KML").button().click(function (event) {
                                event.preventDefault();
								overlayType = 'KML';
								showCorrectControls(overlayType);
								if (showingSaves) {
									$("#showSaves").click();
								}							
							});
                            showCorrectControls(overlayType);
                            $("#imageUrl").val(imageUrl);
                            $("#kmlUrl").val(kmlUrl);
                            $("#circleOpacity").slider({
                                max: 100,
                                min: 10,
                                value: (bg.overlayData.circleOpacity * 100),
                                disabled: !showingCircle,
                                slide: function (event, ui) {
                                    bg.overlayData.circleOpacity = ui.value / 100;
                                    chrome.tabs.sendMessage(tabs[0].id, {
                                        action: 'changeCircleOpacity',
                                        newValue: ui.value / 100
                                    }, function (response) {});
                                }
                            });
                            $("#imageOpacity").slider({
                                max: 100,
                                min: 10,
                                value: (bg.overlayData.imageOpacity * 100),
                                disabled: !showingImage,
                                slide: function (event, ui) {
                                    bg.overlayData.imageOpacity = ui.value / 100;
                                    chrome.tabs.sendMessage(tabs[0].id, {
                                        action: 'changeImageOpacity',
                                        newValue: ui.value / 100
                                    }, function (response) {});
                                }
                            });
                            $("#circle-width").slider({
                                max: 15,
                                min: 1,
                                value: bg.overlayData.circleWidth,
                                disabled: !showingCircle,
                                slide: function (event, ui) {
                                    bg.overlayData.circleWidth = ui.value;
                                    chrome.tabs.sendMessage(tabs[0].id, {
                                        action: 'changeCircleWidth',
                                        newValue: ui.value
                                    }, function (response) {});
                                }
                            });
                            document.getElementById('circle-color').disabled = !showingCircle;
                            $("#circle-color").button().val(bg.overlayData.circleColor).on('input', function () {
                                bg.overlayData.circleColor = $(this).val();
                                chrome.tabs.sendMessage(tabs[0].id, {
                                    action: 'changeCircleColor',
                                    newValue: bg.overlayData.circleColor
                                }, function (response) {});
                            });

                            $("#resetCircle").button({
                                disabled: !showingCircle
                            })
                                .click(function (event) {
                                event.preventDefault();

                                chrome.tabs.sendMessage(tabs[0].id, {
                                    action: 'resetCirclePosition'
                                }, function (response) {});
                            });
                            $("#resetImage").button({
                                disabled: !showingImage
                            })
                                .click(function (event) {
                                event.preventDefault();

                                chrome.tabs.sendMessage(tabs[0].id, {
                                    action: 'resetImagePosition'
                                }, function (response) {});
                                $("#rotation").slider("value", 0);
                            });
                            $("#circleToggleHandles").button({
                                disabled: !showingCircle,
                                label: (circleHandlesShowing) ? chrome.i18n.getMessage("hideHandles") : chrome.i18n.getMessage("showHandles")
                            })
                                .click(function (event) {
                                event.preventDefault();
                                circleHandlesShowing = !circleHandlesShowing;
                                $("#circleToggleHandles").button("option", "label", (circleHandlesShowing) ? chrome.i18n.getMessage("hideHandles") : chrome.i18n.getMessage("showHandles"));
                                chrome.tabs.sendMessage(tabs[0].id, {
                                    action: 'circleToggleHandles'
                                }, function (response) {});
                            });
                            $("#imageToggleHandles").button({
                                disabled: !showingImage,
                                label: (imageHandlesShowing) ? chrome.i18n.getMessage("hideHandles") : chrome.i18n.getMessage("showHandles")
                            })
                                .click(function (event) {
                                event.preventDefault();
                                imageHandlesShowing = !imageHandlesShowing;
                                $("#imageToggleHandles").button("option", "label", (imageHandlesShowing) ? chrome.i18n.getMessage("hideHandles") : chrome.i18n.getMessage("showHandles"));
                                chrome.tabs.sendMessage(tabs[0].id, {
                                    action: 'imageToggleHandles'
                                }, function (response) {});
                            });
                            $("#rotation").slider({
                                max: 720,
                                min: -720,
                                value: currentRotation,
                                disabled: !showingImage,
                                slide: function (event, ui) {
                                    chrome.tabs.sendMessage(tabs[0].id, {
                                        action: 'changeRotation',
                                        newValue: ui.value
                                    }, function (response) {});
                                }
                            });
                            $("#imageUrl").keyup(function (event) {
                                if (event.keyCode == 13) {
                                    if ($('#setImage').is(':disabled')) {
                                        $("#toggleImage").click();
                                    } else {
                                        $("#setImage").click();
                                    }
                                }
                            });
                            $("#kmlUrl").keyup(function (event) {
                                if (event.keyCode == 13) {
                                    if ($('#setKml').is(':disabled')) {
                                        $("#toggleKml").click();
                                    } else {
                                        $("#setKml").click();
                                    }
                                }
                            });
							function parseGoogleDriveLink() {
								if ($("#imageUrl").val().search("drive.google")) {
									var result = googleDriveId.exec($("#imageUrl").val());
									if (result != undefined) {
										if (result[2] != undefined) {
											$("#imageUrl").val("https://drive.google.com/uc?export=download&id=" + result[2]);
										} else {
											$("#imageUrl").val("https://drive.google.com/uc?export=download&id=" + result[4]);
										}
									}
								}
							}
							function parseKmlGoogleDriveLink() {
								if ($("#kmlUrl").val().search("drive.google")) {
									var result = googleDriveId.exec($("#kmlUrl").val());
									if (result != undefined) {
										if (result[2] != undefined) {
											$("#kmlUrl").val("https://drive.google.com/uc?export=download&id=" + result[2]);
										} else {
											$("#kmlUrl").val("https://drive.google.com/uc?export=download&id=" + result[4]);
										}
									}
								}
							}
                            $("#setImage").button({
                                disabled: !showingImage
                            })
                                .click(function (event) {
                                event.preventDefault();
								parseGoogleDriveLink();
                                chrome.tabs.sendMessage(tabs[0].id, {
                                    action: 'setImage',
                                    imageUrl: $("#imageUrl").val()
                                }, function (response) {});
                            });
                            $("#setKml").button({
                                disabled: !showingKml
                            })
                                .click(function (event) {
                                event.preventDefault();
								parseKmlGoogleDriveLink();
                                chrome.tabs.sendMessage(tabs[0].id, {
                                    action: 'setKml',
                                    newUrl: $("#kmlUrl").val()
                                }, function (response) {});
                            });
                            $("#btnLoad").button({
                                disabled: true
                            })
                                .click(function (event) {
                                event.preventDefault();
                                savedImage = bg.overlayData.getSavedImage($('#images-saved').find(":selected").val());
                                $("#imageUrl").val(savedImage.imageUrl);
								$("#rotation").slider("option", "value", savedImage.rotation);
								$("#imageOpacity").slider("option", "value", savedImage.opacity * 100);
								bg.overlayData.imageOpacity = savedImage.opacity;
								setImageShowing(true);
								var values = {};
								for(var k in savedImage) values[k]=savedImage[k];
								values['action'] = 'setImage';
								chrome.tabs.sendMessage(tabs[0].id, values, function (response) {});
                            });
                            $("#btnDelete").button({
                                disabled: true
                            })
                                .click(function (event) {
                                event.preventDefault();
                                $("#confirmDeleteDialog").dialog("open");
                            });
                            $("#saveDialog").dialog({
                                autoOpen: false,
                                resizable: false,
                                modal: true,
                                closeText: chrome.i18n.getMessage("cancelButton")
                            });
                            $("#confirmDeleteDialog").dialog({
                                autoOpen: false,
                                resizable: false,
                                modal: true,
                                closeText: chrome.i18n.getMessage("cancelButton")
                            });
                             $("#confirmOverwriteDialog").dialog({
                                autoOpen: false,
                                resizable: false,
                                modal: true,
                                closeText: chrome.i18n.getMessage("cancelButton")
                            });
                            $('#images-saved').on('change', function () {
                                $("#btnLoad").button("option", "disabled", false);
                                $("#btnDelete").button("option", "disabled", false);
                            });
                            $('#images-saved').dblclick(function () {
                                $("#btnLoad").click();
                            });
							function doSave() {
                                chrome.tabs.sendMessage(tabs[0].id, {
                                    action: 'getSaveInfo',
                                    saveAs: $("#txtSaveAs").val().trim()
                                }, function (response) {});
							}
                            $("#btnSave").button()
                                .click(function (event) {
                                event.preventDefault();
                                $("#saveDialog").dialog("close");
								if (bg.overlayData.hasSavedImageName($("#txtSaveAs").val().trim())) {
									$("#confirmOverwriteDialog").dialog("open");
								} else {
									doSave();
								}
                            });
                            $("#btnCancel").button()
                                .click(function (event) {
                                event.preventDefault();
                                $("#saveDialog").dialog("close");
                            });
                            $("#btnYes").button()
                                .click(function (event) {
                                event.preventDefault();
                                $("#confirmDeleteDialog").dialog("close");
                                bg.overlayData.removeSavedImage($('#images-saved').find(":selected").val());
                                $('#images-saved').find(":selected").remove();
                                $("#btnLoad").button("option", "disabled", true);
                                $("#btnDelete").button("option", "disabled", true);
                            });
                            $("#btnNo").button()
                                .click(function (event) {
                                event.preventDefault();
                                $("#confirmDeleteDialog").dialog("close");
                            });
                            $("#btnYesOverwrite").button()
                                .click(function (event) {
                                event.preventDefault();
                                $("#confirmOverwriteDialog").dialog("close");
								doSave();

                            });
                            $("#btnNoOverwrite").button()
                                .click(function (event) {
                                event.preventDefault();
                                $("#confirmOverwriteDialog").dialog("close");
                            });
                            $("#txtSaveAs").keyup(function (event) {
                                if (event.keyCode == 13) {
                                    $("#btnSave").click();
                                } else {
                                    $("#btnSave").button("option", "disabled", $("#txtSaveAs").val().trim() == "");
                                }
                            });
                            $("#save-image").button({
                                disabled: !showingImage
                            })
                                .click(function (event) {
                                event.preventDefault();
								chrome.tabs.sendMessage(tabs[0].id, {
								action: 'getCurrentImageUrl'}, function (response) {
									$("#txtSaveAs").val(response.imageUrl.split('/').pop());
									$("#btnSave").button("option", "disabled", $("#txtSaveAs").val().trim() == "");
									$("#saveDialog").dialog("open");
								});
                            });
                            $("#showSaves").button()
                                .click(function (event) {
                                event.preventDefault();
                                showingSaves = !showingSaves;
                                if (showingSaves) {
                                    $("#container").css('padding-right', '250px');
                                    $("#saved-images").show();
                                } else {
                                    $("#container").css('padding-right', '');
                                    $("#saved-images").hide();
                                }
                            });
                            $("#toggleCircle").button({
                                label: (showingCircle) ? chrome.i18n.getMessage("hideOverlay") : chrome.i18n.getMessage("showOverlay")
                            })
                                .click(function (event) {
                                event.preventDefault();
                                showingCircle = !showingCircle;
                                $("#toggleCircle").button("option", "label", (showingCircle) ? chrome.i18n.getMessage("hideOverlay") : chrome.i18n.getMessage("showOverlay"));
                                $("#resetCircle").button("option", "disabled", !showingCircle);
                                $("#circleOpacity").slider("option", "disabled", !showingCircle);
                                $("#circle-width").slider("option", "disabled", !showingCircle);
                                $("#circle-color").button("option", "disabled", !showingCircle);
                                $("#circleToggleHandles").button("option", "disabled", !showingCircle);

                                chrome.tabs.sendMessage(tabs[0].id, {
                                    action: 'toggleCircleVisibility',
                                    opacity: bg.overlayData.circleOpacity,
                                    circleWidth: bg.overlayData.circleWidth,
                                    circleColor: bg.overlayData.circleColor
                                }, function (response) {});
                            });
							function setImageShowing(isShowing) {
								showingImage = isShowing;
                                $("#toggleImage").button("option", "label", (showingImage) ? chrome.i18n.getMessage("hideOverlay") : chrome.i18n.getMessage("showOverlay"));
                                $("#resetImage").button("option", "disabled", !showingImage);
                                $("#imageOpacity").slider("option", "disabled", !showingImage);
                                $("#rotation").slider("option", "disabled", !showingImage);
                                $("#setImage").button("option", "disabled", !showingImage);
                                $("#imageToggleHandles").button("option", "disabled", !showingImage);
                                $('#save-image').button("option", "disabled", !showingImage);
							}
                            $("#toggleImage").button({
                                label: (showingImage) ? chrome.i18n.getMessage("hideOverlay") : chrome.i18n.getMessage("showOverlay")
                            })
                                .click(function (event) {
                                event.preventDefault();
								setImageShowing(!showingImage);

								parseGoogleDriveLink();

                                chrome.tabs.sendMessage(tabs[0].id, {
                                    action: 'toggleImageVisibility',
                                    opacity: bg.overlayData.imageOpacity,
                                    imageUrl: $("#imageUrl").val()
                                }, function (response) {});
                            });
                            $("#toggleKml").button({
                                label: (showingKml) ? chrome.i18n.getMessage("hideOverlay") : chrome.i18n.getMessage("showOverlay")
                            })
                                .click(function (event) {
                                event.preventDefault();
                                showingKml = !showingKml;
                                $("#toggleKml").button("option", "label", (showingKml) ? chrome.i18n.getMessage("hideOverlay") : chrome.i18n.getMessage("showOverlay"));
                                $("#setKml").button("option", "disabled", !showingKml);

								parseKmlGoogleDriveLink();

                                chrome.tabs.sendMessage(tabs[0].id, {
                                    action: 'toggleKmlVisibility',
                                    kmlUrl: $("#kmlUrl").val()
                                }, function (response) {});
                            });

                            window.addEventListener('unload', function () {
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

function (request, sender, sendResponse) {
    if (request.action === 'displayKmlStatusMessage') {
        if (request.status == 'OK') {
            $('label[for="kmlError"]').css('display', 'none');
        } else {
            $('label[for="kmlError"]').text(chrome.i18n.getMessage(request.status));
            $('label[for="kmlError"]').css('display', 'block');
        }
    } else if (request.action === 'sendSaveInfo') {
		if (!background.overlayData.hasSavedImageName(request.saveAs)) {
			$('#images-saved').append(new Option(request.saveAs));
		}
        background.overlayData.addSavedImage({
            name: request.saveAs,
            neLat: request.neLat,
            neLng: request.neLng,
            swLat: request.swLat,
            swLng: request.swLng,
            imageUrl: request.imageUrl,
            opacity: request.opacity,
            rotation: request.rotation
        });
    }
});