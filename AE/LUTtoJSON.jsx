
(function () {
    // finds .lut files in a folder based on project object's file path
    function findLUTs(proj) {
        var folderPath = proj.file.parent.parent.parent.fsName+"/Render/JSON/LUT";
        var folderObj = new Folder (folderPath);
        var res;
        if (folderObj.exists) res = folderObj.getFiles("*.lut");
        return res;
    }

    // function requires lut file, returns ColorMap according to schema
    function LUTtoJSON(lut) {
        var res = {};
        res.type = "MAP";
        res.red = [];
        res.green = [];
        res.blue = [];
        
        var lutSize, beginVals;
        var count = 0;
        
        if (lut.exists) {
            lut.open("r");
            while(!lut.eof) {
                count++;
                var ln = lut.readln();
                if (ln.match("LUT:")) {
                    var tmpA = ln.split(" ");
                    lutSize = parseInt(tmpA[tmpA.length-1]);
                }
                var num = parseInt(ln);
                if ( lutSize && !isNaN(num)) {
                    if (!beginVals)beginVals = count;
                    if (count<=(lutSize-1+beginVals)) { res.red.push(num) }
                    else if (count>(lutSize-1+beginVals) && count<=(lutSize*2-1+beginVals)) { res.green.push(num) }
                    else if (count>(lutSize*2-1+beginVals)) { res.blue.push(num) }
                }
            }
            lut.close;
        }

        return res;
    }
    var proj = app.project;
    var luts = findLUTs(proj);
    for (var l = 0; l < luts.length; l++) {
        var lutObj = LUTtoJSON (luts[l]);
    }
    for (var o in lutObj) {
        $.writeln(o + " has a length of " + lutObj[o].length);
    }
})();