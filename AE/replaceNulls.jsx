var proj = app.project;
var sel = proj.selection;
for (s in sel) {
    if (sel[s] instanceof FootageItem) var sourceItem = sel[s];
    continue;
}
for (i in sel) {

    if (sel[i] instanceof CompItem) {
        var lyrs = sel[i].layers;
        for (l = 1; l<lyrs.length; l++) {
            if (lyrs[l].nullLayer ){
                lyrs[l].replaceSource(sourceItem, true);
            }
        }
    }

}
