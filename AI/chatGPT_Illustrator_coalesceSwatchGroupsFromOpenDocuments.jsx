(function coalesceSwatchGroupsFromOpenDocuments() {
  var openDocs = app.documents;

  // Create a new document to hold all the swatch groups
  var newDoc = app.documents.add();
  newDoc.name = "Combined Swatches";
  newDoc.documentColorSpace = DocumentColorSpace.RGB;

  // Loop through all open documents
  for (var i = 1; i < openDocs.length; i++) {
    var currentDoc = openDocs[i];

    // Loop through all swatch groups in the current document
    for (var j = 1; j < currentDoc.swatchGroups.length; j++) {
      var currentGroup = currentDoc.swatchGroups[1];
      var currentSwatches = currentGroup.getAllSwatches();

      // Create a new swatch group in the new document
      var newGroup = newDoc.swatchGroups.add();
      newGroup.name = currentGroup.name;
      // Loop through all swatches in the current swatch group
      for (var k = 0; k < currentSwatches.length; k++) {
        var currentSwatch = currentSwatches[k];

        var newSwatch = newDoc.swatches.add();
        newSwatch.color = currentSwatch.color;
        newGroup.addSwatch(newSwatch);
      }
    }
  }
})();
