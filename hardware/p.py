import time
import RPi.GPIO as GPIO
import board
import busio
import adafruit_vl53l0x
import adafruit_tca9548a

# Set up I2C bus
i2c = busio.I2C(board.SCL, board.SDA)
GPIO.setmode(GPIO.BCM)

RELAY_1=0
RELAY_2=0
RELAY_3=0
RELAY_4=0

GPIO.setup(RELAY_1,GPIO.OUT)
GPIO.setup(RELAY_2,GPIO.OUT)
GPIO.setup(RELAY_3,GPIO.OUT)
GPIO.setup(RELAY_4,GPIO.OUT)

MOTOR_1_FORWARD = 0
MOTOR_2_FORWARD = 0
MOTOR_1_BACKWARD = 0
MOTOR_2_BACKWARD = 0

GPIO.setup(MOTOR_2_FORWARD,GPIO.OUT)
GPIO.setup(MOTOR_1_BACKWARD,GPIO.OUT)
GPIO.setup(MOTOR_1_FORWARD,GPIO.OUT)
GPIO.setup(MOTOR_2_BACKWARD,GPIO.OUT)

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

def make_Drink():
    distance = sensor0.range

    if(distance > 32):
        print("cup is ready")

        GPIO.output(MOTOR_1_FORWARD, True)
        GPIO.output(MOTOR_2_FORWARD, True)
        GPIO.output(MOTOR_1_BACKWARD, False)
        GPIO.output(MOTOR_2_BACKWARD, False)

        time.sleep(3)

        
        GPIO.output(MOTOR_1_FORWARD, False)
        GPIO.output(MOTOR_2_FORWARD, False)
        GPIO.output(MOTOR_1_BACKWARD, False)
        GPIO.output(MOTOR_2_BACKWARD, False)

        time.sleep(1)

        GPIO.output(RELAY_2, True)

        time.sleep(3)

        GPIO.output(RELAY_2, False)









while True:
    # Get distance measurements from both sensors
    # distance0 = sensor0.range
    # distance1 = sensor1.range
    # distance2 = sensor2.range
    # distance3 = sensor3.range
    
    # Read data from the Arduino Nano 33 IoT over I2C
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
