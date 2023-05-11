const net = require('net');

// Replace "raspberry-pi-ip-address" with the IP address of your Raspberry Pi
const client = net.connect({ host: '192.169.1.6', port: 3000 }, () => {
  console.log('Connected to Raspberry Pi!');

  // Replace this with the data you want to send to your Raspberry Pi
  const data = {
    message: 'Hello, Raspberry Pi!'
  };

  // Send the data to your Raspberry Pi
  client.write(JSON.stringify(data));
});

// Handle incoming data from the Raspberry Pi
client.on('data', (data) => {
  console.log(`Received data from Raspberry Pi: ${data}`);
});

// Handle errors
client.on('error', (err) => {
  console.error(err);
});

// Handle the connection closing
client.on('end', () => {
  console.log('Disconnected from Raspberry Pi');
});
