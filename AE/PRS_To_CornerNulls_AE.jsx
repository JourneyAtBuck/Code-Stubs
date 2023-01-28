function prsToCornerNulls() {
  var proj = app.project;
  var comp = proj.activeItem;
  if (!comp) {
    return alert("Please make sure your comp is active.");
  }
  var selectedLayers = comp.selectedLayers;

  app.beginUndoGroup("PSR to Corner Nulls");
  for (var i = 0; i < selectedLayers.length; i++)
    selectedLayers[i].selected = false;
  for (var i = 0; i < selectedLayers.length; i++) {
    convertToCornerNulls(selectedLayers[i]);
  }
  app.endUndoGroup();

  function convertToCornerNulls(targetLayer) {
    //make nulls at targetLayer's corners via expression
    ULNull = comp.layers.addNull();
    ULNull.transform.position.expression =
      "thisComp.layer('" + targetLayer.name + "').toComp([0,0])";
    ULNull.name = targetLayer.name + "_Upper Left";

    URNull = comp.layers.addNull();
    URNull.transform.position.expression =
      "L = thisComp.layer('" + targetLayer.name + "');L.toComp([L.width,0])";
    URNull.name = targetLayer.name + "_Upper Right";

    LLNull = comp.layers.addNull();
    LLNull.transform.position.expression =
      "L = thisComp.layer('" + targetLayer.name + "');L.toComp([0,L.height])";
    LLNull.name = targetLayer.name + "_Lower Left";

    LRNull = comp.layers.addNull();
    LRNull.transform.position.expression =
      "L = thisComp.layer('" +
      targetLayer.name +
      "');L.toComp([L.width,L.height])";
    LRNull.name = targetLayer.name + "_Lower Right";

    ULNull.inPoint = targetLayer.inPoint;
    URNull.inPoint = targetLayer.inPoint;
    LLNull.inPoint = targetLayer.inPoint;
    LRNull.inPoint = targetLayer.inPoint;

    ULNull.outPoint = targetLayer.outPoint;
    URNull.outPoint = targetLayer.outPoint;
    LLNull.outPoint = targetLayer.outPoint;
    LRNull.outPoint = targetLayer.outPoint;

    ULNull.transform.position.selected = true;
    URNull.transform.position.selected = true;
    LLNull.transform.position.selected = true;
    LRNull.transform.position.selected = true;
    app.executeCommand(
      app.findMenuCommandId("Convert Expression to Keyframes")
    );
  }
}
prsToCornerNulls();
