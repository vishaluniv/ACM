import smbus2
import time

# Set I2C bus
bus = smbus2.SMBus(1)

# Set Arduino Nano 33 IoT address
address = 0x08

# Read integer value from Arduino Nano 33 IoT
received_data = bus.read_byte(address)

# Print received data
print("Received:", received_data)

