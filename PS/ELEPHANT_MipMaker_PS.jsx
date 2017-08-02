 function ELEPHANT_MipMaker() {
    var scriptPath = Folder(File($.fileName).parent);
    var counter = 0;
    
    var doc = app.activeDocument;
    var cleanName = doc.name.replace(/\.[^\.]+$/, '');
    var newFileName = cleanName.substr(0,cleanName.indexOf("_")); 
    
    // function to create iterated sizes of existing image, creates folder for asset, then creates multiple sized pngs in that folder
    function ELEPHANT_MipMaker(inGrp,fldr) {


        var resArray = [320,160,96,64,48,40,32,20];
        var mipMaps = resArray.length;
        
        var grp = doc.layerSets.getByName(inGrp);
        var lyr = grp.artLayers[0];
        var id21 = app.stringIDToTypeID( "placedLayerEditContents" );
        var desc7 = new ActionDescriptor();
        doc.activeLayer = lyr;
        executeAction( id21, desc7, DialogModes.NO ); // opens selected smart object for editing
        smartObj = app.activeDocument;

        var fPath = fldr.fsName;
        var fName = fldr.name;
    
        for (var i = 0; i<mipMaps; i++) {
            //Folder to create in the chosen parent folder
            var currSize = resArray[i];
            
            var PNGname = newFileName+"-"+currSize+"px.png";

            //duplicate active document
            var tempDoc = smartObj.duplicate(doc.name+currSize.toString(),true);   
     
            tempDoc.resizeImage(UnitValue(currSize,"px"),null,null,ResampleMethod.BICUBIC);

            // our web export options
            var options = new ExportOptionsSaveForWeb();
            options.format = SaveDocumentType.PNG;
            options.PNG8 = false;
            options.quality = 100;
            options.transparency = true;
            tempDoc.exportDocument(File(fPath+'/'+PNGname),ExportType.SAVEFORWEB,options);
            
            tempDoc.close(SaveOptions.DONOTSAVECHANGES);
            counter++;
        }       
        smartObj.close(SaveOptions.DONOTSAVECHANGES);
    }
    var dest = scriptPath.parent.selectDlg("Select destination folder.");  

    if (!dest) {
        return alert("Please select a destination folder to export files.");}

    else {
        var destFolder = Folder(dest+"/"+cleanName.split("_")[0]+"-"+cleanName.split("_")[1]);
        if (!destFolder.exists) {
            destFolder.create();
        }
        ELEPHANT_MipMaker("320px",destFolder);
    }
    return alert(counter.toString()+" images extracted.");
  
}
ELEPHANT_MipMaker();