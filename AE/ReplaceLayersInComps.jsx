{
    /*
       before running this script, copy some layers in another comp 
    */
     
    try{
        var proj = app.project;
        var selItems = proj.selection;
        
        app.beginUndoGroup("Replace layers in selected comps");
        for (i in selItems) {
            selItems[i].openInViewer();
            app.executeCommand(23); //select all
            app.executeCommand(21); //clear
            app.executeCommand(20); //paste
        }
            app.endUndoGroup();
    } catch (err) {
        alert(err.line+"\r"+err.toString());  
    }
}