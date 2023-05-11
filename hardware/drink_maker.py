import RPi.GPIO as GPIO
import time
import time
import board
import busio
import board
from digitalio import DigitalInOut
from adafruit_vl53l0x import VL53L0X

i2c = board.I2C()  
sensor = VL53L0X(i2c)
vl=[]
GPIO.setmode(GPIO.BCM)

CUP_PRESENT=16

UNIT_MOVEMENT = 0

#lidar sensor SHDN pins

RELAY_1=0
RELAY_2=0
RELAY_3=0
RELAY_4=0

MOTOR_1_FORWARD = 0
MOTOR_2_FORWARD = 0
MOTOR_1_BACKWARD = 0
MOTOR_2_BACKWARD = 0

GPIO.setup(MOTOR_2_FORWARD,GPIO.OUT)
GPIO.setup(MOTOR_1_BACKWARD,GPIO.OUT)
GPIO.setup(MOTOR_1_FORWARD,GPIO.OUT)
GPIO.setup(MOTOR_2_BACKWARD,GPIO.OUT)

GPIO.setup(RELAY_1,GPIO.OUT)
GPIO.setup(RELAY_2,GPIO.OUT)
GPIO.setup(RELAY_3,GPIO.OUT)
GPIO.setup(RELAY_4,GPIO.OUT)

#dictionary of recipes with dictionary of each cocktail
#this means - sample recipe has drinks 1,2,3,4 in the order of 2,1,3,4 
#in quantity of 1x, 2x, 4x, 3x, where x is out unit, which we shall decide

def order(order):
    if(initial()==False):
        while(find_cup() == 0):
            pass 
        move_to(find_cup(), 1)
    make_drink(order[0])

    time.sleep(4)
    
    if(order[1]!=0):
        while(find_cup() == 0):
            pass 
        move_to(find_cup(), 1)
        make_drink(order[1])

def find_cup():
    if(cup_is_present(1) == True):
        return 1
    elif(cup_is_present(2) == True):
        return 2
    elif(cup_is_present(3) == True):
        return 3
    elif(cup_is_present(4) == True):
        return 4
    else:
        return 0

def cup_is_present(i):
    if(i==1):
        if(lidar(1) < CUP_PRESENT):
            return True
        else:
            return False
    elif(i==2):
        if(lidar(2) < CUP_PRESENT):
            return True
        else:
            return False
    elif(i==3):
        if(lidar(3) < CUP_PRESENT):
            return True
        else:
            return False
    elif(i==4):
        if(lidar(4) < CUP_PRESENT):
            return True
        else:
            return False
   
def initial():
    if(cup_is_present(1) == True):
        return True
    else:
        return False

def move_to(i,f):
    time.sleep(0.5)
    if(f>i):
        GPIO.output(MOTOR_1_FORWARD, True)
        GPIO.output(MOTOR_2_FORWARD, True)
        GPIO.output(MOTOR_1_BACKWARD, False)
        GPIO.output(MOTOR_2_BACKWARD, False)
        time.sleep(UNIT_MOVEMENT*(f-i))
        GPIO.output(MOTOR_1_FORWARD, False)
        GPIO.output(MOTOR_2_FORWARD, False)
        GPIO.output(MOTOR_1_BACKWARD, False)
        GPIO.output(MOTOR_2_BACKWARD, False)

    elif(f<i):
        GPIO.output(MOTOR_1_FORWARD, False)
        GPIO.output(MOTOR_2_FORWARD, False)
        GPIO.output(MOTOR_1_BACKWARD, True)
        GPIO.output(MOTOR_2_BACKWARD, True)
        time.sleep(UNIT_MOVEMENT*(i-f))
        GPIO.output(MOTOR_1_FORWARD, False)
        GPIO.output(MOTOR_2_FORWARD, False)
        GPIO.output(MOTOR_1_BACKWARD, False)
        GPIO.output(MOTOR_2_BACKWARD, False)

def dispense(nozzle,i):
    time.sleep(0.5)
    if(nozzle==1):
        GPIO.ouput(RELAY_1,True)
        time.sleep(i)
        GPIO.output(RELAY_1,False)
    elif(nozzle==2):
        GPIO.output(RELAY_2, True)
        time.sleep(i)
        GPIO.output(RELAY_2,False)
    elif(nozzle==3):
        GPIO.output(RELAY_3,True)
        time.sleep(i)
        GPIO.output(RELAY_3,False)
    elif(nozzle==4):
        GPIO.output(RELAY_4,True)
        time.sleep(i)
        GPIO.output(RELAY_4,False)

def lidar(lidar):
    distance = vl[lidar].range
    print("Distance: {} mm".format(distance))
    time.sleep(0.1)
    return 0

def make_drink(i):
    initial = 1
    for drink in i:
        time.sleep(1.5)
        move_to(initial,drink[0])
        initial=drink[0]
        time.sleep(1)
        
        while(cup_is_present(drink[0])==False):
            pass
        
        # dispense(drink[0],drink[1])
        time.sleep(2)
        
        s = ""
        s+=str(drink[0]) + "," + str(drink[1])

        dispense(drink)
        time.sleep(0.5)
       
    move_to(initial,1)#delivery   
