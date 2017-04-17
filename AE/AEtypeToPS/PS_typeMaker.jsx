#target photoshop

// this script doesn't take into account rotation

function PS_typeMaker() {
     try{
    //minified json2.js
    $.evalFile($.getenv("BUCK_VENDOR_ROOT")+"/AE/lib/json2.js");
    
    //var dlgMain = new Window("dialog", "Test Dialog");

    // match our dialog background color to the host application
    //var brush = dlgMain.graphics.newBrush(dlgMain.graphics.BrushType.THEME_COLOR, "appDialogBackground");
    var oldRulerPrefs = app.preferences.rulerUnits;
    var oldTypePrefs = app.preferences.typeUnits;
    app.preferences.rulerUnits = Units.PIXELS;
    app.preferences.typeUnits = TypeUnits.PIXELS
    var doc = app.activeDocument;

    if (app.documents.length > 0) {

        var docPath = doc.fullName.toString();
        var defFile = new File(docPath.substring(0,docPath.lastIndexOf("."))+".json");
        var objFile = defFile.openDlg("Choose text JSON...", "JSON:*.json;");
        if (objFile != null && objFile.open("r")){
            objFile.encoding = "UTF-8";
            var myJSON = objFile.read();
            var obj = JSON.parse(myJSON);
            objFile.close();
        } else {
            return;
        };
        
        for (key in obj){
            var aeLyr = obj[key];
            
            try{
                var parentPath = eval(aeLyr.parentPath);
                var srcLyr = parentPath.artLayers.getByName(aeLyr.layerName);
            } catch (e) {
                continue;
            }
                    
            var lyr = parentPath.artLayers.add(); 
            
            var textColor = new SolidColor();
            textColor.rgb.red = aeLyr.fillColor[0]*255;
            textColor.rgb.green = aeLyr.fillColor[1]*255;
            textColor.rgb.blue = aeLyr.fillColor[2]*255;
            
            lyr.name = aeLyr.layerName  ;
               
            lyr.blendMode = BlendMode.NORMAL  ;
            lyr.kind = LayerKind.TEXT  ;
            
            lyrTxt = parentPath.artLayers[lyr.name].textItem;
            lyrTxt.contents = aeLyr.text;

            lyrTxt.font = aeLyr.font;
            lyrTxt.size = aeLyr.fontSize;
            lyrTxt.color = textColor;
            lyrTxt.kind = eval("TextType."+aeLyr.kind);
            if (lyrTxt.kind == TextType.PARAGRAPHTEXT) { // is the text in a textbox?
                lyrTxt.width = aeLyr.boxTextSize[0];
                lyrTxt.height = aeLyr.boxTextSize[1];
            }

            lyrTxt.justification = eval("Justification."+aeLyr.justification);
            lyrTxt.tracking = aeLyr.tracking;
            
            if (aeLyr.baselineLocs[5] && aeLyr.baselineLocs[5]<5000){ //is there more than one line? also, does the second line have a valid baseline value?
                lyrTxt.useAutoLeading = false;
                lyrTxt.leading = aeLyr.baselineLocs[5]-aeLyr.baselineLocs[1];
            } else {
                lyrTxt.useAutoLeading = true;
            }
            
            //multiply layer scale times parent offset
            var tempScale = [];
            for (s = 0; s<2; s++) {tempScale[s] = aeLyr.layerScale[s]*aeLyr.parentScaleOffset[s]*.01}
            lyr.resize(tempScale[0],tempScale[1],AnchorPosition.TOPLEFT);
            
            lyrTxt.position = [0,0];
            var pixelOffset = -.25; // apparently AE and PS don't see bounds the same, so here's an offset you can change manually... maybe it's okay at -.25??
            lyr.translate(-lyr.bounds[0].value+pixelOffset+aeLyr.layerPosition[0],-lyr.bounds[1].value+pixelOffset+aeLyr.layerPosition[1]);
            
            lyr.rotate(aeLyr.rotation+aeLyr.parentRotationOffset,AnchorPosition.TOPLEFT);

            srcLyr.remove(); // deletes the old photoshop layer

        };
    }
    app.preferences.rulerUnits = oldRulerPrefs;
    app.preferences.typeUnits = oldTypePrefs;
    } catch (err) {
            alert(err.line+"\r"+err.toString());
        }
    
}
(app.documents.length > 0)? app.activeDocument.suspendHistory("Create text from JSON","PS_typeMaker()"):alert("Please run this script with a Photoshop file open.");
