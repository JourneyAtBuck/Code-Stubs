{
 
    var  sourceDir,
    destDir,
    files,
    sourceDoc;
     
    sourceDir = Folder.selectDialog( 'Select the import directory.', '~' );
    destDir = Folder.selectDialog( 'Select the export directory.', sourceDir.sourceDir );
     
    files = sourceDir.getFiles("*.svg");
    if(files.length == 0){
        alert("No files to import");
    }else{
        for(i=0; i < files.length; i++){
            sourceDoc = app.open(files[i]);
             
            // Create new filename
            var ext = '.ai';
            var newName = "";
            var dot = files[i].name.lastIndexOf('.');
            newName += files[i].name.substring(0, dot);
            newName += ext;
            targetFile = new File( destDir + '/' + newName );
             
            // Resize artboard
            app.activeDocument.artboards[0].artboardRect = app.activeDocument.visibleBounds;
            redraw();
             
            // Save as AI
            var originalInteractionLevel = userInteractionLevel;
            userInteractionLevel = UserInteractionLevel.DONTDISPLAYALERTS;
            
            sourceDoc.saveAs(targetFile);
            app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
            sourceDoc = null;
            
            userInteractionLevel = originalInteractionLevel;
        }
    }
}