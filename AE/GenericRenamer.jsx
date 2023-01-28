(function () {
  var proj = app.project;
  var items = proj.items;

  app.beginUndoGroup("rename all comps in project");

  for (var i = 1; i <= items.length; i++) {
    items[i].name = items[i].name.replace(/_/g, " ");
  }
  app.endUndoGroup;
})();
