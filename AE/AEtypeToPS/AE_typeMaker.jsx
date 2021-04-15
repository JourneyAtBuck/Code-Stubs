#target aftereffects

//this script needs offsets for comp rotation, scale, and position
if (typeof JSON !== "object") {
    JSON = {};
}
(function(){"use strict";var rx_one=/^[\],:{}\s]*$/,rx_two=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,rx_three=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,rx_four=/(?:^|:|,)(?:\s*\[)+/g,rx_escapable=/[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,rx_dangerous=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta,rep;function f(t){return t<10?"0"+t:t}function this_value(){return this.valueOf()}function quote(t){return rx_escapable.lastIndex=0,rx_escapable.test(t)?'"'+t.replace(rx_escapable,function(t){var e=meta[t];return"string"==typeof e?e:"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+t+'"'}function str(t,e){var r,n,o,u,f,a=gap,i=e[t];switch(i&&"object"==typeof i&&"function"==typeof i.toJSON&&(i=i.toJSON(t)),"function"==typeof rep&&(i=rep.call(e,t,i)),typeof i){case"string":return quote(i);case"number":return isFinite(i)?String(i):"null";case"boolean":case"null":return String(i);case"object":if(!i)return"null";if(gap+=indent,f=[],"[object Array]"===Object.prototype.toString.apply(i)){for(u=i.length,r=0;r<u;r+=1)f[r]=str(r,i)||"null";return o=0===f.length?"[]":gap?"[\n"+gap+f.join(",\n"+gap)+"\n"+a+"]":"["+f.join(",")+"]",gap=a,o}if(rep&&"object"==typeof rep)for(u=rep.length,r=0;r<u;r+=1)"string"==typeof rep[r]&&(o=str(n=rep[r],i))&&f.push(quote(n)+(gap?": ":":")+o);else for(n in i)Object.prototype.hasOwnProperty.call(i,n)&&(o=str(n,i))&&f.push(quote(n)+(gap?": ":":")+o);return o=0===f.length?"{}":gap?"{\n"+gap+f.join(",\n"+gap)+"\n"+a+"}":"{"+f.join(",")+"}",gap=a,o}}"function"!=typeof Date.prototype.toJSON&&(Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null},Boolean.prototype.toJSON=this_value,Number.prototype.toJSON=this_value,String.prototype.toJSON=this_value),"function"!=typeof JSON.stringify&&(meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},JSON.stringify=function(t,e,r){var n;if(gap="",indent="","number"==typeof r)for(n=0;n<r;n+=1)indent+=" ";else"string"==typeof r&&(indent=r);if(rep=e,e&&"function"!=typeof e&&("object"!=typeof e||"number"!=typeof e.length))throw new Error("JSON.stringify");return str("",{"":t})}),"function"!=typeof JSON.parse&&(JSON.parse=function(text,reviver){var j;function walk(t,e){var r,n,o=t[e];if(o&&"object"==typeof o)for(r in o)Object.prototype.hasOwnProperty.call(o,r)&&(void 0!==(n=walk(o,r))?o[r]=n:delete o[r]);return reviver.call(t,e,o)}if(text=String(text),rx_dangerous.lastIndex=0,rx_dangerous.test(text)&&(text=text.replace(rx_dangerous,function(t){return"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)})),rx_one.test(text.replace(rx_two,"@").replace(rx_three,"]").replace(rx_four,"")))return j=eval("("+text+")"),"function"==typeof reviver?walk({"":j},""):j;throw new SyntaxError("JSON.parse")})})();

function AE_typeMaker() {
    //minified json2.js
   
    try{
    
        app.beginUndoGroup("Export Layered PSD and JSON");
        var proj = app.project;
        var comp = proj.activeItem;
        if (!(comp instanceof CompItem)) return alert("Select a comp or viewer window before running this script.");
        // function that gets justification of text layers
        function textJustVal(textDoc){
                  var val = textDoc.justification;
                  //var Justification = {};
                  if(val == ParagraphJustification.LEFT_JUSTIFY){
                            return "LEFT";
                  }else if(val == ParagraphJustification.RIGHT_JUSTIFY){
                            return "RIGHT";
                  }else if(val == ParagraphJustification.CENTER_JUSTIFY){
                            return "CENTER";
                  }else if(val == ParagraphJustification.FULL_JUSTIFY_LASTLINE_LEFT){
                            return "LEFTJUSTIFIED";
                  }else if(val == ParagraphJustification.FULL_JUSTIFY_LASTLINE_RIGHT){
                            return "RIGHTJUSTIFIED";
                  }else if(val == ParagraphJustification.FULL_JUSTIFY_LASTLINE_CENTER){
                            return "CENTERJUSTIFIED";
                  }else if(val == ParagraphJustification.FULL_JUSTIFY_LASTLINE_FULL){
                            return "FULLYJUSTIFIED";
                  }else{
                            alert("There must be an error.");
                  }
        }
        
         //function to get needed information to recreate text layers in photoshop,
         //and export that information to a JSON file.
         //returns JSON objects for supplied text layer 'l'
        function textToObjs(l) {
            var textObj = {};
            var textDocument = l.property("ADBE Text Properties").property("ADBE Text Document").value;
            
            //temporarily unparent the layer (if it is actually parented) to get accurate scale
            try{
                var tempParent = l.parent;
                l.parent = "";
                var scaleV = l.property("ADBE Transform Group").property("ADBE Scale").value;
                l.parent = tempParent;
            } catch (e) {
                var scaleV = l.property("ADBE Transform Group").property("ADBE Scale").value;
            }
            //

            textObj.layerName= l.name;
            textObj.layerScale= [scaleV[0],scaleV[1]];
            textObj.rotation = l.property("ADBE Transform Group").property("ADBE Rotate Z").value;
            
            //NOTE: position is handled in the main recurse() function, because i'm either lazy, stupid, or STPUD LIKE A FOX. guess which!  

            //textObj.anchorPoint = l.transform.anchorPoint.value;

            textObj.font= textDocument.font;
            textObj.fontSize= textDocument.fontSize;
            textObj.fillColor= textDocument.fillColor;
            textObj.justification= textJustVal(textDocument);
            textObj.applyFill= textDocument.applyFill;
            textObj.text= textDocument.text;
            textObj.tracking= textDocument.tracking;
           try {
               if(textDocument.boxText) textObj.kind = "PARAGRAPHTEXT";
                textObj.boxTextSize= textDocument.boxTextSize;
                
            } catch(e) {
                if(textDocument.pointText) textObj.kind = "POINTTEXT";
            }
        
            // replace line returns with no characters/whitespace with line returns WITH whitespace
            l.property("Source Text").setValue(textDocument.text.replace("\r\r","\rQ\r")); // cheat to make certain the second line always has a valid baselineLocs value (doesn't work with \r)
            textObj.baselineLocs = l.property("ADBE Text Properties").property("ADBE Text Document").value.baselineLocs;
            l.property("Source Text").setValue(textObj.text);
            return textObj;

        }
        
        // recursively converts text objects to strings. returns JSON string.
        function textToString(inComp) {
            try{
            var res = {};
            var cnt = 0;
            var compCnt = 0;
            var parentPath = ["doc"];
            var parentScaleOffset = [];
            
            var parentPositionOffset = ["comp(\""+inComp.name+"\")"];
            var aeParentPath = ["comp(\""+inComp.name+"\")"];
            var parentRotationOffset = [];
            var baseComp = app.project.activeItem;
            var tempComp = app.project.items.addComp("tempComp",baseComp.width,baseComp.height,baseComp.pixelAspect,baseComp.duration,baseComp.frameRate);

            function recurse(inComp,tempComp){ //recursively checks comps for text layers, returns a "path" to them, requires the variable "parentPath" note: now it does a bunch of other stuff *shrug*
                try{

                    var lyrs = inComp.layers;
                    
                    for (var i=1; i<=lyrs.length; i++) {
                        var l = lyrs[i];
                        var currPath;
                        if (l.source instanceof CompItem) {
                            //build a recursive toComp() expression to find the position of text layers inside the comp, something like this:
                            // thisComp.layer("middle Comp 1").toComp(comp("middle Comp 1").layer("deepest Comp 1").toComp(comp("deepest Comp 1").layer("deepest").toComp([0,0,0])))
                            aeParentPath[compCnt] = "comp(\""+l.source.name+"\")";
                            parentPositionOffset.push("layer(\""+l.name+"\").toComp("+aeParentPath[compCnt]);
                            
                            currPath = "layerSets.getByName('"+l.name+"')";
                            parentPath.push(currPath);
                            
                            //temporarily unparent the layer (if it is actually parented) to get accurate scale
                            try{
                                var tempParent = l.parent;
                                l.parent = "";
                                parentScaleOffset.push(l.property("ADBE Transform Group").property("ADBE Scale").value);
                                l.parent = tempParent;
                            } catch (e) {
                                parentScaleOffset.push(l.property("ADBE Transform Group").property("ADBE Scale").value);
                            }
                            //
                            parentRotationOffset.push(l.property("ADBE Transform Group").property("ADBE Rotate Z").value);

                            compCnt++;
                            recurse(l.source,tempComp);
                        } else if (l instanceof TextLayer) { //is the layer a text layer?
                            var prnt = aeParentPath[compCnt-1];
                            res["textLayer"+cnt] = textToObjs(l);
                            res["textLayer"+cnt].parentPath = parentPath.slice(0,compCnt+1).join(".");
                            // create null to find position of text layer
                            var tempNull = tempComp.layers.addNull();
                            var nullPos = tempNull.property("ADBE Transform Group").property("ADBE Position");
                            if (!prnt) {prnt = "comp(\""+app.project.activeItem.name+"\")"}
                            nullPos.expression ="r = "+prnt+".layer(\""+l.name+"\").sourceRectAtTime();\r"+ parentPositionOffset.slice(0,compCnt+1).join(".")+".layer(\""+l.name+"\").toComp([r.left,r.top])"+Array(compCnt+1).join(")"); //toComp spiral of doom
                            res["textLayer"+cnt].layerPosition = nullPos.value;

                            //
                            // calculate scale based on all parent comps
                            var tempScale = [100,100,100];
                            for (s = 0; s<compCnt; s++) {
                                for (a = 0; a<tempScale.length; a++){tempScale[a] *= parentScaleOffset[s][a]*.01};
                            }
                            res["textLayer"+cnt].parentScaleOffset = tempScale;
                            //
                            
                            // add all elements of rotation offset array
                            res["textLayer"+cnt].parentRotationOffset = 0;
                            for (r = 0; r<compCnt; r++) {res["textLayer"+cnt].parentRotationOffset += parentRotationOffset[r]};
                            //
                            cnt++; //iterate counter for each found text layer
                        }

                        if (i == lyrs.length && inComp != app.project.activeItem) {
                            compCnt--;
                            parentScaleOffset.pop();
                            parentRotationOffset.pop();
                            parentPositionOffset.pop();
                            parentPath.pop(); 
                        }
                    }
                
                } catch (err) {
                alert(err.line+"\r"+err.toString());
                }
            }
            
            recurse(inComp,tempComp);
            tempComp.remove();
            return JSON.stringify(res, undefined, 4);
            } catch (err) {
                alert(err.line+"\r"+err.toString());
            }
        }
            
        var objString = textToString(comp);
        
        //app.executeCommand(app.findMenuCommandId("Photoshop Layers...")); // export layered photoshop file
        var thisFile = proj.file.fsName.substring(0,proj.file.fsName.lastIndexOf("."));
        var textFile = new File(thisFile+".json");
        objFile = textFile.saveDlg ("Save text as JSON...", "JSON:*.json;");
        if (!objFile) return ;
        //write JSON file

        if (objFile.open("w")) {
            objFile.encoding = "UTF-8";
            objFile.write(objString);
            objFile.close();
        }
        
        app.endUndoGroup();
        } catch (err) {
            alert(err.line+"\r"+err.toString());
        }
}
AE_typeMaker();