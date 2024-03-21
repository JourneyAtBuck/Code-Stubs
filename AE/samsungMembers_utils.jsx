(function () {
  var proj = app.project;
  var items = proj.items;
  var comp = proj.activeItem || {};
  var layers = comp.selectedLayers;
  //serialize selected layers
  app.beginUndoGroup("rename selected layers");

  for (var i = 0; i < layers.length; i++) {
    layers[i].name = "matte" + (i + 2).toString();
  }

  ////parent selected layers to "screen" + i
  // app.beginUndoGroup("parent to same numbered screen");

  // for (var i = 0; i < layers.length; i++) {
  //   var num = i + 1;
  //   var parentScreen = comp.layer(layers[i].index + 1);
  //   // var parentScreen = comp.layer("screen" + num.toString());
  //   layers[i].parent = parentScreen;
  // }

  //// switch portrait > landscape
  // app.beginUndoGroup("switch portrait/landscape");
  // for (var i = 1; i <= items.length; i++) {
  //   var curItem = items[i];
  //   if (curItem.selected == true) {
  //     var oldWidth = curItem.width + 0;
  //     var oldHeight = curItem.height + 0;
  //     curItem.width = oldHeight;
  //     curItem.height = oldWidth;
  //   }
  // }
  ////set comp widths
  // app.beginUndoGroup("set comp widths");
  // for (var i = 1; i <= items.length; i++) {
  //   var curItem = items[i];
  //   var shorterDimension = curItem.width < curItem.height ? "width" : "height";

  //   if (curItem.selected == true) {
  //     curItem[shorterDimension] = 920;
  //   }
  // }
  ////set comp lengths
  // app.beginUndoGroup("set comp widths");
  // var newLength = 169 * (1 / 24);
  // for (var i = 1; i <= items.length; i++) {
  //   var curItem = items[i];

  //   if (curItem.selected == true) {
  //     curItem.duration = newLength;
  //     for (var l = 1; l <= curItem.numLayers; l++) {
  //       curItem.layers[l].outPoint = newLength;
  //     }
  //   }
  // }
  ////rename comps
  // app.beginUndoGroup("rename selected items");

  // for (var i = 1; i <= items.length; i++) {
  //   var curItem = items[i];

  //   if (curItem.selected == true) {
  //     curItem.name = curItem.name.replace(
  //       "samsung_members_character_spinningarray_v01_mmbr_",
  //       ""
  //     );
  //   }
  // }

  // DON'T COMMENT THIS OUT
  app.endUndoGroup;
})();
