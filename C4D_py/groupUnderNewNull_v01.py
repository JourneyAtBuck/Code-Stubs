import c4d
from c4d import documents

def GetGlobalPosition(obj):
    """
    Returns the global position of obj
    """
    return obj.GetMg().off

def SetGlobalPosition(obj, pos):
    """
    Sets the global position of obj to pos
    """
    m = obj.GetMg()
    m.off = pos
    obj.SetMg(m)
 
def main():
    doc.StartUndo()
    s = doc.GetSelection()
    if s:
        for i in s:
            null = c4d.BaseObject(c4d.Onull)
            doc.InsertObject(null)
            doc.AddUndo(c4d.UNDOTYPE_NEW, null)
            
            doc.AddUndo(c4d.UNDOTYPE_CHANGE, null)
            SetGlobalPosition(null, GetGlobalPosition(i))
            doc.AddUndo(c4d.UNDOTYPE_CHANGE, i)
            SetGlobalPosition(i, c4d.Vector(0,0,0))
            doc.AddUndo(c4d.UNDOTYPE_CHANGE, i)
            i.InsertUnder(null)
    doc.EndUndo()
    c4d.EventAdd()
     
    
if __name__ == '__main__':
    main()