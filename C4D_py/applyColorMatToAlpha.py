"""Name-US: Apply Color Texture to Alpha
Description-US: Duplicates the shader in the color channel into the alpha channel for all materials in scene.
"""

import c4d
from c4d import gui

def main():
    doc.StartUndo()
    materials = doc.GetActiveMaterials()
    if not materials:
        materials = doc.GetMaterials()

    for mat in materials:
        if mat.GetType() == c4d.Mmaterial:
            doc.AddUndo(c4d.UNDOTYPE_CHANGE, mat)

            texture = mat[c4d.MATERIAL_LUMINANCE_SHADER]
            if texture is not None:
                alpha_texture = texture.GetClone()
                mat.InsertShader(alpha_texture)
                mat[c4d.MATERIAL_COLOR_SHADER] = alpha_texture
            mat.Message(c4d.MSG_UPDATE)
    doc.EndUndo()
    c4d.EventAdd()
if __name__=='__main__':
    main()
