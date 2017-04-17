function selectedKeysChanger() {
    var proj = app.project;
    var comp = proj.activeItem;
    var sel = comp.selectedLayers;
    app.beginUndoGroup("Change selected keys");
    for (var i = 0; i < sel.length; i++){
        var val = sel[i].property("Scale"); //sets which property is being affected
        var keys = val.selectedKeys; //returns an array of index numbers only (lame, but okay)
        var s = 1.1; //amount to multiply scale property value
        for (var k in keys) {
            val.setValueAtKey(keys[k], val.keyValue(keys[k])*s); // note that there are various ways to set values, including AtTime and AtKey. regular setValue() won't work if the property is keyed ¯\_(ツ)_/¯
        }
     
    }
    app.endUndoGroup();
}

selectedKeysChanger();