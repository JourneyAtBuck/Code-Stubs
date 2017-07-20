(function copyEase(){
    function collectKeyframes(propertyInput){
        if(propertyInput instanceof Property){
            var totalKeys, prop, keyIndexList, curKeyIndex, curKeyValue, inIn, outIn, ab, cb, ie, oe, sab, scb, ist, ost, rov, twoDS, threeDS;
            twoDS = PropertyValueType.TwoD_SPATIAL;
            threeDS = PropertyValueType.ThreeD_SPATIAL;
            keyIndexList = new Array();
            totalKeys = propertyInput.numKeys;
            
            //If the property has at least 1 keyframe, proceed
            if(totalKeys > 0){
                //Loop through keys
                for(var i = 1; i <= totalKeys; i++){
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
                    if(inIn == KeyframeInterpolationType.BEZIER && outIn == KeyframeInterpolationType.BEZIER){
                        ab = propertyInput.keyTemporalAutoBezier(curKeyIndex);
                        cb = propertyInput.keyTemporalContinuous(curKeyIndex);
                    }
                
                    //Get it's Temporal ease if it is not a HOLD key type
                    if(inIn != KeyframeInterpolationType.HOLD || outIn != KeyframeInterpolationType.HOLD){
                        ie = propertyInput.keyInTemporalEase(curKeyIndex);
                        oe = propertyInput.keyOutTemporalEase(curKeyIndex);
                    }
                
                    //Get the key Spatial Continuous, Auto Bezier, Tangents, and Roving values if the key type is 2D or 3D SPATIAL
                    if(propertyInput.propertyValueType == twoDS || propertyInput.propertyValueType == threeDS){
                        sab = propertyInput.keySpatialAutoBezier(curKeyIndex);
                        scb = propertyInput.keySpatialContinuous(curKeyIndex);
                        ist = propertyInput.keyInSpatialTangent(curKeyIndex);
                        ost = propertyInput.keyOutSpatialTangent(curKeyIndex);
                        rov = propertyInput.keyRoving(curKeyIndex);
                    }
                    
                    //Assemble that collected key data into and object array for retrieval later
                    keyIndexList[keyIndexList.length] = {
                        'curKeyTime':curKeyTime, 
                        'curKeyIndex':curKeyIndex, 
                        'curKeyValue':curKeyValue, 
                        'inIn':inIn, 
                        'outIn':outIn, 
                        'ab':ab, 
                        'cb':cb, 
                        'ie':ie, 
                        'oe':oe, 
                        'sab':sab, 
                        'scb':scb, 
                        'ist':ist, 
                        'ost':ost, 
                        'rov':rov
                        }
                }
                //Return the object array as a result
                return keyIndexList;
            }else{
                //If there were no keyframes, then just return null as a result
                return null;
            }
        }
    }
    ///transferKeyframes function
    function transferKeyframes(propertyInput, keysAry){
        if(propertyInput instanceof Property && keysAry instanceof Array){

                //Declare variables
                var keysAryLength, newKeyTime, addNewKey, newKeyIndex;
                //Get length of keyframe array
                keysAryLength = keysAry.length;
                //Start loop to create keys
                for(var k = 0; k < keysAryLength; k++){
                    
                    //Assign current key to variable
                    newKeyIndex = k+1;
                    
                    //Set it's Temporal ease if it is not a HOLD key type
                    if(keysAry[k].outIn != KeyframeInterpolationType.HOLD){
                        propertyInput.setTemporalEaseAtKey(newKeyIndex, keysAry[k].ie, keysAry[k].oe);
                    }
                    //Set the key type of interpolation
                    propertyInput.setInterpolationTypeAtKey(newKeyIndex, keysAry[k].inIn, keysAry[k].outIn);
                    
                    //Set the key Temporal Continuous and Auto Bezier if the key type is BEZIER
                    if((keysAry[k].inIn == KeyframeInterpolationType.BEZIER) && (keysAry[k].outIn == KeyframeInterpolationType.BEZIER)){
                        propertyInput.setTemporalContinuousAtKey(newKeyIndex, keysAry[k].cb);
                        propertyInput.setTemporalAutoBezierAtKey(newKeyIndex, keysAry[k].ab);
                    }
                
//~                     //Set the key Spatial Continuous, Auto Bezier, and Tangents if the key type is 2D or 3D SPATIAL
//~                     if((propertyInput.propertyValueType == PropertyValueType.TwoD_SPATIAL) || (propertyInput.propertyValueType == PropertyValueType.ThreeD_SPATIAL)){
//~                         propertyInput.setSpatialContinuousAtKey(newKeyIndex, keysAry[k].scb);
//~                         propertyInput.setSpatialAutoBezierAtKey(newKeyIndex, keysAry[k].sab);
//~                         propertyInput.setSpatialTangentsAtKey(newKeyIndex, keysAry[k].ist, keysAry[k].ost);
//~                     }
                }
        
                //We have to go back through and do roving keyframes after we have already created the inital keyframe. This is because the first and last keyframe can not be a roving key, so as we add new keyframes, we are technically on the last key each time in the loop and the code will ignore setting it as roving.
                if((propertyInput.propertyValueType == PropertyValueType.TwoD_SPATIAL) || (propertyInput.propertyValueType == PropertyValueType.ThreeD_SPATIAL)){
                    for(var r = 0; r < keysAryLength; r++){
                        propertyInput.setRovingAtKey((r+1), keysAry[r].rov);
                    }
                }
                return true;

        }
    }

    var sel = app.project.activeItem.selectedProperties;
    var keys = collectKeyframes(sel[0]);
    if(keys) {
        for (var i = 1; i < sel.length; i++) {
            transferKeyframes(sel[i], keys);
        }
    }
})()