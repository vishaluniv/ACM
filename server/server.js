const express = require('express');
const fs = require('fs');
const helmet = require('helmet');
const https = require('https');
const cors = require('cors');

var sslOptions = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem'),
  passphrase: 'qwerty'

};

var app = express();
app.use(cors());

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://code.highcharts.com/highcharts.js","https://maps.googleapis.com", "https://code.jquery.com", "https://cdnjs.cloudflare.com", "https://stackpath.bootstrapcdn.com", "https://fonts.googleapis.com", "https://checkout.razorpay.com"],
      connectSrc: ["'self'", "https://localhost:5000", "mongodb+srv://your-mongodb-url", "https://localhost:5001"],
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
  // res.setHeader("Cross-Origin-Resource-Policy", "same-site");
  // if (req.hostname === 'checkout.razorpay.com') {
  //   res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  // }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});


const port = 3000;
const base = `${__dirname}/frontend`;

app.use(express.static('frontend'));

var server = https.createServer(sslOptions, app).listen(port, function(){
  console.log("Express server listening on port " + port);
});

// app.get functions for navigation, with the format: 


app.get('/wel', function (req, res) {
  res.sendFile(`${base}/wel.html`);
});

app.get('/menu', function (req, res) {
  res.sendFile(`${base}/submenu.html`);
});

app.get('/cocktail', function (req, res) {
  res.sendFile(`${base}/drink1.html`);
});

app.get('/custom', function (req, res) {
  res.sendFile(`${base}/custom.html`);
});

app.get('/thank', function (req, res) {
  res.sendFile(`${base}/thank.html`);
  // make drink
});


