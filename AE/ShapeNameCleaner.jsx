{
    try{
        var comp = app.project.activeItem;
        var selLyrs = comp.selectedLayers;
        
        //var newName = "Speech Bubble";
        
        app.beginUndoGroup("Rename selected layers");
        for (i in selLyrs) {
            selLyrs[i].name = selLyrs[i].name.substr(0,selLyrs[i].name.lastIndexOf(" "));
        }
        app.endUndoGroup();
    } catch (e) {
        alert(e);    
    }
}