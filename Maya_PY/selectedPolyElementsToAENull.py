## makes one locator with custom prefix per selected face | vertex

import maya.cmds as cmds
import maya.mel as mel
locaPrefix = "010_text02_center"
nullPrefix = "null_" ### DON'T TOUCH ###
sel = cmds.ls(sl=True)
vertices = cmds.filterExpand(sel, sm=31) or []
faces = cmds.filterExpand(sel, sm=34) or []
edges = cmds.filterExpand(sel, sm=32) or []
selectedElements = []
if len(faces):
    selectedElements = faces
elif len(vertices):
    selectedElements = vertices
elif len(edges):
    selectedElements = edges
counter = 1
for obj in selectedElements:
    tempNull = cmds.spaceLocator(name=nullPrefix+locaPrefix+str(counter))
    cmds.select(obj, r=True)
    cmds.select(tempNull,add=True)
    mel.eval('doCreatePointOnPolyConstraintArgList 2 {   "0" ,"0" ,"0" ,"1" ,"" ,"1" ,"0" ,"0" ,"0" ,"0" };')
    counter += 1 
