import time
import RPi.GPIO as GPIO
import board
import busio
import adafruit_vl53l0x
import adafruit_tca9548a

# Set up I2C bus
i2c = busio.I2C(board.SCL, board.SDA)
GPIO.setmode(GPIO.BCM)


recipes = {"1":{"2","4"}, "2":{"1","3"}}

RELAY_1=14
RELAY_2=15
RELAY_3=22
RELAY_4=23

GPIO.setup(RELAY_1,GPIO.OUT)
GPIO.setup(RELAY_2,GPIO.OUT)
GPIO.setup(RELAY_3,GPIO.OUT)
GPIO.setup(RELAY_4,GPIO.OUT)

MOTOR_1_FORWARD = 25
MOTOR_2_FORWARD = 8

GPIO.setup(MOTOR_2_FORWARD,GPIO.OUT)
GPIO.setup(MOTOR_1_FORWARD,GPIO.OUT)

# Set up mux with default address
mux = adafruit_tca9548a.TCA9548A(i2c, address=0x70)

# Set up VL53L0X sensors on mux channels 0 and 1
sensor0 = adafruit_vl53l0x.VL53L0X(mux[0])
sensor1 = adafruit_vl53l0x.VL53L0X(mux[1])
sensor2 = adafruit_vl53l0x.VL53L0X(mux[2])
sensor3 = adafruit_vl53l0x.VL53L0X(mux[3])

# Set up I2C bus for communication with Arduino
arduino_i2c = busio.I2C(board.SCL, board.SDA)

# Set the address of the Arduino Nano 33 IoT on the mux
arduino_address = 0x08
mux.select_channel(4)

def make_Drink(dats):
    distance = sensor0.range
    drink = recipes[dats]

    if(distance > 32):
        
        print("cup is ready")

        GPIO.output(MOTOR_1_FORWARD, True)
        GPIO.output(MOTOR_2_FORWARD, True)

        time.sleep(drink[0]-1)

        GPIO.output(MOTOR_1_FORWARD, False)
        GPIO.output(MOTOR_2_FORWARD, False)

        time.sleep(1)

        GPIO.output(RELAY_2, True)

        time.sleep(6)

        GPIO.output(RELAY_2, False)
        time.sleep(1)

        GPIO.output(MOTOR_1_FORWARD, True)
        GPIO.output(MOTOR_2_FORWARD, True)

        time.sleep(drink[1]-1)

        GPIO.output(MOTOR_1_FORWARD, False)
        GPIO.output(MOTOR_2_FORWARD, False)

        GPIO.output(RELAY_3, True)

        time.sleep(6)

        GPIO.output(RELAY_3, False)
        time.sleep(1)









while True:
    mux.select_channel(4)
    
    arduino_data = arduino_i2c.readfrom(arduino_address, 4)

    if arduino_i2c.try_lock():
        try:
            if arduino_i2c.available(4):
                arduino_data = arduino_i2c.readfrom(arduino_address, 4)
                print("Arduino", arduino_data)

                make_Drink(arduino_data)

                # Perform certain task with arduino data here
        finally:
            arduino_i2c.unlock()
    

    time.sleep(1)
