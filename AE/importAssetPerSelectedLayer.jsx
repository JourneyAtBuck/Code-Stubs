(function () {
    try{
    
        app.beginUndoGroup("Import project item per selected layer");
        var proj = app.project;
        
        app.activeViewer.setActive();
        var comp = proj.activeItem;
        if (!(comp instanceof CompItem)) return alert("Open a composition before running this script.");
        if (!proj.selection.length) return alert("Select a project item to import before running this script.");
        
        var sel = comp.selectedLayers;
        
        for (var i=0; i<sel.length; i++) {
            var newLyr = comp.layers.add(proj.selection[0]);
            newLyr.moveAfter(sel[i]);
            sel[i].remove();
        }
        app.endUndoGroup();
        } catch (e) {
        alert(e);    
    }
})()