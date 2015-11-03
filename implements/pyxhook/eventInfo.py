"""
A simple example of hooking the keyboard on Linux using pyxhook

Any key pressed prints out the keys values, program terminates when spacebar is pressed
"""

#Libraries we need
import pyxhook
import time

def callbackDefault(event):
    pass
    #print event
#cb=callbackDefault
#This function is called every time a key is presssed
def msevent( event  ):
    #print key info
    #pyxhook.x+=1
    #print pyxhook.x
    cb (event)

#This function is called every time a key is presssed
def kbevent( event ):
    #print key info
    #pyxhook.x+=1
    cb (event)
    
    #If the ascii value matches spacebar, terminate the while loop
    if event.Ascii == 32:
        global running
        running = False

def run(callback):
    
    global cb
    cb=callback
    #Create hookmanager
    hookman = pyxhook.HookManager()
    #Define our callback to fire when a key is pressed down
    hookman.KeyDown = kbevent
    hookman.KeyUp=kbevent
    #define mouse event
    hookman.MouseAllButtonsDown=msevent
    hookman.MouseAllButtonsUp=msevent
    hookman.MouseMove=msevent
    hookman.HookMouse()
    #Hook the keyboard
    hookman.HookKeyboard()
    #Start our listener
    hookman.start()
        
    #Create a loop to keep the application running
    running = True
    #i=0;
    while running:
        pass
        '''i+=1
        time.sleep(0.1)
        if (i==10):
            running=False'''
    #Close the listener when we are done
    hookman.cancel()
