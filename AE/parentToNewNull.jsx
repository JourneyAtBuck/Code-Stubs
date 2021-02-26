(function parentToNewNull(thisObj) {
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
          : new Window("palette", "Null Maker", [200, 200, 600, 500], {
              resizeable: true,
            });
      var ui =
        "group{orientation:'column', alignment:['fill','fill'],spacing:10,\
            logoGroup: Group{alignment:['fill','top'],preferredSize:[200,17],\
                logoImage: Image{preferredSize:[58,17], alignment:['left','bottom']},\
            },\
            mainGroup:Group{orientation:'column',alignment:['fill','top'],alignChildren:['fill','top'],\
                mainText: StaticText {minimumSize:[260,50],alignment:['middle','top']},\
                nullBtn: Button{preferredSize:[100,-1]},\
            }\
        }";
      pal.grp = pal.add(ui);
      pal.layout.layout(true);
      pal.layout.resize();
      pal.onResizing = pal.onResize = function () {
        this.layout.resize();
      };

      var logoBinary = [
        '\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x008\x00\x00\x00\x11\b\x06\x00\x00\x00\u0088%o\u00E0\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x03!iTXtXML:com.adobe.xmp\x00\x00\x00\x00\x00<?xpacket begin="\u00EF\u00BB\u00BF" id="W5M0MpCehiHzreSzNTczkc9d"?> <x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="Adobe XMP Core 5.5-c021 79.154911, 2013/10/29-11:47:16        "> <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"> <rdf:Description rdf:about="" xmlns:xmp="http://ns.adobe.com/xap/1.0/" xmlns:xmpMM="http://ns.adobe.com/xap/1.0/mm/" xmlns:stRef="http://ns.adobe.com/xap/1.0/sType/ResourceRef#" xmp:CreatorTool="Adobe Photoshop CC (Windows)" xmpMM:InstanceID="xmp.iid:1343C5D9ED1C11E3BEB684BFE5DB83CE" xmpMM:DocumentID="xmp.did:1343C5DAED1C11E3BEB684BFE5DB83CE"> <xmpMM:DerivedFrom stRef:instanceID="xmp.iid:1343C5D7ED1C11E3BEB684BFE5DB83CE" stRef:documentID="xmp.did:1343C5D8ED1C11E3BEB684BFE5DB83CE"/> </rdf:Description> </rdf:RDF> </x:xmpmeta> <?xpacket end="r"?>\u00CE\u00DD"2\x00\x00\x04\u00A8IDATx\u00DA\u0094\u0097\tlTE\x18\u00C7\u00DF\u00B6]\u00B0U\u00A0h\u00A9\x07"G\x03\x1E\u0088G4\u00E2E\u00A1\x01\x1B1\u00A2\x10\u00AB"\x06\x05%x\x11\x15\x15\x11E\t\u00A8\u00A4\u0092\x12\x0EA0M\x05\u00AC\nh\u00B5x\u00C4\u00A21\u0082G\u00A0\u008A&@\x10\x04#\u00E0\x19\u0085bj\u00B4\u0096\u00B6l\u00F1\u00FF\u0099\u00DF3\u00C38[\u00EA$\u00BF}\u00BB3o\u00DE\u009B\u00EF\u00FE6\u00D1\u00D8\u00D4tq\x14E\x13E\x17\u00D1"\u00F6\u008BN\u00A2\u00A7\u00F8\u0099\u00B92\u00B1-\u00FA\u00EF\u00B8A\f\x15wDm\u008Fk\u00C4Hq\u0097h\n\u00AC\u009F/&\u008B\u0093E7\u00E6\u00EA\u00C5nQ*v\u0089\x1Eb\u009C\u00C8\x14\u00F9"+\u00CD\u00BB\u00EC\u00BCu"[\u00BC\u0098\u00A1\u008F\u00E1b\u00B4\u00D8(\u00DE\x17\u00FD\u00C5\u00ADb\u009F\u00A8\u00E5\u00C6M\u00DC\u00E3\u008FSP\u008E\u00AD\u008F\n\u00AC\u00E7\u008A*\u00F1\u00A6(\x16\u00CD\u0081{*xoR,\u00E2=\u00C6\x1C\u00D1Q\u00EC\x14\u00BD\u00C5\tb\u0096\u0098!~\x15\u00A9\x00\u0087X{\x02\u00B9\u00FE0-\u00B4\u008A\u00F5X\u00C9\u00C6C\u00E2F\u00F1*\u00BF\u009F\x15W\u008Aw\x10\u00E4[\u00E7p\u00FFhI\u00D4\u0088\x05b\u00BC\x18#\u00FEDIv\u00C8\u008F\u00C40q\u009F\u00C8\x11\r\u00CE\u00FE\u00F7\x10\u00FC<\u00B1\u00C5\x13\u00FCkq\u0081\u00D8\u00CA\u00A1O\x17\x1F\u008B\u00E3E%\u00D6\r\u008DB\u00B1\u0097\u00BD\u00CDYH~\f\u008B\x0F\u008B\u00EF\x1C\u00E1\u00E2\u00B1V\u00BC,\x1E\x14w;\u00F3\x1D\u00D0\u00FC*\u00ACd\u00EE\u00B4Y\u00FC\u0080\u00F6o\x16\x1F\u00E0^\u00B9\x01\u00CB\x15\u00E3\u00BE[\x02\x075\u00B7\u009F)\u00BA\u008A\u00BF\u00C4\u00A9\u00E23\u008C\u00B1]\u00E4\u00A1Hw\u00F4B\u00A1\u0083bo\u00C9\u00F0n8+M\u00AC\u00D9\u00D8 N\u00F2\u00E6\x0E#\u00A4\u008DF\u00DC\u00A9@\u009C\u00C1\u00EF/X\u00EB\u00CC5\u00C1\u00F5*b\u00F2\x13\u00F1U\u00E0]\u00E7\u0088\u00A5\u00E2R\u00F1;s\u00E6~}\u00C5\u00BBP\x1D\u00D8\u00F7\u00A1\u0098\'>\u008D\'|\x01M\u00B83\u00D3\b8P\u00FC\x14\u0098\u00FF\u008D\x03}\u0089\x1B\u00F6#Y|Nr\u00B0\u00989h\u00F1@8\u00D8xL\u00DC/\u00F6p\u00E8\u00C8s\u00FB\r\u0084J\u00AD\u00A7\u00CC8\u00B1\u0094\u0088\u00CB\u00C5\x04g}\x11J}\u00C0}\u0098/\u00E0\u00F3h\u00ED\u0096\u0080p\u00F6\u00C0\u00F9\u00DE\u00BC%\u00A2\x11b\u00A1x\u008B8\u00F9\u0086\u00B5i\u00E2j\u00B2\u00AC\u00AD\x1D\u00C7\x01\u00F2\b\u0089J\u00E2\u00F9\u00C9\u0080\x15\u008C\u00B9\x01e\u00B6:W\u00F3\u0082r\u0084\u00BEP\u00DCCb9b\u00F8\u00A9\u00D6\u00B4|\x1B\x1B\u008B\u0088\u00ABal~\u00DBK0\x11\u00961\u00B7}& |\u0084\x15\x0B\u00D1\u00FE\x01\u00AE\u00FD\x1D\u00B7+EA\u00E6\u008EK(;9\u00C4\u00E5\u00D1\u00C6:\u00F14\x19\u00D8\x12\u00CFM\u00E2{\u00FF\u00A6\u008C\u00C0\u00C65\u00E2"\u0084\u00AD&\u00C3\u00AD\u00E4p\u00BB\u00B0p<r\b\u00F8\x12\u0094\u0092\x1D\u00A8\u0093\u00DB\t\u00FC\u00CD\u00CC%yvD"\u0088\u00EB\u00A8\x1D\u00F8Q\x0E\u00DA\u00DE1\x1DC\x1C&\u00D1E\u00ED\x110"6\u00EE\u00C5\x02E\u00A4\u00FEk\u00C9\u00A4\u00EB\u009D\u00B8\u00C9\'u\u00DBZw\x12\u00C6%4\r\u00CBp\u00DD\u00D9\u00EC?\u00E4\b\u00D5\u00C5\u00F1 \u00CB\u00B2+p\u00B9\x05\u00ECk\u00EF\x18K3r\u00AC\x18\x10\u00BA!\u00AB\u008D\u00CDyh\u00A6\u00C5\u0099\u009B\u0089R\u00E6P\u00D8S\by\u0080\x03^G\u0082\u0088\u0088\u00BB8\u00EB\x0E\u00C0\u00DAY\u00D4\u00B5\u00CEd\u00D4\u00A9Xt\x1C\u00F7\u00D5\u00A2\u00D45d\u00D9\u00B6F?j\u00F0i\u0094\x1BS\u00D4\u0089\u00ED\u00B5`\x1C_V\u00BB\x1E\x11\u00B7\u008B;\u0089O\x1B}\u00B8\u00A6\u00A8Q\x11\u00B15\x1Ew\\A\u00CB5\u00C6i\u00BB\x12\bSO\u00E6\u009D\u00C4!\u00A7z\u00EF\x1D\u008C\u00DBN\x0F\u009C)\u00E1|\u00B7\u00F7<E\u00CD\u00AD \u00C3/\u00FB?\x16l!\u00DB\r\u00E5@I\u00E6:`\u00D9\u0088\u0098,$\u00E5[\u00FC\u00BCN\u00BF\x19a\u00E1\u0085d\u00B6\u008D\u00B8f#k\u00B3\u00A8eV7wx\u00EFm\u00A4\x0B\u00D9I\u00E9\u00A9q\u0084\u008B\u00B3h9\x19\u00FCqg_1}\u00F4J\x12\u00CFQ\x05\u00EC\u00C4CFz\u00ED\u00D5e\u0094\u00938!\u00BD\u0086k\f$v\u00E3QM\x16\u00B6\x18\\\u008C\u00C5\u00E2aq\u00FB\u009C\u0098B\u00D7\u00F1\u008A\u00F7nS\u00DC\u00F5(\u00A1\u0080\u00B6,I\t\x1AL\u00FD\u00EB\u00E6\u00ED\u00A9\u00A3\u00BC\u00AD\u00C50\u00FFv2\u0099i\u009A\u00E0:\\\u00B0\u00C1\u009B\u00B7C/w\u00BA\u008Bi4\u00C2{\u00D3\u00D4\u00AD_X\u00AB\u00F0\u00D6\u00AC-\\M\u00E2*\n\u00EC\u00AD",6!\u00CCn\u00EA\u00DD\x0B\bY\x17\u00D8S\u00C9\u00F3\u00AA\\\x0B\u009A\u0080\u00E7R\u008FZ\x11:\u00C5\u00A1\u00CF&\u00AE\u00F6p\u00CF$\u00B4_\u00E6<\u00B4\u0094\u00BFV?\u00E2:\u00ABp\u00E1\x02:\u0096\u00EE\u00D4\u00D2\u0083\u0081\x03\u008D\u00C6\x15\u00DF 9\u00D5`\u00BD\x04\u00FB\x07\u00D1 \u00E4\u00E2MCP\u00F0\u008E4\x1DW\u008A\x04\u00B8\u0095\u00B0\u0099\u009F\u00D0\u00FF\u00C1+h\u008B\u0092\u00DC\x10\u00FBz\u0082\u00DF\u0099|o\u00C6\u00ED\u00CA\u00D3\u00B8t\t\u00AE\u0093O\u00A3\u00BD\u009F&zJ\x1A\x0FqG\x0FZ\u00AC\u009ENS^\u008F\u00B0\u00A5|\u00B7\x10x\u0089\u00B2\u0090\u00DDF\u0082l\u00E0\x19v\u009D\u00F0\u00B7\x00\x03\x00\u0098\x12CR\u00C5\u00A3\u00F0\u00D2\x00\x00\x00\x00IEND\u00AEB`\u0082',
      ];
      var logoFile = new File(
        new Folder(Folder.temp).fsName + "/tempLogoImage.png"
      ); //temporary file for binary image
      logoFile.encoding = "BINARY";
      logoFile.open("w");
      logoFile.write(logoBinary);
      logoFile.close();

      pal.grp.logoGroup.logoImage.image = logoFile;

      //no longer need the temp file, remove it.
      logoFile.remove();

      pal.grp.mainGroup.mainText.text = "Add a parent null per selected layer";

      // circle converter
      pal.grp.mainGroup.nullBtn.text = "Convert";
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
