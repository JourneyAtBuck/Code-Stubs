(function () {
    var doc = app.activeDocument;
    var sel = doc.selection;
    if (sel.length) {
        for (var i = 0; i < sel.length; i++) {
            try{sel[i].parent.selected = true}catch(e){continue};
        }
    }
})();
