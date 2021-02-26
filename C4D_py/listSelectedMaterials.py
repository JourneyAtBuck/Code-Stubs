import c4d
from c4d import gui

def main():
    matList = []
    materials = doc.GetActiveMaterials()

    if not materials:
        return

    for mat in materials:
        matList.append(mat.GetName())
        
    print '\n'.join(map(str, matList))
    print len(matList)

if __name__=='__main__':
    main()