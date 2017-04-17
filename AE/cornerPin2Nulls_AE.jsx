/// this needs to check for keyframes. it doesn't work if it's not keyed

function cornerPin2Nulls_AE() {
    try{
    
        app.beginUndoGroup("Un-cornerpinify Selected Layers");
        var proj = app.project;
        var comp = proj.activeItem;
        var sel = comp.selectedLayers;
        if (!sel.length) alert("Select layers with corner pin effects before running this script.");
        for (var i=0; i<sel.length; i++) {
            var nulls = [];
            var l = sel[i];
            
            if (sel[i].property("ADBE Effect Parade").property("ADBE Corner Pin")) {
                var slider = sel[i].Effects.addProperty("ADBE Slider Control");
                slider.name = "Offset Amount";
                var startIndex = 0;
                if (sel[i].hasTrackMatte) startIndex--;
                var cp = sel[i].property("ADBE Effect Parade").property("ADBE Corner Pin");
                for (p = 1; p<cp.numProperties; p++)  {
                    nulls[p-1]=comp.layers.addNull();
                    nulls[p-1].name = sel[i].name+"_"+cp.property(p).name;
                    nulls[p-1].moveBefore(comp.layer(sel[i].index+startIndex));
                    nulls[p-1].parent = sel[i];
                    nulls[p-1].inPoint = sel[i].inPoint;
                    nulls[p-1].outPoint = sel[i].outPoint;
                    for (k = 1; k<=cp.property(p).numKeys; k++) {
                        var kv = cp.property(p).keyValue(k);
                        var kt = cp.property(p).keyTime(k);
                        nulls[p-1].property("Position").setValueAtTime(kt, kv);
                    }
                    nulls[p-1].parent = sel[i].parent;

                }
                for (c = 1; c<cp.numProperties; c++)  {
cp.property(c).expression = "var numVerts = 4;\r\
var total = [0,0];\r\
var center = [0,0];\r\
var offset = effect('"+slider.name+"')('Slider')*.01;\r\
var thisNull = thisComp.layer(name+'_'+thisProperty.name) ;\r\
var thisPos = fromComp(thisNull.toComp(thisNull.anchorPoint));\r\
for (var v = 1; v<=numVerts; v++) {\r\
    var propNum = ('0' + v).slice(-2);\r\
    var nullLyr = thisComp.layer(name+'_'+this.effect('ADBE Corner Pin')('ADBE Corner Pin-00'+propNum.toString()).name);\r\
    total = add(total, fromComp(nullLyr.toComp(nullLyr.anchorPoint)));\r\
};\r\
center = div(total, numVerts);\r\
add(mul(sub(thisPos, center), 1+offset), center)";
                }
            }
            sel[i].parent = null;
        }
        app.endUndoGroup();
        } catch (e) {
        alert(e.line+"\r"+e.toString());    
    }
}
cornerPin2Nulls_AE();