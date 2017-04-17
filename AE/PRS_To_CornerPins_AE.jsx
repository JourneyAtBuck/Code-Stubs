function psrToCornerpin() {
    var proj = app.project;
    var comp = proj.activeItem;
    if (!comp) {
        return alert("Please make sure your comp is active.");
    }
    var selectedLayers = comp.selectedLayers;
    var compCenter = [comp.width*.5,comp.height*.5,0];

    app.beginUndoGroup("PSR to CornerPin");
    for (var i=0; i<selectedLayers.length; i++) selectedLayers[i].selected = false;
    for (var i=0; i<selectedLayers.length; i++) {
        convertToCorner(selectedLayers[i]);
    }
    app.endUndoGroup();

    function convertToCorner(targetLayer) {
        //make nulls at targetLayer's corners via expression
        ULNull = comp.layers.addNull();
        ULNull.transform.position.expression = "thisComp.layer('" + targetLayer.name + "').toComp([0,0])";
        URNull = comp.layers.addNull();
        URNull.transform.position.expression = "L = thisComp.layer('" + targetLayer.name + "');L.toComp([L.width,0])";
        LLNull = comp.layers.addNull();
        LLNull.transform.position.expression = "L = thisComp.layer('" + targetLayer.name + "');L.toComp([0,L.height])";
        LRNull = comp.layers.addNull();
        LRNull.transform.position.expression = "L = thisComp.layer('" + targetLayer.name + "');L.toComp([L.width,L.height])";
        
        //add corner pin and expressionify
        cornerPinEffect = targetLayer.Effects.addProperty("Corner Pin");
        var cpOffset = "[" + compCenter.toString() + "] + [(thisLayer.width*.5), (thisLayer.height*.5),0]";
        cornerPinEffect.upperLeft.expression = "(thisComp.layer('" + ULNull.name + "').toComp([0,0,0])) - "+cpOffset;
        cornerPinEffect.upperRight.expression = "(thisComp.layer('" + URNull.name + "').toComp([0,0,0])) - "+cpOffset;
        cornerPinEffect.lowerLeft.expression = "(thisComp.layer('" + LLNull.name + "').toComp([0,0,0])) - "+cpOffset;
        cornerPinEffect.lowerRight.expression = "(thisComp.layer('" + LRNull.name + "').toComp([0,0,0])) - "+cpOffset;
 
        //bake Nulls
        bakeExpression(cornerPinEffect, targetLayer);
        
        //un-parent targetLayer
        targetLayer.parent = null;
        
        //zero things out
        keyframeKillah(targetLayer.transform.position);
        if (targetLayer.threeDLayer) {
            keyframeKillah(targetLayer.property("ADBE Transform Group").property("ADBE Rotate X"));
            keyframeKillah(targetLayer.property("ADBE Transform Group").property("ADBE Rotate Y"));
        } 
        keyframeKillah(targetLayer.property("ADBE Transform Group").property("ADBE Rotate Z"));
        keyframeKillah(targetLayer.transform.scale);
        targetLayer.property("position").setValue(compCenter);
        targetLayer.property("rotation").setValue(0);
        targetLayer.property("scale").setValue([100,100]);
        
        //Delete Nulls
        ULNull.remove();
        URNull.remove();
        LLNull.remove();
        LRNull.remove();
    }

    function bakeExpression(cornerPinEffect, targetLayer) {
        targetLayer.selected = true;
        for (p = 0; p<cornerPinEffect.numProperties - 1; p++)  {
            cornerPinEffect.property(p+1).selected = true;
        }
        app.executeCommand(app.findMenuCommandId("Convert Expression to Keyframes"));
            
        targetLayer.selected = false;
    }

    function keyframeKillah(targetParam) {
        while (targetParam.numKeys != 0) { // While there are still Keyframes, cycle through them
            targetParam.removeKey(1); // Delete the first Keyframe
        }
    }
}
psrToCornerpin();