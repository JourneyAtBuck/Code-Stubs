(function () {
  var proj = app.project;
  var items = proj.items;
  var layers = proj.activeItem.selectedLayers;
  app.beginUndoGroup("rename selected layers");
  // loop through items
  // for (var i = 1; i <= items.length; i++) {
  //   if (items[i].selected) {
  //     items[i].name = items[i].name.replace("Blue", "RGB");
  //   }
  // }
  // loop through layers
  for (var i = 0; i < layers.length; i++) {
    layers[i].name = layers[i].name + (i + 1).toString();
  }
  app.endUndoGroup;
})();
