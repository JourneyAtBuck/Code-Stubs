{
  var comp = app.project.activeItem;
  app.beginUndoGroup("Randomize scale");
  var scaleRange = 0.3;
  for (var i = 1; i < comp.selectedLayers.length; i++) {
    var curLayer = comp.selectedLayers[i];
    var rand = Math.random() * scaleRange + (1 - scaleRange);

    comp.selectedLayers[i].transform.scale.setValue([rand * 100, rand * 100]);
  }
  app.endUndoGroup();
}
