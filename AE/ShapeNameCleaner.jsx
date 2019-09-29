(function cleanShapeLayerNames() {
  var comp = app.project.activeItem;
  if (!comp) return alert("No active comp.");
  var selLyrs = comp.selectedLayers;
  if (!selLyrs) return alert("No layers selected.");

  app.beginUndoGroup("Rename selected layers");
  for (i in selLyrs) {
    selLyrs[i].name = selLyrs[i].name.substr(
      0,
      selLyrs[i].name.lastIndexOf(" ")
    );
  }
  app.endUndoGroup();
})();
