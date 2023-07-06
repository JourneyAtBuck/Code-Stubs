// #target illustrator

function getRandomColorSwatch(doc) {
  var doc = app.activeDocument;
  var swatches = doc.swatches;
  var selectedSwatches = swatches.getSelected();

  var swatchCount = selectedSwatches.length;

  if (swatchCount < 1) {
    alert("Please select at least one color swatch.");
    return null;
  }

  var randomIndex = Math.floor(Math.random() * swatchCount);
  return selectedSwatches[randomIndex];
}

function applyRandomColorToSelectedObjects() {
  var doc = app.activeDocument;
  var selection = doc.selection;

  if (selection.length < 1) {
    alert("Please select at least one object.");
    return;
  }

  var swatch;
  for (var i = 0; i < selection.length; i++) {
    swatch = getRandomColorSwatch(doc);

    if (swatch) {
      selection[i].fillColor = swatch.color;
    } else {
      break;
    }
  }

  // alert("Random color applied to selected objects.");
}

applyRandomColorToSelectedObjects();
