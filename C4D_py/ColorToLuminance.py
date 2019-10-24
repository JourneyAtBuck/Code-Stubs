"""Name-US: Copy Color Channel to Luminance Channel
Description-US: Copies shader & color in color channel to the luminance channel for all selected materials.
"""

import c4d
from c4d import gui

def main():
    materials = doc.GetActiveMaterials()
    if not materials:
        materials = doc.GetMaterials()
    if not materials:
        return

    doc.StartUndo()

    for mat in materials:
        doc.AddUndo(c4d.UNDOTYPE_CHANGE, mat)

        shader = mat[c4d.MATERIAL_COLOR_SHADER]
        if shader is not None:
            shader_clone = shader.GetClone()
            mat.InsertShader(shader_clone)
            mat[c4d.MATERIAL_LUMINANCE_SHADER] = shader_clone
            mat[c4d.MATERIAL_LUMINANCE_TEXTUREMIXING] = mat[c4d.MATERIAL_COLOR_TEXTUREMIXING]
            mat[c4d.MATERIAL_LUMINANCE_TEXTURESTRENGTH] = mat[c4d.MATERIAL_COLOR_TEXTURESTRENGTH]

        mat[c4d.MATERIAL_LUMINANCE_COLOR] = mat[c4d.MATERIAL_COLOR_COLOR]

        mat[c4d.MATERIAL_USE_COLOR] = False
        mat[c4d.MATERIAL_USE_LUMINANCE] = True

    doc.EndUndo()
    c4d.EventAdd()

if __name__=='__main__':
    main()