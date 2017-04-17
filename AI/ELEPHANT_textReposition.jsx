#target illustrator

 
function MJ_textReposition(thisObj) {
   try{
    var textReposition = {};
    textReposition.doc = app.activeDocument;

    textReposition.textObjs = [];
    textReposition.swappedCounter = 0;
    
    textReposition.targetLayer = textReposition.doc.layers.getByName("gray boxes");
    textReposition.boxes = textReposition.targetLayer.pathItems;
    
    if (textReposition.doc.activeLayer) {
        textReposition.sourceLayer = textReposition.doc.activeLayer;
        //alert("using layer: "+textReposition.sourceLayer.name);
    } else {textReposition.sourceLayer = textReposition.doc.layers.getByName("bases");}
    
    
    
    if (textReposition.sourceLayer.textFrames.length) {
        textReposition.textObjs = textReposition.sourceLayer.textFrames;
    } else { return alert("Please select a layer with text layers.");}
    
    for (var i = 0; i < textReposition.textObjs.length; i++) {
        var t = textReposition.textObjs[i];
        var tb = t.geometricBounds;
        var box;

        for (var f = 0; f < textReposition.boxes.length; f++) {
            box = textReposition.boxes[f];
            var bound = box.geometricBounds;
            if (bound[0]<=tb[0] && bound[1]>=tb[1] && bound[2]>=tb[2] && bound[3]<=tb[3]){
                t.left = box.left;
                t.top = box.top;
                textReposition.swappedCounter++;
                //textReposition.boxes.splice(f,1);
                break;
            }
        }
    }
    return alert("Repositioned "+textReposition.swappedCounter+" text frames.");
    } catch(err) {alert(err.line+"\r"+err.toString())}
}
MJ_textReposition(this);