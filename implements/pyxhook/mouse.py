#!/usr/bin/python
#-*- coding: utf-8 -*-

# name: smartmouse.py
# useage: 
#       1) 记录鼠标轨迹
#           python smartmouse.py -r <record time> <storage file>
#       2) 重放鼠标轨迹
#           python smartmouse.py -p <storage file>
#
# coded by xiooli<xioooli[at]yahoo.com.cn>
# 2009.10.17

import Xlib.display as ds
import Xlib.X as X
import Xlib.ext.xtest as xtest
import time as tm

class mouse():
    '''mouse class which contains couple of mouse methods'''
    def __init__(self):
        self.display = ds.Display()

    def mouse_press(self,button):
        '''button= 1 left, 2 middle, 3 right, 4 middle up, 5 middle down'''
        xtest.fake_input(self.display,X.ButtonPress, button)
        self.display.sync()
    def mouse_release(self,button):
        '''button= 1 left, 2 middle, 3 right, 4 middle up, 5 middle down'''
        xtest.fake_input(self.display,X.ButtonRelease, button)
        self.display.sync()
    def mouse_click(self,button):
        '''button= 1 left, 2 middle, 3 right, 4 middle up, 5 middle down'''
        self.mouse_press(button)
        self.mouse_release(button)
    def mouse_move(self,button):
        pass

    def goto_xy(self,x, y):
        '''move to position x y'''
        xtest.fake_input(self.display, X.MotionNotify, x = x, y = y)
        self.display.flush()

    def pos(self):
        '''get mouse position'''
        coord = self.display.screen().root.query_pointer()._data
        return (coord["root_x"],coord["root_y"])
    
    def screen_size(self):
        '''get screen size'''
        width = self.display.screen().width_in_pixels
        height = self.display.screen().height_in_pixels
        return (width,height)

i=0
def elapse():
    '''get elapse time, gap is 0.1 second'''
    global i
    i+=0.1
    return i

def simulateEvent(event):
    xPos=event["Position"][0]
    yPos=event["Position"][1]
    ActionID=event["Action"][0]
    ActionName=event["Action"][1]
    m=mouse()
    EVDIC={ "press":m.mouse_press, 
            "release":m.mouse_release, 
            "move":m.mouse_move,
            "click":m.mouse_click, 
            "sleep":tm.sleep }
    m.goto_xy(int(xPos),int(yPos))
    if ActionName and ActionID:
        if ActionName != "sleep":
            EVDIC[ActionName](int(ActionID))
        else:
            EVDIC[ActionName](float(ActionID))

if __name__ == '__main__':
    import sys
    import time as tm

    t=0
    m=mouse()
    EVDIC={ "press":m.mouse_press, 
            "release":m.mouse_release, 
            "click":m.mouse_click, 
            "sleep":tm.sleep }
    pos_x,pos_y=sys.argv[1],sys.argv[2]
    ev=sys.argv[3]
    tLen=sys.argv[4]
    m.goto_xy(int(pos_x),int(pos_y))
    if ev and tLen:
        if ev != "sleep":
            EVDIC[ev](int(tLen))
        else:
            EVDIC[ev](float(tLen))
    tm.sleep(0.1)   
            
            