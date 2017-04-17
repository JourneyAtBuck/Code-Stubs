function mj_dupeAndOffset() {
    try{
        var scriptTitle = "Duplicate and Offset";
        var scriptVersion = "1.0";
        //build interface
        win=new Window("palette","mj_dupeAndOffset",[0,0,190,260],{resizeable:true,});
        numDupesGrp=win.add("group",[8,8,208,108],"undefined");
        numDupesTxt=numDupesGrp.add("statictext",[0,3,130,23] ,"Number of duplicates:",{multiline:true});
        numDupesInput=numDupesGrp.add("edittext",[120,0,150,20] ,"0",{readonly:0,noecho:0,borderless:0,multiline:0,enterKeySignalsOnChange:0});
        posOffsetsPanel=win.add("panel",[5,38,180,118]);
        posOffsetTxt=posOffsetsPanel.add("statictext",[5,5,115,25] ,"Position offsets:",{multiline:true});
        maxXposTxt=posOffsetsPanel.add("statictext",[5,23,75,43] ,"Max. X:",{multiline:true});
        maxXposInput=posOffsetsPanel.add("edittext",[50,21,80,41] ,"0",{readonly:0,noecho:0,borderless:0,multiline:0,enterKeySignalsOnChange:0});
        minXposTxt=posOffsetsPanel.add("statictext",[88,23,158,43] ,"Min. X:",{multiline:true});
        minXposInput=posOffsetsPanel.add("edittext",[130,21,160,41] ,"0",{readonly:0,noecho:0,borderless:0,multiline:0,enterKeySignalsOnChange:0});
        maxYposTxt=posOffsetsPanel.add("statictext",[5,45,75,65] ,"Max. Y:",{multiline:true});
        maxYposInput=posOffsetsPanel.add("edittext",[50,44,80,64] ,"0",{readonly:0,noecho:0,borderless:0,multiline:0,enterKeySignalsOnChange:0});
        minYposTxt=posOffsetsPanel.add("statictext",[88,45,158,65] ,"Min. Y:",{multiline:true});
        minYposInput=posOffsetsPanel.add("edittext",[130,44,160,64] ,"0",{readonly:0,noecho:0,borderless:0,multiline:0,enterKeySignalsOnChange:0});
        scaleOffsetsPanel=win.add("panel",[5,123,180,223]);
        scaleOffsetTxt=scaleOffsetsPanel.add("statictext",[5,5,115,25] ,"Scale offsets:",{multiline:true});
        maxXscaleTxt=scaleOffsetsPanel.add("statictext",[5,25,75,45] ,"Max. X:",{multiline:true});
        maxXscaleInput=scaleOffsetsPanel.add("edittext",[50,21,80,41] ,"0",{readonly:0,noecho:0,borderless:0,multiline:0,enterKeySignalsOnChange:0});
        maxYscaleTxt=scaleOffsetsPanel.add("statictext",[5,48,75,68] ,"Max. Y:",{multiline:true});
        maxYscaleInput=scaleOffsetsPanel.add("edittext",[50,44,80,64] ,"0",{readonly:0,noecho:0,borderless:0,multiline:0,enterKeySignalsOnChange:0});
        uniformScaleChk=scaleOffsetsPanel.add("checkbox",[5,75,105,105],"Uniform Scale");
        uniformScaleChk.value=1;
        minXscaleTxt=scaleOffsetsPanel.add("statictext",[88,25,158,45] ,"Min. X:",{multiline:true});
        minYscaleTxt=scaleOffsetsPanel.add("statictext",[88,48,158,68] ,"Min. Y:",{multiline:true});
        minYscaleInput=scaleOffsetsPanel.add("edittext",[130,44,160,64] ,"0",{readonly:0,noecho:0,borderless:0,multiline:0,enterKeySignalsOnChange:0});
        minXscaleInput=scaleOffsetsPanel.add("edittext",[130,21,160,41] ,"0",{readonly:0,noecho:0,borderless:0,multiline:0,enterKeySignalsOnChange:0});
        cancelButton=win.add("button",[15,232,85,252],"Cancel");
        dupeButton=win.add("button",[96,232,166,252],"Duplicate");

        /*dupeButton.onClick = function() {
                                            (maxYscaleInput.active)?maxYscaleInput.active = false:maxYscaleInput.active = true;
                                            (minYscaleInput.active)?minYscaleInput.active = false:minYscaleInput.active = true;
                                        };*/
        cancelButton.onClick = function() {win.close(); return;};
        dupeButton.onClick = function() {duper(numDupesInput.text, maxXposInput.text, minXposInput.text, maxYposInput.text, minYposInput.text, maxXscaleInput.text, minXscaleInput.text, maxYscaleInput.text, minYscaleInput.text, uniformScaleChk.value);};
        win.center();
        win.show();


        //Main action
        
        function duper(numDupes, maxXpos, minXpos, maxYpos, minYpos, maxXscale, minXscale, maxYscale, minYscale, uniScale) {
            try{
                $.writeln(numDupes);
            app.beginUndoGroup("Duplicate and offset"); 
            var proj = app.project;
            app.activeViewer.setActive();
            var comp = proj.activeItem;
            if (!comp) return alert("Please activate your main comp window or timeline and re-run this script.");
            var sel = comp.selectedLayers;
            if (!sel) {alert("Please select a layer before running this script!")};

            for (d = 0; d< numDupes; d++) {
                var newLyr = sel[0].duplicate();
                
                posOffset = [Math.random()*minXpos+Math.random()*maxXpos,Math.random()*minYpos+Math.random()*maxYpos];
                scaleOffset = [Math.random()*minXscale+Math.random()*maxXscale,Math.random()*minYscale+Math.random()*maxYscale];
                if (uniScale) {scaleOffset[1] = scaleOffset[0];};
                if (newLyr.transform.position.numKeys) {
                    for (k = 1; k<=newLyr.transform.position.numKeys; k++) {
                        newLyr.transform.position.setValueAtKey(k, [newLyr.transform.position.keyValue(k)[0]+posOffset[0],newLyr.transform.position.keyValue(k)[1]+posOffset[1]]);
                    }
                } else {
                    newLyr.transform.position.setValue([newLyr.transform.position.value[0]+posOffset[0],newLyr.transform.position.value[1]+posOffset[1]]);
                }
                if (newLyr.transform.scale.numKeys) {
                    for (k = 1; k<=newLyr.transform.scale.numKeys; k++) {
                        newLyr.transform.scale.setValueAtKey(k, [newLyr.transform.scale.keyValue(k)[0]+scaleOffset[0],newLyr.transform.scale.keyValue(k)[1]+scaleOffset[1]]);
                    }
                } else {
                    newLyr.transform.scale.setValue([newLyr.transform.scale.value[0]+scaleOffset[0],newLyr.transform.scale.value[1]+scaleOffset[1]]);
                }

            }
           
            app.endUndoGroup();
            } catch (e) {
                alert(e.line+'\r'+e.toString());    
            }
        }
    } catch (e) {
        alert(e.line+'\r'+e.toString());    
    }
}
mj_dupeAndOffset();