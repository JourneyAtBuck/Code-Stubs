(function removeDisabledShapeProps() {
    // function returns array of all layers in a comp and any nested precomps, requires list of layers, globals.projLayerNames
    // requires function noExt()
    function findLayers (comp) {
        var res = [];
        
        (function recurseLayers (comp, res) {
            for (var c = 1; c <= comp.numLayers; c++) {
                var lyr = comp.layer(c);
                if (lyr.source instanceof CompItem) {
                    recurseLayers(lyr.source,res);
                }
                res.push(lyr);
            }
        })(comp,res);
        return res;
    }

    // function returns string path of all properties of a layer, "lyr"
    function listProps (lyr) {
        res = [];
        propDepth = 0;
        (function recurse (obj) {
            for  (var p = 1; p <= obj.numProperties; p++) {
                var inProp = obj.property(p);
                res.push(inProp);
                if (inProp.numProperties>0) {
                    recurse (inProp);
                }
            }
        })(eval(propPath));
        return res ;
    }

    function propKiller(lyr, shapeProps) {
        if (lyr instanceof ShapeLayer) {
            for (var p in shapeProps) {
                if (shapeProps.hasOwnProperty (p)) {
                    var prop = shapeProps[p];
                    var fTest = prop.matchName.match ("Fill");
                    var sTest = prop.matchName.match ("Stroke");
                    if (fTest || sTest) {
                        if (!prop.enabled) {
                            prop.remove();
                            var shapeProps = listProps(lyr);
                            propKiller (lyr, shapeProps);
                            return;
                        };
                    }
                }
            }
        }
    }
    
    var proj = app.project;
    var comp = proj.activeItem;
    shapeProps = [];
    app.beginUndoGroup("Export Layered PSD and JSON"); //begins undo group
    lyrs = findLayers(comp);
    for (var l in lyrs) {
        if (lyrs.hasOwnProperty (l)) {
            shapeProps = listProps(lyrs[l]);
            propKiller(lyrs[l], shapeProps);
        }
    }
    app.endUndoGroup();
})()

