
import maya.cmds as cmds
import json

#load matrix nodes
cmds.loadPlugin('matrixNodes', qt=True)


def dump(data):
    '''
    encodes python data as json data
    :param: data
    '''
    if isinstance(data, dict):
        return json.dumps(data, sort_keys=True, indent=4)
    else:
        raise TypeError('{0} must be dict() type'.format(data))

def save(data, filepath=None):
    '''
    saves data out to a json file
    :param: data
    :param: filepath
    '''
    f = open(filepath, 'w')
    new_data = dump(data)
    f.write(new_data)
    f.close()
    return filepath

def load(filepath):
    '''
    loads json data
    :param: filepath
    :return: data
    '''
    f = open(filepath, 'r')
    data = json.loads(f.read())
    f.close()
    return data

def createSSLocator(tag, camera):
    #check if camera exists
    if not cmds.objExists(camera):
        raise RuntimeError('Camera doesn\'t exists in the scene')
    # create locator
    locator_name = tag+'_2D_loc1'
    loc = cmds.spaceLocator(name=locator_name)[0]
    loc_shape = cmds.listRelatives(loc, s=True)[0]
    cmds.setAttr(loc_shape + '.localScaleX', 0.1)
    cmds.setAttr(loc_shape + '.localScaleY', 0.1)
    cmds.setAttr(loc_shape + '.localScaleZ', 0.1)

    # add attributes
    cmds.addAttr(loc, ln='cam_x_value', at='double', dv=0, k=True)
    cmds.addAttr(loc, ln='cam_y_value', at='double', dv=0, k=True)
    #matrix_nodes
    mmn = cmds.createNode('multMatrix', name=tag+'_2D_mmn1')
    cmds.connectAttr(loc + '.worldMatrix[0]', mmn + '.matrixIn[0]')
    cmds.connectAttr(camera + '.worldInverseMatrix[0]', mmn+'.matrixIn[1]')
    dmn = cmds.createNode('decomposeMatrix', name=tag + '_2D_dmn1')
    cmds.connectAttr(mmn + '.matrixSum', dmn + '.inputMatrix')

    #add script to locator
    cmds.expression(name=tag+'_2D_exp1',
                    o=loc,
                    s='float $hfv = `camera -q -hfv '+camera+'`;\n' +
                      'float $vfv = `camera -q -vfv '+camera+'`;\n' +
                      'cam_x_value = ((('+dmn+'.otx/(-'+dmn+'.otz))/tand($hfv/2))/2.0+.5)*1920;\n' +
                      'float $y_value = ((('+dmn+'.oty/(-'+dmn+'.otz))/tand($vfv/2))/2.0+.5);\n' +
                      'cam_y_value = (-($y_value*1440)+1440)-180;')

    return loc

def getLocatorData(locator_list, frame_range):
    #create dictionary
    locator_dict = dict()
    for loc in locator_list:
        locator_dict[loc] = dict()
        locator_dict[loc]['pos2d'] = list()
    #fill dictionary
    cmds.currentTime(1)
    for i in range(frame_range[0], frame_range[1]+1):
        cmds.currentTime(i)
        for loc in locator_list:
            #get 2d attributes
            locator_dict[loc]['pos2d'].append([cmds.getAttr(loc+'.cam_x_value'), cmds.getAttr(loc+'.cam_y_value')])

    cmds.currentTime(1)

    return locator_dict

def getCornerpinData(cornerpin_list, frame_range):
    #create dictionary
    cornerpin_dict = dict()
    for cornerpin in cornerpin_list:
        cornerpin_dict[cornerpin] = dict()
        cornerpin_dict[cornerpin]['pos2d'] = list()
        cornerpin_dict[cornerpin]['locators'] = list()
        #get locators
        locators = cmds.listRelatives(cornerpin, c=True, type='transform')
        for loc in locators:
            cornerpin_dict[cornerpin]['pos2d'].append(list())
            cornerpin_dict[cornerpin]['locators'].append(loc)

    #fill dictionary
    cmds.currentTime(1)
    for f in range(frame_range[0], frame_range[1]+1):
        cmds.currentTime(f)
        for cornerpin in cornerpin_list:
            for j in range(0, len(cornerpin_dict[cornerpin]['locators'])):
                #get 2d attributes
                print f, j
                cornerpin_dict[cornerpin]['pos2d'][j].append([cmds.getAttr(cornerpin_dict[cornerpin]['locators'][j]+'.cam_x_value'), cmds.getAttr(cornerpin_dict[cornerpin]['locators'][j]+'.cam_y_value')])

    cmds.currentTime(1)

    return cornerpin_dict


#get positions of the given objects
def getPositions(objects):
    position_list = list()
    for o in objects:
        position = cmds.xform(o, ws=True, t=True, q=True)
        position_list.append(position)
    return position_list

def sortVertex(v_list, axis=(0, 1, 0)):
    vertex_data_list = list()
    v_positions = getPositions(v_list)
    for i in range(0, len(v_list)):

        v_dictionary = dict()
        v_dictionary['vtx'] = v_list[i]
        v_dictionary['position'] = v_positions[i]
        vertex_data_list.append(v_dictionary)

    sorted_v_data = list()
    if axis[0]:
        sorted_v_data = sorted(vertex_data_list, key=lambda vtx: vtx['position'][0])
    elif axis[1]:
        sorted_v_data = sorted(vertex_data_list, key=lambda vtx: vtx['position'][1])
    elif axis[2]:
        sorted_v_data = sorted(vertex_data_list, key=lambda vtx: vtx['position'][2])

    sorted_v_list = list()
    for v in sorted_v_data:
        sorted_v_list.append(v['vtx'])

    return sorted_v_list

def closestUV(mesh, transform):
    pom_node = cmds.createNode('closestPointOnMesh', name=transform+'_pom')
    cmds.connectAttr(transform+'.translate', pom_node+'.inPosition')
    cmds.connectAttr(mesh + '.worldMatrix[0]', pom_node + '.inputMatrix')
    cmds.connectAttr(mesh + '.outMesh', pom_node + '.inMesh')
    #get uv
    u = cmds.getAttr(pom_node+'.parameterU')
    v = cmds.getAttr(pom_node + '.parameterV')
    #clean pom
    cmds.delete(pom_node)
    return [u, v]

class BuckExportFBXToolUI(object):
    def __init__(self):

        self.window_name = 'SSLocator_window'

        #check if window was already created if not, create the window
        if cmds.window(self.window_name, ex=True):
            cmds.deleteUI(self.window_name)

        #delete window prefs before creating
        if cmds.windowPref(self.window_name, exists=True):
            cmds.windowPref(self.window_name, remove=True)

        cmds.window(self.window_name,
                    title='Screen Space Tool',
                    width=320,
                    sizeable=False,
                    toolbox=True,
                    menuBar=True)

        cmds.columnLayout()

        cmds.separator(width=320, height=10, hr=True, st='none')

        #camera
        cmds.rowLayout(nc=3)
        cmds.separator(width=28, hr=False)
        cmds.text(label='Camera: ')
        cmds.optionMenu('camera_option', width=205)
        cmds.setParent('..')

        cmds.separator(width=320, height=10, hr=True, st='none')

        cmds.text(label='2D Locator:', bgc=(0.2, 0.2, 0.2), width=320, height=14)

        #locator
        cmds.rowLayout(nc=3)
        cmds.separator(width=28, hr=False)
        cmds.text(label='Locator Tag: ')
        cmds.textField('tag_text', text="CV", width=185)
        cmds.setParent('..')

        cmds.button('create_loc_btn', label="Create 2D Locator", width=320, c=self.create_locator)
        cmds.button('export_loc_btn', label="Export Data (2D Locators)", width=320, c=self.export_loc_data)

        cmds.separator(width=320, height=3, hr=True, st='none')
        cmds.text(label='Face to corner pin:', bgc=(0.2, 0.2, 0.2), width=320, height=14)

        #locator
        cmds.rowLayout(nc=3)
        cmds.separator(width=28, hr=False)
        cmds.text(label='Cornerpin Tag: ')
        cmds.textField('cornerpin_tag_text', text="Face1", width=170)
        cmds.setParent('..')

        cmds.rowLayout(nc=5)
        cmds.separator(width=28, hr=False)
        cmds.text(label='Plane Axis:        ')
        cmds.radioCollection()
        cmds.radioButton('xy_radio', label='XY', sl=True)
        cmds.radioButton('xz_radio', label='XZ')
        cmds.radioButton('zy_radio', label='ZY')
        cmds.setParent('..')

        cmds.button('create_cornerpin_btn', label="Create Corner Pin", width=320, c=self.create_cornerpin)
        cmds.button('export_cornerpin_btn', label="Export Data (Corner Pins)", width=320, c=self.export_cornerpin_data)


        cmds.separator(width=320, height=3, hr=True, st='none')
        cmds.text(label='', bgc=(0.2, 0.2, 0.2), width=320, height=8)
        cmds.separator(width=320, height=5, hr=True, st='none')

        cmds.button('close_btn', label="Close", width=320, c=self.close)

        self.load_cameras()
        cmds.showWindow()

    def load_cameras(self, *args):
        cameras = cmds.ls(type='camera')
        for c in cameras:
            camera_transform = cmds.listRelatives(c, p=True)[0]
            cmds.menuItem(label=str(camera_transform), p='camera_option')

    def create_locator(self,*args):
        cam = cmds.optionMenu('camera_option', q=True,v=True)
        loc = createSSLocator(cmds.textField('tag_text', q=True, text=True), camera=cam)
        print '2D Locator Rig: "' + str(loc) + '" created and linked to camera: "' + cam + '"'

    def create_cornerpin(self,*args):
        sel = cmds.ls(sl=True)
        if sel:
            if not len(sel) == 1:
                raise RuntimeError('Selection not valid, please select one face only')
        else:
            raise RuntimeError('Selection not valid, please select a face')

        if sel[0].split('.')[1].find('f[') == -1:
            raise RuntimeError('Selection not valid, please select a face')

        #get ui data
        cam = cmds.optionMenu('camera_option', q=True, v=True)
        tag = cmds.textField('cornerpin_tag_text', q=True, text=True)

        # get vertices
        face = sel[0]
        vertices = cmds.ls(cmds.polyListComponentConversion(face, ff=True, tv=True), flatten=True)

        # get axis
        xy_rb = cmds.radioButton('xy_radio', q=True, sl=True)
        xz_rb = cmds.radioButton('xz_radio', q=True, sl=True)
        zy_rb = cmds.radioButton('zy_radio', q=True, sl=True)
        #get cornerpin order
        cornerpin_vertex = list()
        if xy_rb:
            print 'Using XY axis'
            y_sort = sortVertex(vertices, (0, 1, 0))
            x_sort = sortVertex(vertices, (1, 0, 0))

            cornerpin_vertex = list()

            for i in y_sort[2:]:
                if i in x_sort[:2]:
                    cornerpin_vertex.append(i)

            for i in y_sort[2:]:
                if i in x_sort[2:]:
                    cornerpin_vertex.append(i)

            for i in y_sort[:2]:
                if i in x_sort[:2]:
                    cornerpin_vertex.append(i)

            for i in y_sort[:2]:
                if i in x_sort[2:]:
                    cornerpin_vertex.append(i)

        if xz_rb:
            print 'Using XY axis'
            x_sort = sortVertex(vertices, (1, 0, 0))
            z_sort = sortVertex(vertices, (0, 0, 1))

            cornerpin_vertex = list()

            for i in z_sort[:2]:
                if i in x_sort[:2]:
                    cornerpin_vertex.append(i)

            for i in z_sort[:2]:
                if i in x_sort[2:]:
                    cornerpin_vertex.append(i)

            for i in z_sort[2:]:
                if i in x_sort[:2]:
                    cornerpin_vertex.append(i)

            for i in z_sort[2:]:
                if i in x_sort[2:]:
                    cornerpin_vertex.append(i)

        elif zy_rb:
            print 'Using ZY axis'
            y_sort = sortVertex(vertices, (0, 1, 0))
            z_sort = sortVertex(vertices, (0, 0, 1))

            cornerpin_vertex = list()

            for i in y_sort[2:]:
                if i in z_sort[2:]:
                    cornerpin_vertex.append(i)

            for i in y_sort[2:]:
                if i in z_sort[:2]:
                    cornerpin_vertex.append(i)

            for i in y_sort[:2]:
                if i in z_sort[2:]:
                    cornerpin_vertex.append(i)

            for i in y_sort[:2]:
                if i in z_sort[:2]:
                    cornerpin_vertex.append(i)

        print 'Sort to cornerpin order:'
        print cornerpin_vertex

        #create cornerpin_group
        cornerpin_grp = cmds.createNode('transform', name=tag+'_cornerpin_grp')

        #create 2d locators
        for i, v in enumerate(cornerpin_vertex):
            locator_tag = tag+'_cv'+str(i+1)
            loc = createSSLocator(tag=locator_tag, camera=cam)
            pos = cmds.xform(v, q=True, ws=True, t=True)
            m = v.split('.')[0]
            cmds.xform(loc, ws=True, t=pos)
            #calculate uv
            uv = closestUV(mesh=m, transform=loc)
            #create point on poly constraint
            pop = cmds.pointOnPolyConstraint(v, loc)[0]
            cmds.setAttr(pop + '.' + m + 'U0', uv[0])
            cmds.setAttr(pop + '.' + m + 'V0', uv[1])
            cmds.parent(loc, cornerpin_grp)


    def export_loc_data(self, *args):
        #get path
        filename = cmds.fileDialog2(fileMode=0, caption="Export 2D Locators Data:", ff='.json')
        if filename:
            #get export data
            fr = [int(cmds.playbackOptions(q=True, min=True)), int(cmds.playbackOptions(q=True, max=True))]
            loc_list = list()
            loc_shape_list = cmds.ls('*_2D_*', type='locator')
            for loc in loc_shape_list:
                loc_list.append(cmds.listRelatives(loc, p=True)[0])
            data = getLocatorData(loc_list, frame_range=fr)

            #print log
            print 'Writing file:'
            print filename
            print 'Frame range:'
            print fr

            # save json file
            filename = filename[0]
            save(data, filepath=filename)

    def export_cornerpin_data(self, *args):
        #get path
        filename = cmds.fileDialog2(fileMode=0, caption="Export Cornerpin Data:", ff='.json')
        if filename:
            #get export data
            fr = [int(cmds.playbackOptions(q=True, min=True)), int(cmds.playbackOptions(q=True, max=True))]
            cornerpin_list = cmds.ls('*_cornerpin_grp', type='transform')
            data = getCornerpinData(cornerpin_list, frame_range=fr)
            #print log
            print 'Writing file:'
            print filename
            print 'Frame range:'
            print fr

            # save json file
            filename = filename[0]
            save(data, filepath=filename)

    def close(self, *args):
        cmds.deleteUI(self.window_name)


def main():
    UI = BuckExportFBXToolUI()

#main()