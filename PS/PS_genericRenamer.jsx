#target photoshop


function main() {
    
    //var dlgMain = new Window("dialog", "Test Dialog");

    // match our dialog background color to the host application
    //var brush = dlgMain.graphics.newBrush(dlgMain.graphics.BrushType.THEME_COLOR, "appDialogBackground");
    var doc = app.activeDocument;
    app.beginUndoGroup("Renamer");
    if (app.documents.length > 0) {

        for (var i = 0 ; i < doc.layers.length ; i++)
        {
            var lyr = doc.layers[i];
            var sel = lyr.selected;

            if (sel) lyr.name = lyr.name+" Chicklet";

        }
    }
    app.endUndoGroup();
}
main();
