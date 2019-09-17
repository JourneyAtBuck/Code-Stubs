#target photoshop

function getSelectedLayers(){
    var idGrp = stringIDToTypeID( "groupLayersEvent" );
    var descGrp = new ActionDescriptor();
    var refGrp = new ActionReference();
    refGrp.putEnumerated(charIDToTypeID( "Lyr " ),charIDToTypeID( "Ordn" ),charIDToTypeID( "Trgt" ));
    descGrp.putReference(charIDToTypeID( "null" ), refGrp );
    executeAction( idGrp, descGrp, DialogModes.ALL );
    var resultLayers=new Array();
    for (var ix=0;ix<app.activeDocument.activeLayer.layers.length;ix++){resultLayers.push(app.activeDocument.activeLayer.layers[ix])}
    var id8 = charIDToTypeID( "slct" );
        var desc5 = new ActionDescriptor();
        var id9 = charIDToTypeID( "null" );
        var ref2 = new ActionReference();
        var id10 = charIDToTypeID( "HstS" );
        var id11 = charIDToTypeID( "Ordn" );
        var id12 = charIDToTypeID( "Prvs" );
        ref2.putEnumerated( id10, id11, id12 );
    desc5.putReference( id9, ref2 );
    executeAction( id8, desc5, DialogModes.NO );
    return resultLayers;
}   
function main() {

    //var dlgMain = new Window("dialog", "Test Dialog");

    // match our dialog background color to the host application
    //var brush = dlgMain.graphics.newBrush(dlgMain.graphics.BrushType.THEME_COLOR, "appDialogBackground");
    var doc = app.activeDocument;

    if (app.documents.length > 0) {
        var sel = getSelectedLayers();
        for (var i = 0 ; i < sel.length ; i++)
            sel[i].name = "Balloon" + i.toString();
    }
}


app.activeDocument.suspendHistory('Rename Layers', 'main()');