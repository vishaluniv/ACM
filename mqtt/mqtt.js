const mqtt = require('mqtt');
const express = require('express');
const fs = require('fs')
const helmet = require("helmet");
const https = require('https');

var sslOptions = {
key: fs.readFileSync('key.pem'),
cert: fs.readFileSync('cert.pem'),
passphrase: 'qwerty'
};

const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const Pressure = require('./models/pressure');


const app = express();

mongoose.connect('mongodb+srv://deepali4843be21:KSz7kRnUi5zl8nUx@cluster0.zzg5loc.mongodb.net/myFirstDatabase', {useNewUrlParser: true, useUnifiedTopology: true });

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://code.highcharts.com/highcharts.js","https://maps.googleapis.com", "https://code.jquery.com", "https://cdnjs.cloudflare.com", "https://stackpath.bootstrapcdn.com", "https://fonts.googleapis.com"],
      connectSrc: ["'self'", "https://localhost:80", "mongodb+srv://your-mongodb-url", "https://localhost:3000"],
      frameAncestors: ["'none'"],
      "Cross-Origin-Embedder-Policy": "require-corp",
      imgSrc: ["'self'", "data:"],
      styleSrc: ["'self'","https://maxcdn.bootstrapcdn.com", "https://stackpath.bootstrapcdn.com", "https://fonts.googleapis.com", "'unsafe-inline'"],
      fontSrc: ["'self'", "https://maxcdn.bootstrapcdn.com","https://stackpath.bootstrapcdn.com","https://fonts.gstatic.com", "https://fonts.googleapis.com", "data:"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    },
    reportOnly: false
  }
}));

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});


const port = 5001;

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({
    extended: true
}));

var server = https.createServer(sslOptions, app).listen(port, function(){
  console.log("Express server listening on port " + port);
  });

  app.get('/test', (req, res) => {
    res.send('The MQTT API is working!');
  });


 
  
// Import the mqtt package

// Define the MQTT broker URL and port number
const brokerUrl = 'mqtt://broker.hivemq.com';
const brokerPort = 1883;

// Create a client instance and connect to the broker
const client = mqtt.connect(brokerUrl, { port: brokerPort });

// Define the MQTT topic and message
const topic = 'arduino/topic';
const message = '1';

// When the client is connected, publish the message to the topic
client.on('connect', () => {
  console.log('Connected to MQTT broker');
  client.publish(topic, message);
});

// When the client receives a message, log it to the console
client.on('message', (topic, message) => {
  console.log(`Received message: ${message.toString()} on topic ${topic}`);
});

// If there is an error with the client, log it to the console
client.on('error', (error) => {
  console.log(`Error: ${error}`);
});


app.put('/sensor-data', (req, res) => {
    const { Id }  = req.body;
    const Sdata = [1,2,3,4];
    const topic = `/sensorData`;
    const message = JSON.stringify({ Id, Sdata});
  
    client.publish(topic, message, () => {
      res.send('published new message');
    });
  });


  app.put('/make', (req, res) => {
    const { d }  = req.query;
    const Sdata = [1,2,3,4];
    const topic = `/ACM`;
    const message = JSON.stringify({d}); // d: the drink to be made
    console.log(message);

    client.publish(topic, message, () => {
      res.send('published new message');
    });
  });


  app.post('/mqtt/pref', async (req, res) => {
    const { d1, d2, d3 } = req.body;
    
    console.log('Received POST request to /pref');
    console.log('d1:', d1);
    console.log('d2:', d2);
    console.log('d3:', d3);
  
    pref_d1 = d1;
    pref_d3 = d3;
    pref_d2 = d2;
    
  });
