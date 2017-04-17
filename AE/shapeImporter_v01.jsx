{
    function importAIasShape()  {
        try{
            comp = app.project.activeItem;
            var newFile = File.openDialog("Choose file to read.");
            if (!newFile) return alert("No file selected.");
            var importedImg = app.project.importFile(new ImportOptions(File(newFile)));
            var imgLayer = comp.layers.add(importedImg);
            var layerName = importedImg.name.substr(0,importedImg.name.lastIndexOf("."));
            app.executeCommand(3973);
            var shapeLayerName = layerName+" Outlines";
            comp.layer(shapeLayerName).name = layerName+"_CTRL";
            importedImg.remove();
        } catch (err) {
            alert(err.line+"\r"+err.toString());
        }
    }
    importAIasShape()
}