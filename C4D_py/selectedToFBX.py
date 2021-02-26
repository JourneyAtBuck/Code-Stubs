import c4d
from c4d import gui,storage
    
def main():
    fbx_plugin_id = 1026370
    path=c4d.storage.SaveDialog(c4d.FILESELECTTYPE_ANYTHING,"Export FBX","")
    if not path:return
    if path=="":return
    container = c4d.plugins.GetWorldPluginData(fbx_plugin_id)
    doc = c4d.documents.GetActiveDocument()
    selected = doc.GetActiveObjects(0)
    
    index = 0
    
    for ob in selected:
        obIndex = selected.index(ob)
        obName = ob.GetName()
        savePath = path+"index"+str(obIndex)+"_"+obName
        c4d.CallCommand(100004767, 100004767) #Deselect All
        for remOb in selected:
            remObName = remOb.GetName()
            if remObName!=obName:
                doc.SetActiveObject(remOb, mode=c4d.SELECTION_ADD)
        c4d.CallCommand(100004787) # Delete Active Objects
        c4d.CallCommand(12168, 12168) # Remove Unused Materials
        c4d.plugins.SetWorldPluginData(fbx_plugin_id, container)
        #print "saving to: " + savePath
        c4d.documents.SaveDocument(doc, savePath, c4d.SAVEDOCUMENTFLAGS_DONTADDTORECENTLIST, fbx_plugin_id)

        c4d.CallCommand(12105, 12105) # Undo remove unused mats
        c4d.CallCommand(12105, 12105) # Undo delete other objects

if __name__=='__main__':
    main()