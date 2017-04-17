//////////////////////////////////////////
// Nulls To Corners.jsx
// ©March 2016  Buck Design
// Written by David Glicksman
//
// Builds corner pins from tracked nulls
//
//////////////////////////////////////////

app.activeViewer.setActive();

//Set up UI vars
var aes_scriptTitle = "Nulls to Corners";
var aes_scriptVersion =  1.2;
var NtCPalette = buildUI_NtC(this);

if (NtCPalette != null && NtCPalette instanceof Window) {
    NtCPalette.show();
}

//Build UI and launch it
function buildUI_NtC(thisObj) {	
	if (thisObj instanceof Panel) {
		var myPalette = thisObj;
		} else {
			var myPalette = new Window("palette",aes_scriptTitle + " v" + aes_scriptVersion ,undefined,{resizeable:true});
		}
	var NtCHelpTip = "Applies specified nulls as corner pin points to the specified layer.";

    if (myPalette != null) {
        //collect layers for use in drop-downs
        var allLayers = app.project.activeItem.layers;
        var layerNames = ['-- New Blank Precomp --']
        var nullNames = []
        for (var j=1; j<allLayers.length + 1; j++) layerNames[j] = allLayers[j].name;
        for (var j=1; j<allLayers.length + 1; j++) nullNames[j-1] = allLayers[j].name;
        
        //Layout and define UI elements
        var paletteContents = 
		"group { \
					alignment: ['fill','fill'], \
					alignChildren: ['left','top'], \
					orientation: 'column', \
					targetLayer: Group { \
						targetLayerTxt: StaticText {text:'Target Layer:', preferredSize: [100,20], helpTip:'"+NtCHelpTip+"'}, \
                           targetLayerLayer: DropDownList {properties: {items: " + layerNames.toSource() + "}}\
						} \
					sourceNullsUpper: Group { \
						ULNullTxt: StaticText {text:'Upper Left Null:', preferredSize: [100,20], helpTip:'"+NtCHelpTip+"'}, \
						ULNullLayer: DropDownList {properties: {items: " + nullNames.toSource() + "}},\
                           URNullTxt: StaticText {text:'Upper Right Null:', preferredSize: [100,20], helpTip:'"+NtCHelpTip+"'}, \
						URNullLayer: DropDownList {properties: {items: " + nullNames.toSource() + "}},\
                           } \
                       sourceNullsLower: Group { \
                           LLNullTxt: StaticText {text:'Lower Left Null:', preferredSize: [100,20], helpTip:'"+NtCHelpTip+"'}, \
						LLNullLayer: DropDownList {properties: {items: " + nullNames.toSource() + "}},\
                           LRNullTxt: StaticText {text:'Lower Right Null:', preferredSize: [100,20], helpTip:'"+NtCHelpTip+"'}, \
						LRNullLayer: DropDownList {properties: {items: " + nullNames.toSource() + "}}\
						} \
                       executionOptions: Group { \
                            bakeText: StaticText {text:'Bake Keyframes: ', preferredSize:[100,20]},\
                            bakeCheckbox:Checkbox{preferredSize:[105,-1]},\
                            addBlurText:StaticText {text:'Add Safe MoBlur: ', preferredSize:[100,20]},\
                            addBlurCheckbox:Checkbox{preferredSize:[105,-1]},\
                       } \
					CornerPinAndBakeBtn: Button {text: 'Corner Pin!', alignment: ['right','top']} , \
				}";
            myPalette.grp = myPalette.add(paletteContents);
            myPalette.layout.layout(true);
            myPalette.layout.resize();
            myPalette.onResizing = myPalette.onResize = function () {this.layout.resize();}
            
            myPalette.grp.CornerPinAndBakeBtn.onClick = function () {
                doCornerPinning (myPalette);
                //if (myPalette.grp.executionOptions.addBlurCheckbox.value == true) addSafeBlur(myPalette);
            }
        }
	return myPalette;
}

//Main action
function doCornerPinning (paletteData) {
    //Get target layer
    var targetChoice = paletteData.grp.targetLayer.targetLayerLayer.selection;
    var targetLayer = app.project.activeItem.layer(targetChoice);
    
    //Build a new comp if target layer is set to "-- New Blank Precomp --"
    if (String(targetChoice) == '-- New Blank Precomp --') {
        newComp = app.project.items.addComp("trackedPrecomp", app.project.activeItem.width, app.project.activeItem.height, app.project.activeItem.pixelAspect, app.project.activeItem.duration, app.project.activeItem.frameRate);
        targetLayer = app.project.activeItem.layers.add(newComp);
    }
    
    //Deselect all layers, select targetLayer
    selectedLayers = app.project.activeItem.selectedLayers;
    for (var i=0; i<selectedLayers.length; i++) selectedLayers[i].selected = false; 
    targetLayer.selected = true;

    //Get layer targets from UI
    var ULCornerLayer = app.project.activeItem.layer(paletteData.grp.sourceNullsUpper.ULNullLayer.selection);
    var URCornerLayer = app.project.activeItem.layer(paletteData.grp.sourceNullsUpper.URNullLayer.selection);
    var LLCornerLayer = app.project.activeItem.layer(paletteData.grp.sourceNullsLower.LLNullLayer.selection);
    var LRCornerLayer = app.project.activeItem.layer(paletteData.grp.sourceNullsLower.LRNullLayer.selection);
 
    //Check that all fields are populated
    if ((targetLayer != null) && (ULCornerLayer != null) && (URCornerLayer != null) && (LLCornerLayer != null) && (LRCornerLayer != null))
    {
        app.beginUndoGroup("Nulls to Corners");
        
        //Set up expressions to drive each pin
        cornerPinEffect = targetLayer.Effects.addProperty("Corner Pin");
        cornerPinEffect.upperLeft.expression = "L = thisComp.layer(\"" + ULCornerLayer.name + "\");fromComp(L.toComp([0,0]));";
        cornerPinEffect.upperRight.expression = "L = thisComp.layer(\"" + URCornerLayer.name + "\");fromComp(L.toComp([0,0]));";
        cornerPinEffect.lowerLeft.expression = "L = thisComp.layer(\"" + LLCornerLayer.name + "\");fromComp(L.toComp([0,0]));";
        cornerPinEffect.lowerRight.expression = "L = thisComp.layer(\"" + LRCornerLayer.name + "\");fromComp(L.toComp([0,0]));";
        app.endUndoGroup();
        
        //Bake each pin expression to keyframes
        if (paletteData.grp.executionOptions.bakeCheckbox.value == true)
        {
            app.beginUndoGroup("Bake Corner Pins");
            
            cornerPinEffect.selected = true;
            cornerPinEffect.upperLeft.selected = true;
            cornerPinEffect.upperLeft.expression.selected = true;
            app.executeCommand(app.findMenuCommandId("Convert Expression to Keyframes"));
            cornerPinEffect.upperLeft.expression.selected = false;
            cornerPinEffect.upperLeft.selected = false;
            
            cornerPinEffect.upperRight.selected = true;
            cornerPinEffect.upperRight.expression.selected = true;
            app.executeCommand(app.findMenuCommandId("Convert Expression to Keyframes"));
            cornerPinEffect.upperRight.expression.selected = false;
            cornerPinEffect.upperRight.selected = false;

            cornerPinEffect.lowerLeft.selected = true;
            cornerPinEffect.lowerLeft.expression.selected = true;
            app.executeCommand(app.findMenuCommandId("Convert Expression to Keyframes"));
            cornerPinEffect.lowerLeft.expression.selected = false;
            cornerPinEffect.lowerLeft.selected = false;

            cornerPinEffect.lowerRight.selected = true;
            cornerPinEffect.lowerRight.expression.selected = true;
            app.executeCommand(app.findMenuCommandId("Convert Expression to Keyframes"));
            cornerPinEffect.lowerRight.expression.selected = false;
            cornerPinEffect.lowerRight.selected = false;
            
            app.endUndoGroup();
        }
        
        //Add "safe motion Blur" if requested
        if (paletteData.grp.executionOptions.addBlurCheckbox.value == true)
        {
            addSafeBlur(targetLayer, ULCornerLayer, URCornerLayer, LLCornerLayer, LRCornerLayer);
        }    
    } else
    {
        alert("Select a target layer and four nulls, plz.");
    }
    app.endUndoGroup();
}

//Since clients can't process motion blur, we can fake it with two directional blurs driven by velocity.  
function addSafeBlur(targetLayer, ULCornerLayer, URCornerLayer, LLCornerLayer, LRCornerLayer) {
    app.beginUndoGroup("Add Safe Motion Blur");

    //Add a null centered between the four corners (to provide velocity)
    var centerNull = app.project.activeItem.layers.addNull();
    centerNull.name = "Center Null";
    centerNull.transform.position.expression = "(thisComp.layer(\"" + ULCornerLayer.name
                                                              + "\").transform.position + thisComp.layer(\"" + URCornerLayer.name
                                                              + "\").transform.position + thisComp.layer(\"" + LLCornerLayer.name
                                                              + "\").transform.position + thisComp.layer(\"" + LRCornerLayer.name + "\").transform.position) / 4";
    centerNull.selected = false;
    
    //Add a slider to the targetLayer to control blur intensity
    var blurSlider = targetLayer.Effects.addProperty("Slider Control");
    blurSlider.property("Slider").setValue(40);
    blurSlider.name = "Safe Blur Amount";
    
    //Add two directional blurs (so we can control X and Y separately)
    safeBlurX = targetLayer.Effects.addProperty("Gaussian Blur");
    safeBlurX.name = "Safe Blur X";
    safeBlurX.property("Blur Dimensions").setValue(2);
    safeBlurX.property("Blurriness").expression = "Math.abs(thisComp.layer(\"" + centerNull.name + "\").transform.position.velocity[0]) * effect(\"Safe Blur Amount\")(\"Slider\") * .001"
    
    safeBlurY = targetLayer.Effects.addProperty("Gaussian Blur");
    safeBlurY.name = "Safe Blur Y";
    safeBlurY.property("Blur Dimensions").setValue(3);
    safeBlurY.property("Blurriness").expression = "Math.abs(thisComp.layer(\"" + centerNull.name + "\").transform.position.velocity[1]) * effect(\"Safe Blur Amount\")(\"Slider\") * .001"
    
    targetLayer.selected = true;
    app.endUndoGroup();
}