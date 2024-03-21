(function greenToAlpha() {
  // Get all the compositions in the project
  var allComps = app.project.items;
  var compCount = allComps.length;
  app.beginUndoGroup("green to alpha");

  // Loop through each composition
  for (var i = 1; i <= compCount; i++) {
    var currentComp = allComps[i];

    // Check if the item is a composition
    if (currentComp instanceof CompItem) {
      // Get the first layer in the composition
      var firstLayer = currentComp.layers[1];

      // Add the Set Channels effect to the layer
      var setChannelsEffect =
        firstLayer.Effects.addProperty("ADBE Set Channels");

      // Set the alpha of the Set Channels effect to the green channel
      setChannelsEffect.property(8).setValue(2);

      // Add the Set Matte effect to the layer
      var setMatteEffect = firstLayer.Effects.addProperty("ADBE Set Matte3");

      // Set the "use for matte" property of the Set Matte effect to "red channel"
      setMatteEffect.property(2).setValue(1);

      // Turn on the "invert matte" checkbox
      setMatteEffect.property(3).setValue(1);

      // Add the Invert effect to the layer
      var invertEffect = firstLayer.Effects.addProperty("ADBE Invert");

      // Set the Invert effect to alpha
      invertEffect.property(1).setValue(16);
    }
  }
  app.endUndoGroup();
})();
