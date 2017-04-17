#target photoshop

(function () {
    var doc = app.activeDocument;
    var visLayers = ["layer 1", "layer 2", "layer 3"];
    var numVisLayers = 2;
    for (var i = 0 ; i < visLayers.length ; i++) {
        var lyr = doc.artLayers.getByName(visLayers[i]);
        if (i<numVisLayers) lyr.visible = true;
        else lyr.visible = false;
    };
})(this);
