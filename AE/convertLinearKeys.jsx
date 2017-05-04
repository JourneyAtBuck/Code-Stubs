(function convertLinearKeys() {
    function convertPropLinKeys(propertyInput){
        if(propertyInput instanceof Property && propertyInput.canSetExpression){
            var totalKeys, prop, count;
            totalKeys = propertyInput.numKeys;
            influenceVal = .1;
            //If the property has at least 1 keyframe, proceed
            if(totalKeys > 0){
                //Loop through keys
                for(var i = 1; i <= totalKeys; i++){
                    var newInEase = [];
                    var newOutEase = [];
                    //Get the key in and out interpolation types
                    inInterp = propertyInput.keyInInterpolationType(i);
                    outInterp = propertyInput.keyOutInterpolationType(i);
                    inEase = propertyInput.keyInTemporalEase(i);
                    outEase = propertyInput.keyOutTemporalEase(i);
                    
                    for (var v = 0; v < inEase.length; v++) {
                        newInEaseObj = new KeyframeEase (speed = inEase[v].speed, influence = influenceVal);
                        newOutEaseObj = new KeyframeEase (speed = outEase[v].speed, influence = influenceVal);
                        
                        newInEase.push(newInEaseObj);
                        newOutEase.push(newOutEaseObj);
                    }
                
                    if (inInterp == KeyframeInterpolationType.LINEAR || outInterp == KeyframeInterpolationType.LINEAR) {
                        count++;
                    }
                    if (inInterp == KeyframeInterpolationType.LINEAR) {
                        propertyInput.setInterpolationTypeAtKey(i,KeyframeInterpolationType.BEZIER,outInterp);
                        propertyInput.setTemporalEaseAtKey(i, newInEase, outEase);
                        inEase = propertyInput.keyInTemporalEase(i);
                        inInterp = propertyInput.keyInInterpolationType(i);
                    }
                    if (outInterp == KeyframeInterpolationType.LINEAR) {
                        propertyInput.setInterpolationTypeAtKey(i,inInterp,KeyframeInterpolationType.BEZIER);
                        propertyInput.setTemporalEaseAtKey(i, inEase, newOutEase);
                    }
                //if (count) $.writeln(propertyInput.propertyGroup(1).name+" had "+count+" linear keyframes on property, "+ propertyInput.name+".");
                }
            }
        }
    }
    function convertLyrLinKeys(lyr) {
        function recurse (obj) {
            for  (var p = 1; p <= obj.numProperties; p++) {
                var inProp = obj.property(p);
                convertPropLinKeys(inProp);
                if (inProp.numProperties>0) recurse (inProp);
            }
        }
        recurse(lyr);
    }
    var comp = app.project.activeItem;
    if (comp != null && comp instanceof CompItem) {
            app.beginUndoGroup("Convert linear keyframes to bezier."); //begins undo group
            var numLyrs = comp.numLayers;
            for (var i = 1; i <= numLyrs; i++) {
                convertLyrLinKeys(comp.layer(i));
            }
            app.endUndoGroup();
            //return alert("Nulls created.");
    } else return alert("Make sure your comp window or timeline is active before running this script.");
    
})(this);
