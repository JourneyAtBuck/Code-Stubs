(function () {
    var textProp = app.project.activeItem.selectedLayers[0]("ADBE Text Properties")("ADBE Text Document");
    var textDoc = textProp.value;
    textDoc.boxTextSize = [831.603576660156,89.8304748535156];
    textProp.setValue(textDoc);
})()