(function quickTaper(){
    var taperAmount = 50; // change this value if you want the start/end taper amounts to be lower or higher!
    var comp = app.project.activeItem;
    var layers = comp.layers;
    for (var i = 1; i < layers.length; i++) {
        var layer = layers[i];
        var layerProps = listProps(layer);
        for (var p = 0; p < layerProps.length; p++) {
            var prop = layerProps[p];
            if (prop.matchName === "ADBE Vector Taper Start Length" || prop.matchName === "ADBE Vector Taper End Length") {
                prop.setValue(taperAmount);
            }
        }
    }
})()

 // function returns string path of all properties of a layer, "lyr"
 function listProps (lyr) {
    res = [];
    propDepth = 0;
    (function recurse (obj) {
        for  (var p = 1; p <= obj.numProperties; p++) {
            var inProp = obj.property(p);
            res.push(inProp);
            if (inProp.numProperties>0) {
                recurse (inProp);
            }
        }
    })(lyr);
    return res ;
}