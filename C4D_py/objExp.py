import c4d
import os
import subprocess
from c4d import gui
#Welcome to the world of Python

def main():
    
    # get active document
    doc = c4d.documents.GetActiveDocument()

    # retrieve an instance of render data
    renderSettings = doc.GetActiveRenderData()

    # retrieve fps
    docFps = doc.GetFps()
    
    # Get Animation Length
    fromTime = renderSettings[c4d.RDATA_FRAMEFROM].GetFrame(docFps)
    toTime = renderSettings[c4d.RDATA_FRAMETO].GetFrame(docFps)
    animLength = toTime - fromTime + 1
    
    # prompt user for directory
    filePath = c4d.storage.SaveDialog()
    filePath, objName = os.path.split(filePath)
    objName = objName + "_"
    filePath = filePath + "\\"
    # Check for confirmation
    questionDialogText = "Obj Sequence will be saved as:\n\n"\
        "" + filePath + objName + "####.obj\n\n"\
        "From frame " + str(fromTime) + " to " + str(toTime) + " for " + str(animLength) + " frames.\n"
    proceedBool = c4d.gui.QuestionDialog(questionDialogText)
    
    if proceedBool == True:
        
        # Loop through animation and export frames
        for x in range(0,animLength):
            
            # change frame, redraw view
            moveTime = c4d.BaseTime(fromTime,docFps) + c4d.BaseTime(x,docFps)
            doc.SetTime(moveTime)
            c4d.EventAdd(c4d.EVENT_FORCEREDRAW)
            c4d.DrawViews(c4d.DRAWFLAGS_FORCEFULLREDRAW)
            
            # progress bar
            c4d.StatusSetText("Exporting " + str(x) + " of " + str(animLength))
            c4d.StatusSetBar(100.0*x/animLength)
            
            # add buffer 0001
            bufferedNumber = str(doc.GetTime().GetFrame(docFps))
            if len(bufferedNumber)<4:
                for x in range(len(bufferedNumber),4):
                    bufferedNumber = "0" + bufferedNumber
            
            #save file   
            fileName = filePath+objName+bufferedNumber+".obj"
            print fileName
            c4d.documents.SaveDocument(doc,fileName,c4d.SAVEDOCUMENTFLAGS_DONTADDTORECENTLIST,c4d.FORMAT_OBJEXPORT)
        
    else: print "User directed cancel"
        
    c4d.StatusClear()
    
    # ask to open containing folder
    viewFilesBool = c4d.gui.QuestionDialog("Do you want to open containing folder?")
    if viewFilesBool == True:
        ('explorer "C:\path\of\folder"')
        subprocess.Popen('explorer ' + '"' + filePath + '"' )
    else:
        return None
    
    
if __name__=='__main__':
    main()