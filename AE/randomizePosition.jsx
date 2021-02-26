{
  var comp = app.project.activeItem;
  app.beginUndoGroup("Randomize position");
  for (var i = 1; i < comp.selectedLayers.length; i++) {
    var curLayer = comp.selectedLayers[i];
    comp.selectedLayers[i].transform.position.setValue([
      Math.random() * comp.width - comp.width * 0.5,
      Math.random() * comp.height - comp.height * 0.5,
    ]);
  }
  app.endUndoGroup();
}
