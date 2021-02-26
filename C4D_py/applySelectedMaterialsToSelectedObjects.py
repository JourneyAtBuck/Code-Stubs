import c4d
from c4d import gui

def main():
    objs = doc.GetActiveObjects(2)
    if not objs:
        gui.MessageDialog('Please select some objects!')    
        return
    mats = doc.GetActiveMaterials()
    if not mats:
        gui.MessageDialog('Please select some materials!')    
        return
    n,l = 0,len(mats)
    doc.StartUndo()
    for obj in objs:
        n %= l
        tag = obj.MakeTag(c4d.Ttexture,obj.GetTags()[-1])
        doc.AddUndo(c4d.UNDOTYPE_NEW,tag)
        tag.SetMaterial(mats[n])
        n += 1
    
    doc.EndUndo()
        
if __name__=='__main__':
    main()