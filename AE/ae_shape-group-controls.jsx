// Function to create expressions on shape groups to match null transforms
function linkShapeGroupsToNulls() {
  var comp = app.project.activeItem;

  // Check if the active item is a composition
  if (comp && comp instanceof CompItem) {
    var selectedLayer = comp.selectedLayers[0]; // Assuming only one layer is selected

    // Check if the selected layer is a shape layer
    if (selectedLayer && selectedLayer instanceof ShapeLayer) {
      var shapeLayer = selectedLayer;
      var shapeGroupCount = shapeLayer.content.numProperties;
      app.beginUndoGroup("Create Shape Group Parent Nulls");

      // Get the label color of the selected shape layer
      var labelColor = selectedLayer.label;

      // Loop through each shape group
      for (var i = 1; i <= shapeGroupCount; i++) {
        var shapeGroup = shapeLayer.content.property(i);

        // Check if the property is a shape group
        if (shapeGroup.matchName === "ADBE Vector Group") {
          // Create a new null object
          var nullLayer = comp.layers.addNull();

          // Set the name of the null layer
          nullLayer.name = selectedLayer.name + "_" + shapeGroup.name;

          // Set the label color of the null layer to match the selected shape layer
          nullLayer.label = labelColor;

          // Parent null to shape layer
          nullLayer.parent = selectedLayer;

          // Match null transforms to shape group transforms
          nullLayer.transform.position.setValue(
            shapeGroup.transform.position.value
          );
          nullLayer.transform.scale.setValue(shapeGroup.transform.scale.value);
          nullLayer.transform.rotation.setValue(
            shapeGroup.transform.rotation.value
          );

          // Set expressions on shape group properties to match null transforms
          shapeGroup.property("Transform").property("Position").expression =
            'var pos = thisComp.layer("' +
            nullLayer.name +
            '").toWorld([0,0,0]);\n' +
            "fromWorld(pos);";
          shapeGroup.property("Transform").property("Scale").expression =
            'var scale = thisComp.layer("' +
            nullLayer.name +
            '").transform.scale;\n' +
            "scale;";
          shapeGroup.property("Transform").property("Rotation").expression =
            'var rotation = thisComp.layer("' +
            nullLayer.name +
            '").transform.rotation;\n' +
            "rotation;";
          nullLayer.parent = null;
        }
      }
      app.endUndoGroup();
    } else {
      alert("Please select a shape layer.");
    }
  } else {
    alert("Please open a composition.");
  }
}

// Call the function to set up expressions on shape groups to match null transforms
linkShapeGroupsToNulls();
