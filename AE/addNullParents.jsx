(function addNullParents(thisObj) {
  ///collectKeyframes function
  function collectKeyframes(propertyInput) {
    if (propertyInput instanceof Property) {
      var totalKeys,
        prop,
        keyIndexList,
        curKeyIndex,
        curKeyValue,
        inIn,
        outIn,
        ab,
        cb,
        ie,
        oe,
        sab,
        scb,
        ist,
        ost,
        rov,
        twoDS,
        threeDS;
      twoDS = PropertyValueType.TwoD_SPATIAL;
      threeDS = PropertyValueType.ThreeD_SPATIAL;
      keyIndexList = new Array();
      totalKeys = propertyInput.numKeys;

      //If the property has at least 1 keyframe, proceed
      if (totalKeys > 0) {
        //Loop through keys
        for (var i = 1; i <= totalKeys; i++) {
          //Get the current key time...
          curKeyTime = propertyInput.keyTime(i);
          //...it's index...
          curKeyIndex = i;
          //...and its value
          curKeyValue = propertyInput.keyValue(i);

          //Get the key in and out interpolation types
          inIn = propertyInput.keyInInterpolationType(curKeyIndex);
          outIn = propertyInput.keyOutInterpolationType(curKeyIndex);

          //Get the key Temporal Continuous and Auto Bezier if the key type is BEZIER
          if (
            inIn == KeyframeInterpolationType.BEZIER &&
            outIn == KeyframeInterpolationType.BEZIER
          ) {
            ab = propertyInput.keyTemporalAutoBezier(curKeyIndex);
            cb = propertyInput.keyTemporalContinuous(curKeyIndex);
          }

          //Get it's Temporal ease if it is not a HOLD key type
          if (
            inIn != KeyframeInterpolationType.HOLD ||
            outIn != KeyframeInterpolationType.HOLD
          ) {
            ie = propertyInput.keyInTemporalEase(curKeyIndex);
            oe = propertyInput.keyOutTemporalEase(curKeyIndex);
          }

          //Get the key Spatial Continuous, Auto Bezier, Tangents, and Roving values if the key type is 2D or 3D SPATIAL
          if (
            propertyInput.propertyValueType == twoDS ||
            propertyInput.propertyValueType == threeDS
          ) {
            sab = propertyInput.keySpatialAutoBezier(curKeyIndex);
            scb = propertyInput.keySpatialContinuous(curKeyIndex);
            ist = propertyInput.keyInSpatialTangent(curKeyIndex);
            ost = propertyInput.keyOutSpatialTangent(curKeyIndex);
            rov = propertyInput.keyRoving(curKeyIndex);
          }

          //Assemble that collected key data into and object array for retrieval later
          keyIndexList[keyIndexList.length] = {
            curKeyTime: curKeyTime,
            curKeyIndex: curKeyIndex,
            curKeyValue: curKeyValue,
            inIn: inIn,
            outIn: outIn,
            ab: ab,
            cb: cb,
            ie: ie,
            oe: oe,
            sab: sab,
            scb: scb,
            ist: ist,
            ost: ost,
            rov: rov,
          };
        }
        //Return the object array as a result
        return keyIndexList;
      } else {
        //If there were no keyframes, then just return null as a result
        return null;
      }
    }
  }
  ///transferKeyframes function
  function transferKeyframes(propertyInput, keysAry) {
    if (propertyInput instanceof Property && keysAry instanceof Array) {
      if (propertyInput.canSetExpression) {
        if (propertyInput.numKeys == 0) {
          //Declare variables
          var keysAryLength, newKeyTime, addNewKey, newKeyIndex;
          //Get length of keyframe array
          keysAryLength = keysAry.length;
          //Start loop to create keys
          for (var k = 0; k < keysAryLength; k++) {
            //Add new keyframe
            addNewKey = propertyInput.addKey(keysAry[k].curKeyTime);
            //Assign current key to variable
            newKeyIndex = addNewKey;
            //Set the base property value of the key
            propertyInput.setValueAtKey(newKeyIndex, keysAry[k].curKeyValue);

            //Set its Temporal ease if it is not a HOLD key type
            if (keysAry[k].outIn != KeyframeInterpolationType.HOLD) {
              propertyInput.setTemporalEaseAtKey(
                newKeyIndex,
                keysAry[k].ie,
                keysAry[k].oe
              );
            }
            //Set the key type of interpolation
            propertyInput.setInterpolationTypeAtKey(
              newKeyIndex,
              keysAry[k].inIn,
              keysAry[k].outIn
            );

            //Set the key Temporal Continuous and Auto Bezier if the key type is BEZIER
            if (
              keysAry[k].inIn == KeyframeInterpolationType.BEZIER &&
              keysAry[k].outIn == KeyframeInterpolationType.BEZIER
            ) {
              propertyInput.setTemporalContinuousAtKey(
                newKeyIndex,
                keysAry[k].cb
              );
              propertyInput.setTemporalAutoBezierAtKey(
                newKeyIndex,
                keysAry[k].ab
              );
            }

            //Set the key Spatial Continuous, Auto Bezier, and Tangents if the key type is 2D or 3D SPATIAL
            if (
              propertyInput.propertyValueType ==
                PropertyValueType.TwoD_SPATIAL ||
              propertyInput.propertyValueType ==
                PropertyValueType.ThreeD_SPATIAL
            ) {
              propertyInput.setSpatialContinuousAtKey(
                newKeyIndex,
                keysAry[k].scb
              );
              propertyInput.setSpatialAutoBezierAtKey(
                newKeyIndex,
                keysAry[k].sab
              );
              propertyInput.setSpatialTangentsAtKey(
                newKeyIndex,
                keysAry[k].ist,
                keysAry[k].ost
              );
            }
          }

          //We have to go back through and do roving keyframes after we have already created the inital keyframe. This is because the first and last keyframe can not be a roving key, so as we add new keyframes, we are technically on the last key each time in the loop and the code will ignore setting it as roving.
          if (
            propertyInput.propertyValueType == PropertyValueType.TwoD_SPATIAL ||
            propertyInput.propertyValueType == PropertyValueType.ThreeD_SPATIAL
          ) {
            for (var r = 0; r < keysAryLength; r++) {
              propertyInput.setRovingAtKey(r + 1, keysAry[r].rov);
            }
          }
          return true;
        } else {
          //OPTIONAL: If there are already keyframes on the destination property, alert the user to a choice. Just uncomment to use this
          /*	<----DELETE THIS LINE---->
                        var check = confirm("OOPS!\rLooks like you already have keyframes on the property you are copying to!\r\rDelete them by clicking YES or stop the script now by clicking NO.", true);
                        if(check == true){
                            removeKeyframes(propertyInput);
                            transferKeyframes(propertyInput, keysAry);
                            return true;
                        }else{
                            return false;
                        }
                        <----AND DELETE THIS LINE---->	*/
        }
      }
    }
  }

  function makeNull(lyr) {
    var comp = app.project.activeItem;
    var inTrans = lyr("ADBE Transform Group");
    var transA = [
      "ADBE Position",
      "ADBE Position_0",
      "ADBE Position_1",
      "ADBE Position_2",
      "ADBE Scale",
      "ADBE Rotate Z",
    ];
    var staticVals = {};

    var nLayer = comp.layers.addNull();
    var outTrans = nLayer("ADBE Transform Group");

    if (lyr.parent) nLayer.parent = lyr.parent;

    for (var t = 0; t < transA.length; t++) {
      var currentPropertyName = transA[t];
      var inProp = inTrans(currentPropertyName);
      var outProp = outTrans(currentPropertyName);
      if (inProp.dimensionsSeparated) {
        outProp.dimensionsSeparated = true;
      }
      if (inProp.canSetExpression) {
        if (inProp.numKeys) {
          var inKeys = collectKeyframes(inProp);
          transferKeyframes(outProp, inKeys);
        } else {
          outProp.setValue(inProp.value);
        }
        staticVals[currentPropertyName] = inTrans(currentPropertyName).value;
      }
    }
    nLayer.moveBefore(lyr);
    nLayer.name = lyr.name + "_null";
    for (var l = 1; l <= comp.numLayers; l++) {
      var compLyr = comp.layer(l);
      if (compLyr.parent == lyr) compLyr.parent = nLayer;
    }

    // remove keys
    for (var p = 0; p < transA.length; p++) {
      var currentPropertyName = transA[p];
      var prop = inTrans(currentPropertyName);
      if (!prop.canSetExpression) continue;
      numKeys = prop.numKeys;
      for (i = numKeys; i > 0; i--) prop.removeKey(i);
      prop.setValue(staticVals[currentPropertyName]);
    }
    lyr.parent = nLayer;
  }
  // convert all selected layers to circle shapes
  function layersToNulls() {
    var comp = app.project.activeItem;
    if (comp != null && comp instanceof CompItem) {
      if (!comp.selectedLayers.length) return alert("No layers selected.");
      app.beginUndoGroup("Replace layers with circle shapes."); //begins undo group
      var layerAry = comp.selectedLayers;
      for (var i = 0; i < layerAry.length; i++) {
        makeNull(layerAry[i]);
      }

      app.endUndoGroup();
      return alert("Nulls created.");
    } else
      return alert(
        "Make sure your comp window or timeline is active before running this script."
      );
  }
  function buildUI(thisObj) {
    try {
      var pal =
        thisObj instanceof Panel
          ? thisObj
          : new Window("palette", "Add Null Parents", [200, 200, 600, 500], {
              resizeable: true,
            });
      var ui =
        "group{orientation:'column', alignment:['fill','fill'],spacing:10,\
            mainGroup:Group{orientation:'column',alignment:['fill','top'],alignChildren:['fill','top'],\
                nullBtn: Button{preferredSize:[100,-1]},\
            }\
        }";
      pal.grp = pal.add(ui);
      pal.layout.layout(true);
      pal.layout.resize();
      pal.onResizing = pal.onResize = function () {
        this.layout.resize();
      };

      // circle converter
      pal.grp.mainGroup.nullBtn.text = "Add Nulls";
      pal.grp.mainGroup.nullBtn.helpTip =
        "Add a parent null per selected layer";
      pal.grp.mainGroup.nullBtn.onClick = layersToNulls;

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
})(this);
