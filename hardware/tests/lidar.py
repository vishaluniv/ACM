import time
import board
import busio
import adafruit_vl53l3cx

# Initialize I2C bus and sensor
i2c = busio.I2C(board.SCL, board.SDA)
sensor = adafruit_vl53l3cx.VL53L3CX(i2c)

# Main loop to measure distance
while True:
    try:
        # Get distance measurement in millimeters
        distance = sensor.range

        # Print distance to console
        print("Distance: {} mm".format(distance))

        # Wait for 0.1 seconds before taking the next measurement
        time.sleep(0.1)

    except KeyboardInterrupt:
        # Stop the loop when user presses Ctrl-C
        break

