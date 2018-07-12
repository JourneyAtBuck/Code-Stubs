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
            texture = mat[c4d.MATERIAL_COLOR_SHADER]
            alpha_texture = texture.GetClone()
            mat.InsertShader(alpha_texture)
            mat[c4d.MATERIAL_ALPHA_SHADER] = alpha_texture
    doc.EndUndo()
if __name__=='__main__':
    main()
