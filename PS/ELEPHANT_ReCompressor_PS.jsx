 function ELEPHANT_convertFolder() {
     
     /* 
     * Create a progress window 
     * @param  {String}  title           = title 
     * @param  {String}  message         = message (updatable) 
     * @param  {Boolean} hasCancelButton = add a Cancel button (default: false) 
     * @usage w = new createProgressWindow "Title", "Message", true 
     */  
    var createProgressWindow;  

    createProgressWindow = function(title, message, hasCancelButton) {  
      var win;  
      if (title == null) {  
        title = "Progress";  
      }  
      if (message == null) {  
        message = "Please wait...";  
      }  
      if (hasCancelButton == null) {  
        hasCancelButton = false;  
      }  
      win = new Window("palette", "" + title, undefined);  
      win.bar = win.add("progressbar", {  
        x: 20,  
        y: 12,  
        width: 300,  
        height: 20  
      }, 0, 100);  
      win.stMessage = win.add("statictext", {  
        x: 10,  
        y: 36,  
        width: 320,  
        height: 20  
      }, "" + message);  
      win.stMessage.justify = 'center';  
      if (hasCancelButton) {  
        win.cancelButton = win.add('button', undefined, 'Cancel');  
        win.cancelButton.onClick = function() {  
          return win.exception = new Error('Conversion canceled.');  
        };  
      }  
      this.reset = function(message) {  
        win.bar.value = 0;  
        win.stMessage.text = message;  
        return win.update();  
      };  
      this.updateProgress = function(perc, message) {  
        if (win.exception) {  
          win.close();  
          throw win.exception;  
        }  
        if (perc != null) {  
          win.bar.value = perc;  
        }  
        if (message != null) {  
          win.stMessage.text = message;  
        } 
        $.sleep(50); // wait a short moment to allow user interaction
        return win.update();  
      };  
      this.close = function() {  
        return win.close();  
      };  
      win.center(win.parent);  
      return win.show();  
    };  
     //progress bar window
     

    var scriptPath = Folder(File($.fileName).parent);
    var counter = 0;
    
    // function to create iterated sizes of existing image, creates folder for asset, then creates multiple sized pngs in that folder
    function ELEPHANT_converter(img, fldr) {

        var doc =  app.open(img);

        var fPath = fldr.fsName;
        
        // our web export options
        var options = new ExportOptionsSaveForWeb();
        options.format = SaveDocumentType.PNG;
        options.PNG8 = false;
        options.quality = 100;
        options.transparency = true;
        doc.exportDocument(File(fPath+'/'+img.name),ExportType.SAVEFORWEB,options);


    }

   var startFldrPath= scriptPath.selectDlg("Select folder to extract.");
    if (!startFldrPath) {
        return alert("Please select a folder before running this script.");}

    var dest = startFldrPath.parent.parent.parent.selectDlg("Select destination folder.");  

    if (!dest) {
        return alert("Please select a destination folder to export files.");}
    var imgs = startFldrPath.getFiles("*.png");
    var numImgs = imgs.length;
    if (numImgs) {
        try {
        var w = new createProgressWindow("Please Wait", "Converting "+numImgs+" images. Press Esc key to cancel.", false);  
 
        for (var l = 0; l<numImgs; l++) {
            
            ELEPHANT_converter (imgs[l],dest);
            app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
            w.updateProgress((l/numImgs)*100);
            counter = l;
        }
        w.close();
        } catch (e) {
            return alert("Conversion canceled");
        }
    } else {
        return alert("Please select a folder with PNG images in it.");
    }

    return alert("Converted "+counter.toString()+" images.");

}
ELEPHANT_convertFolder();