{
    try{
        var comp = app.project.activeItem;
        app.beginUndoGroup("Randomize X position");
        for (i in comp.selectedLayers) {
            var yPos = comp.selectedLayers[i].transform.position.value[1];
            comp.selectedLayers[i].transform.position.setValue([Math.random() * 1920,yPos]);
        }
            app.endUndoGroup();
    } catch (e) {
        alert(e);    
    }
}