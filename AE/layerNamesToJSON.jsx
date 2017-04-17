(function layerNamesToJSON(thisObj){
    var proj = app.project;
    var projFile = proj.file.name;
    var comp = proj.activeItem;
    var res = {};
    var objString, objKey, thisFile, textFile, firstNum;
    if (!(comp instanceof CompItem)) return alert("Select a comp or viewer window before running this script.");
    
    // function removes extensions from input string
    function noExt (s) { return s.replace(/\.[^*]+$/, "")}
    
    // function requires array and search value, returns search value if found
    function match (a, v) {
        if (a instanceof Array) {
            for (var i = 0; i < a.length; i++) {if (a[i] == v) return v} 
        }
        return null;
    }

    // function finds all layer names in a comp
    function findLayers (comp) {
        var res = [];
        
        (function recurseLayers (comp, res) {
            for (var c = 1; c <= comp.numLayers; c++) {
                var lyr = comp.layer(c);
                if (lyr.source instanceof CompItem) {
                    recurseLayers(lyr.source,res);
                };
                var safeLyrName = noExt(lyr.name); // strips extensions, if any
                
                if (match(res,safeLyrName)) $.writeln("Layer "+safeLyrName+" in the comp "+lyr.containingComp.name+" is not unique.");
                if (safeLyrName.match("-"))res.push(safeLyrName);
            };
        })(comp,res);
        return res;
    };
    
    objKey = projFile.replace(/(^\D+)(\d+)(.+$)/g,'$2');
    res[objKey] = findLayers(comp);

    objString = JSON.stringify(res, undefined, 2);
    
    thisFile = noExt(proj.file.fsName);
    textFile = new File(thisFile+"_naming.json");
    objFile = textFile.saveDlg ("Save text as JSON...", "JSON:*.json;");
    if (!objFile) return alert("Process canceled.");
    //write JSON file

    if (objFile.open("w")) {
        objFile.encoding = "UTF-8";
        objFile.write(objString);
        objFile.close();
    }
    
})(this);