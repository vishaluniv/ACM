import time
import board
import busio
import adafruit_vl53l0x
import adafruit_tca9548a

# Set up I2C bus
i2c = busio.I2C(board.SCL, board.SDA)

# Set up mux with default address
mux = adafruit_tca9548a.TCA9548A(i2c, address=0x70)

# Set up VL53L0X sensors on mux channels 0 and 1
sensor0 = adafruit_vl53l0x.VL53L0X(mux[0])
sensor1 = adafruit_vl53l0x.VL53L0X(mux[1])
sensor2 = adafruit_vl53l0x.VL53L0X(mux[2])
sensor3 = adafruit_vl53l0x.VL53L0X(mux[3])

while True:
    # Get distance measurements from both sensors
    distance0 = sensor0.range
    #distance1 = sensor1.range
    
    # Print the measurements
    print("Sensor 0: {}mm".format(distance0))
    #print("Sensor 1: {}mm".format(distance1))

    # Wait for a short period before taking another measurement
    time.sleep(1.)


