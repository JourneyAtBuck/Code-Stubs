#target illustrator

function mj_vertexNumberer() {
    var doc = app.activeDocument;
    var sel = doc.selection;

    var newLineStart = 64;
    var offset = 0;
    var dotSize = 2;

    for (var i = 0; i<sel.length; i++) {
        var dotOffset = dotSize*.5;
        if (sel[i] instanceof PathItem) {
            var numVerts = sel[i].pathPoints.length;
            if (i>0) offset = newLineStart*i;
            for (v = 0; v < numVerts; v++) {
                var vPos = sel[i].pathPoints[v].anchor;
                var txt = doc.textFrames.add();
                txt.position = vPos;
                txt.contents = v+offset+1;
                doc.pathItems.ellipse(vPos[1]+dotOffset, vPos[0] -dotOffset, dotSize, dotSize, false, true);
            }
        }
    }
}
mj_vertexNumberer();
