"""Name-US: Copy Color Channel to Alpha Channel
Description-US: Copies shader in color channel to the alpha channel for all selected materials.

Written so that I could easily convert baked luminance (created with the Bake Object command) to the
Alpha channel.
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
        shader = mat[c4d.MATERIAL_COLOR_SHADER]
        if shader is None:
            continue

        doc.AddUndo(c4d.UNDOTYPE_CHANGE, mat)
        shader_clone = shader.GetClone()
        mat.InsertShader(shader_clone)
        mat[c4d.MATERIAL_ALPHA_SHADER] = shader_clone

    doc.EndUndo()

if __name__=='__main__':
    main()