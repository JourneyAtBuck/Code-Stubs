    #target Illustrator  
       
    // script.name = relinkAllSelected.jsx;  
    // script.description = relinks all selected placed images at once;  
    // script.required = select at least one linked image before running;  
    // script.parent = CarlosCanto // 7/12/11;  
    // script.elegant = false;  
       
    var idoc = app.activeDocument;  
    sel = idoc.selection;  
    if (sel.length>0)  
         {  
              var file = File.openDialog ("open file");  
              for (i=0 ; i<sel.length ; i++ )  
                   {  
                       if (sel[i].typename == "PlacedItem")  
                            {  
                                var iplaced = sel[i];  
                                iplaced.file = file;  
                             }  
                   }  
         }  
    else  
         {  
              alert("select at least one placed item before running");  
         }  