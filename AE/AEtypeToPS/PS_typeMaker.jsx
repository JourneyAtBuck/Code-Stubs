#target photoshop

// this script doesn't take into account rotation
if (typeof JSON !== "object") {
    JSON = {};
}
(function(){"use strict";var rx_one=/^[\],:{}\s]*$/,rx_two=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,rx_three=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,rx_four=/(?:^|:|,)(?:\s*\[)+/g,rx_escapable=/[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,rx_dangerous=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta,rep;function f(t){return t<10?"0"+t:t}function this_value(){return this.valueOf()}function quote(t){return rx_escapable.lastIndex=0,rx_escapable.test(t)?'"'+t.replace(rx_escapable,function(t){var e=meta[t];return"string"==typeof e?e:"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+t+'"'}function str(t,e){var r,n,o,u,f,a=gap,i=e[t];switch(i&&"object"==typeof i&&"function"==typeof i.toJSON&&(i=i.toJSON(t)),"function"==typeof rep&&(i=rep.call(e,t,i)),typeof i){case"string":return quote(i);case"number":return isFinite(i)?String(i):"null";case"boolean":case"null":return String(i);case"object":if(!i)return"null";if(gap+=indent,f=[],"[object Array]"===Object.prototype.toString.apply(i)){for(u=i.length,r=0;r<u;r+=1)f[r]=str(r,i)||"null";return o=0===f.length?"[]":gap?"[\n"+gap+f.join(",\n"+gap)+"\n"+a+"]":"["+f.join(",")+"]",gap=a,o}if(rep&&"object"==typeof rep)for(u=rep.length,r=0;r<u;r+=1)"string"==typeof rep[r]&&(o=str(n=rep[r],i))&&f.push(quote(n)+(gap?": ":":")+o);else for(n in i)Object.prototype.hasOwnProperty.call(i,n)&&(o=str(n,i))&&f.push(quote(n)+(gap?": ":":")+o);return o=0===f.length?"{}":gap?"{\n"+gap+f.join(",\n"+gap)+"\n"+a+"}":"{"+f.join(",")+"}",gap=a,o}}"function"!=typeof Date.prototype.toJSON&&(Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null},Boolean.prototype.toJSON=this_value,Number.prototype.toJSON=this_value,String.prototype.toJSON=this_value),"function"!=typeof JSON.stringify&&(meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},JSON.stringify=function(t,e,r){var n;if(gap="",indent="","number"==typeof r)for(n=0;n<r;n+=1)indent+=" ";else"string"==typeof r&&(indent=r);if(rep=e,e&&"function"!=typeof e&&("object"!=typeof e||"number"!=typeof e.length))throw new Error("JSON.stringify");return str("",{"":t})}),"function"!=typeof JSON.parse&&(JSON.parse=function(text,reviver){var j;function walk(t,e){var r,n,o=t[e];if(o&&"object"==typeof o)for(r in o)Object.prototype.hasOwnProperty.call(o,r)&&(void 0!==(n=walk(o,r))?o[r]=n:delete o[r]);return reviver.call(t,e,o)}if(text=String(text),rx_dangerous.lastIndex=0,rx_dangerous.test(text)&&(text=text.replace(rx_dangerous,function(t){return"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)})),rx_one.test(text.replace(rx_two,"@").replace(rx_three,"]").replace(rx_four,"")))return j=eval("("+text+")"),"function"==typeof reviver?walk({"":j},""):j;throw new SyntaxError("JSON.parse")})})();

function PS_typeMaker() {
     try{
    //minified json2.js
    
    
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
                // var srcLyr = parentPath.artLayers.getByName(aeLyr.layerName);
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

            // srcLyr.remove(); // deletes the old photoshop layer

        };
    }
    app.preferences.rulerUnits = oldRulerPrefs;
    app.preferences.typeUnits = oldTypePrefs;
    } catch (err) {
            alert(err.line+"\r"+err.toString());
        }
    
}
(app.documents.length > 0)? app.activeDocument.suspendHistory("Create text from JSON","PS_typeMaker()"):alert("Please run this script with a Photoshop file open.");
