(function createSquaresFromSwatches() {
  // Check if a document is open
  if (app.documents.length == 0) {
    alert("Please open a document first.");
  } else {
    // Get the active document
    var doc = app.activeDocument;

    // Get the selected swatch groups
    var groups = doc.swatchGroups.getSelected();

    // Set the square dimensions and spacing
    var squareSize = 100;
    var spacing = 10;

    // Iterate through each selected swatch group
    for (var i = 0; i < groups.length; i++) {
      // Get the current swatch group
      var group = groups[i];

      // Get the swatches in the current group
      var swatches = group.getAllSwatches();

      // Create a text frame for the group label
      var textFrame = doc.textFrames.add();
      textFrame.contents = group.name;
      textFrame.position = [0, i * (squareSize + spacing)];
      textFrame.textRange.characterAttributes.size = squareSize * 0.8;

      // Set the text frame to be right-justified
      textFrame.paragraphs[0].paragraphAttributes.justification =
        Justification.RIGHT;

      // Iterate through each swatch in the current group
      for (var j = 0; j < swatches.length; j++) {
        // Get the current swatch
        var swatch = swatches[j];

        // Check if the target layer is locked
        var targetLayer = doc.activeLayer;
        if (targetLayer.locked) {
          targetLayer.locked = false;
        }

        // Create a square
        var square = doc.pathItems.rectangle(0, 0, squareSize, squareSize);

        // Apply the current swatch to the square
        square.fillColor = swatch.color;

        // Calculate the position of the square in the row
        var x = (j + 1) * spacing + j * squareSize;
        var y = i * (squareSize + spacing);

        // Position the square to the right of the previous square
        square.position = [x, y];
      }
    }
  }
})();
