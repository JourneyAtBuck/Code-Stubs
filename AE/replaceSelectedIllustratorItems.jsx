/*
This script replaces all selected items in your project with files that have a matching suffix. The suffix
is any text after a version number. NOTE: the filenames should be structured like this:
"ASSET_NAME_v###_SUFFIX" where the #s are numbers. It should work with version numbers of any length.

Created by: Moses Journey (journey@buck.co)
Maintained by: Moses Journey (journey@buck.co)
*/
(function updateSelectedSourceNames(thisObj) {
  function buildUI(thisObj) {
    try {
      var pal =
        thisObj instanceof Panel
          ? thisObj
          : new Window(
              "palette",
              "Replace Selected Items",
              [200, 200, 600, 500],
              {
                resizeable: true,
              }
            );
      var ui =
        "group{orientation:'column', alignment:['fill','fill'],spacing:10,\
            mainGroup:Group{orientation:'row',alignment:['fill','top'],alignChildren:['fill','top'],\
                autoBtn: Button{preferredSize:[100,-1]},\
                replaceBtn: Button{preferredSize:[100,-1]},\
            }\
        }";
      pal.grp = pal.add(ui);
      pal.layout.layout(true);
      pal.layout.resize();
      pal.onResizing = pal.onResize = function () {
        this.layout.resize();
      };

      // one-by-one replacer
      pal.grp.mainGroup.replaceBtn.text = "Manual Replace";
      pal.grp.mainGroup.replaceBtn.helpTip =
        "Replace each selected project item.";
      pal.grp.mainGroup.replaceBtn.onClick = manuallyReplaceItems;

      // auto replacer
      pal.grp.mainGroup.autoBtn.text = "Auto-replace";
      pal.grp.mainGroup.autoBtn.helpTip =
        "Attempt to automatically replace items based on suffix.";
      pal.grp.mainGroup.autoBtn.onClick = autoReplaceItems;

      return pal;
    } catch (e) {
      alert(e.line + "\r" + e.toString());
    }
  }

  var pal = buildUI(thisObj);

  if (pal != null && pal instanceof Window) {
    pal.center();
    pal.show();
  }
  function manuallyReplaceItems() {
    app.beginUndoGroup("Replace Selected Project Items.");
    var projectItems = app.project.items;
    var pickedFile = "";
    for (var i = 1; i <= projectItems.length; i++) {
      var currentItem = projectItems[i];
      if (currentItem.selected) {
        var currentItemSrc = currentItem.mainSource.file.fsName;
        var newFile = new File(currentItemSrc).openDlg(
          "Replace " + currentItem.mainSource.file.displayName + " with:"
        );
        if (newFile) {
          pickedFile = newFile;
          currentItem.replace(newFile);
        } else {
          alert("Canceled.");
          break;
        }
      }
    }
    app.endUndoGroup();
  }
  function autoReplaceItems() {
    app.beginUndoGroup("Replace Selected Project Items.");
    var projectItems = app.project.items;
    // var sourceName = app.project.activeItem.mainSource.file.displayName.split(/_v(.\d?)_/);
    var pickedFiles = File.openDialog(
      "Replace Selected Items With:",
      "Illustrator:*.ai;All files:*.*",
      true
    );
    if (pickedFiles) {
      for (var i = 0; i < pickedFiles.length; i++) {
        var currentFile = pickedFiles[i];
        var currentFileName = currentFile.displayName;
        var fileSplit = currentFileName
          .substring(0, currentFileName.lastIndexOf("."))
          .split(/_v(.\d?)_/);
        var currentSuffix = fileSplit[2];
        for (var e = 1; e <= projectItems.length; e++) {
          var currentItem = projectItems[e];
          var currentSource = currentItem.mainSource.file.displayName;
          if (currentItem.selected && currentSource.match(currentSuffix)) {
            currentItem.replace(currentFile);
            continue;
          }
        }
      }
    } else {
      alert("Canceled.");
    }

    app.endUndoGroup();
  }
})(this);
