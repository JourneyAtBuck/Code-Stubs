## makes one locator per selected locator with generated prefix based on namespace
## this is used for exporting bezier warp data for After Effects from the page.mb asset

import maya.cmds as cmds
import maya.mel as mel

nullPrefix = "null_" ### DON'T TOUCH ###
selectedElements = cmds.ls(sl=True, type="transform")
counter = 1
for obj in selectedElements:
    if (not "constraint" in obj.lower()):
        nameArray = obj.split(":",1)
        locaPrefix = nameArray[0]+"_"+nameArray[1].split("_",1)[1]
        tempNull = cmds.spaceLocator(name=nullPrefix+locaPrefix)
        cmds.parentConstraint(obj, tempNull, mo=False)
        counter += 1 
