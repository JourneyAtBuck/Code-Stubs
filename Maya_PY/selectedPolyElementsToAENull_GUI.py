## makes one locator with custom prefix per selected face | vertex

import maya.cmds as cmds
import maya.mel as mel
import functools

def createUI( pWindowTitle , pApplyCallback ):
    windowID = 'locatorRivet'
    
    if cmds.window( windowID, exists=True):
        cmds.deleteUI(windowID)

    cmds.window('locatorRivet', title = 'Locator Rivet Tool', sizeable=True, resizeToFitChildren=True )

    cmds.rowColumnLayout( numberOfColumns = 2, columnWidth= [(1,80), (2,150)], columnOffset=[(1,'right',2)] )

    cmds.text(label='Locator name')

    userNamer = cmds.textField( text = 'nameHere')
    
    cmds.separator(h=10, style='none')
    cmds.separator(h=10, style='none')
    cmds.separator(h=10, style='none')
    cmds.separator(h=10, style='none')

    cmds.button (label = 'Do It', command = functools.partial(pApplyCallback, userNamer ))

    cmds.showWindow()


def applyCallback( pUserNamer, *pArgs ):
    locaPrefix = cmds.textField(pUserNamer, query=True, text=True)
    nullPrefix = "null_"
    sel = cmds.ls(sl=True)
    vertices = cmds.filterExpand(sel, sm=31) or []
    faces = cmds.filterExpand(sel, sm=34) or []
    selectedElements = []
    if len(faces):
        selectedElements = faces
    elif len(vertices):
        selectedElements = vertices
    counter = 1
    for obj in selectedElements:
        tempNull = cmds.spaceLocator(name=nullPrefix+locaPrefix+str(counter))
        cmds.select(obj, r=True)
        cmds.select(tempNull,add=True)
        mel.eval('doCreatePointOnPolyConstraintArgList 2 {   "0" ,"0" ,"0" ,"1" ,"" ,"1" ,"0" ,"0" ,"0" ,"0" };')
        counter += 1
    
    
createUI ('Locator Rivet Tool', applyCallback)
