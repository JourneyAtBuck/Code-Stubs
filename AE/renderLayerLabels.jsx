(function (){
    var proj = app.project;
    var comp = proj.activeItem;
    
    if (!(comp instanceof CompItem)) return alert("Select a composition before running this script.");
    
    var layerGroups = {};
    var compGroup, lcFolder;
    var numLabels = 16;
    var lcFolderName = "Layer Comp Folder";
    var count = 0;
    
    function findItemByName (n) {
        var proj = app.project;
        for(var i = 1; i <= proj.numItems; i++) {
            if (proj.item(i).name == n) return proj.item(i);
        };
        return null;
    };
    
    function makeLG(label,comp) {
        var res = [];
        for (var i=1; i<=comp.numLayers; i++) {
            if (comp.layer(i).label == label) res.push(i);
        };
        return res;
    };
    
    app.beginUndoGroup("Render Layer Label Groups");

    for (var i=1; i<=numLabels; i++) { // ignores unlabeled layers (label: "none")
        var lg = makeLG(i,comp);
        if (lg.length) layerGroups[i] = lg;
    };
    if ( layerGroups.__count__ && !findItemByName(lcFolderName) ) lcFolder = proj.items.addFolder(lcFolderName);
    for (var l in layerGroups) {
        if (layerGroups.hasOwnProperty(l)){
            count++;
            var grp = layerGroups[l];
            var labelComp = comp.duplicate();
            var labelNum = parseInt(l);
            
            labelComp.name = proj.file.name.replace(/(^\D+)(\d+)(.+$)/g,'$2')+"_alpha_" + count;
            labelComp.label = labelNum;
            labelComp.parentFolder = lcFolder;
            for (var i=1; i<=labelComp.numLayers; i++) if (labelComp.layer(i).enabled==true && labelComp.layer(i).solo==true ) labelComp.layer(i).solo = false;
            for (var c = 0; c< grp.length; c++) {
                var lyr = labelComp.layer(grp[c]);
                lyr.enabled = true;
                lyr.solo = true;
            };
            proj.renderQueue.items.add(labelComp);
        }
    };
    app.endUndoGroup();
})();