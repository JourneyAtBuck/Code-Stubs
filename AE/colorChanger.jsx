#target aftereffects
(function () {
    #include "./lib/aequery.js"
    var oldColor = [0,0,0,1];
    var newColor = [1,1,1,1];
    
    var oldColorString = oldColor.join("_");
    var newColorString = newColor.join("_");
    aeq.forEachProp(aeq.getActiveComp(), function(prop) {
        if (prop.matchName == "ADBE Vector Fill Color" || prop.matchName == "ADBE Vector Stroke Color")
            var valueString = prop.value.join("_");
        if (valueString == oldColorString) {
            prop.setValue(newColor);
        }
    })
})()