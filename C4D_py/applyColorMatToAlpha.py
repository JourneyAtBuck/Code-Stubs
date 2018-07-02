import c4d
from c4d import gui
#Welcome to the world of Python


def main():
    doc.StartUndo()
    materials = doc.GetMaterials()
    for mat in materials:
        if mat.GetType() == 5703:
            filter_shader = c4d.BaseShader(1011128)
            texture = mat[c4d.MATERIAL_COLOR_SHADER]
            mat[c4d.MATERIAL_ALPHA_SHADER] = texture
    doc.EndUndo()
if __name__=='__main__':
    main()
