sel = app.activeDocument.selection;
if (sel.length > 0){
    for (var i = 0; i < sel.length; i ++) {
        var lyr = sel[i];
        var traceobj = lyr.trace();
        traceobj.tracing.tracingOptions.loadFromPreset("FBstye_Convert"); // you spelled the preset wrong, K-dawg
    }
}