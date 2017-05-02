// generates 2D LUT using sampleImage() expression.

(function () {
// function requires float, returns value from 0-255
    function toDec (n) {return Math.round(n*255)}

    // function requires function toDec(), returns [RGB] with int values from 0-255
    function clr(c) {
        return [toDec(c[0]),toDec(c[1]),toDec(c[2])];
    }
        // function requires a string (property name) or integer (property index), "n", and a layer object, "lyr", returns a layer effect property object
    function eff(n, lyr) {
        return lyr.property("ADBE Effect Parade")(n);
    }
        // function layer with color effects, returns ColorMap according to schema
    function LUTtoObj(lyr) {
        var res = {};
        res.type = "MAP";
        res.red = [];
        res.green = [];
        res.blue = [];
        var lutSize = 256;  
        var count = 0;
        var fxIndex = 1;
        var clrVal;
        
        var lyrFx = lyr.property("ADBE Effect Parade");
        
        //check for gradient effect
        var grad = lyrFx("DGE Gradient");
        if (grad) {
            fxIndex = grad.propertyIndex+1;
            grad = null;
        }
        
        
        // create effects
        var clrFxName = lyrFx.addProperty("ADBE Color Control").name; // adds color control

        var rampFxName = lyrFx.addProperty("ADBE Ramp").name // adds ramp

        var ellFxName = lyrFx.addProperty("ADBE ELLIPSE").name; //adds ellipse

        lyrFx(rampFxName).moveTo(fxIndex);
        lyrFx(ellFxName).moveTo(fxIndex);
        
        // effect objects        
        var clrFx = lyrFx(clrFxName);
        var rampFx = lyrFx(rampFxName);
        var ellFx = lyrFx(ellFxName);
        
        // set effect property values
        rampFx("ADBE Ramp-0001").setValue([0,0]); //start point
        rampFx("ADBE Ramp-0003").setValue([255,0]); //end point
        
        ellFx("ADBE ELLIPSE-0001").setValue([128,0]); // center point
        ellFx("ADBE ELLIPSE-0002").setValue(256); //width
        ellFx("ADBE ELLIPSE-0003").setValue(1); //height
        ellFx("ADBE ELLIPSE-0004").setValue(8); //thickness
        ellFx("ADBE ELLIPSE-0005").setValue(0); //softness
        
        var clrProp = clrFx(1);
        
        while(count<lutSize) {
            clrProp.expression = "sampleImage(["+count+",0], radius = [.5, .5], postEffect = true, t = inPoint)";
            clrVal = clr(clrProp.valueAtTime(lyr.inPoint, false));
            
            res.red.push(clrVal[0]) ;
            res.green.push(clrVal[1]) ;
            res.blue.push(clrVal[2]) ;
            count++;
            
        }
        
        // removes temporary effects
        lyrFx(clrFxName).remove();
        lyrFx(rampFxName).remove();
        lyrFx(ellFxName).remove();
        
        return res;
    }
    var proj = app.project;
    var lyr = proj.activeItem.selectedLayers[0];

    app.beginUndoGroup("LUT to OBJ"); //begins undo group
    var lutObj = LUTtoObj(lyr);

    var objString = JSON.stringify(lutObj, undefined, 2);

    var thisFile = proj.file.fsName.substring(0,proj.file.fsName.lastIndexOf("."));
    var textFile = new File(thisFile+"_LUT.json");
    var objFile = textFile.saveDlg ("Save text as JSON...", "JSON:*.json;");
    if (!objFile) {
        alert("JSON export canceled.");
    } 

    //write JSON file

    if (objFile.open("w")) {
        // write layers json
        objFile.encoding = "UTF-8";
        objFile.write(objString);
        objFile.close();
    }
    app.endUndoGroup(); //ends undo group
})();