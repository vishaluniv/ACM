const express = require('express')
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs')
const bodyParser = require('body-parser');
const mongoose=require('mongoose');
const helmet = require("helmet");
const https = require('https')
const cors = require('cors');

var sslOptions = {
key: fs.readFileSync('key.pem'),
cert: fs.readFileSync('cert.pem'),
passphrase: 'qwerty'
};

const Server_URL = 'https://localhost:3000';


var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const Razorpay = require('razorpay');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ACM: API',
      version: '1.0.0',
      description: 'API documentation generated using Swagger',
    },
  },
  apis: ['./api.js'], // Path to your API route files
};
const razorpay = new Razorpay({
  key_id: 'rzp_test_GSteFriVAs9upZ',
  key_secret: 'HM9EUce5bFhujxyFz6mZy8eN'
});
const swaggerSpec = swaggerJSDoc(swaggerOptions);
const BaseDrink = require('./schemas/basedrink');
const Recipes = require('./schemas/recipes');
const Orders = require('./schemas/orders');
const User = require('./schemas/user');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Cross-Origin-Resource-Policy", "same-site");
  res.header("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res.header("Cross-Origin-Embedder-Policy", "require-corp");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://code.highcharts.com/highcharts.js","https://maps.googleapis.com", "https://code.jquery.com", "https://cdnjs.cloudflare.com", "https://stackpath.bootstrapcdn.com", "https://fonts.googleapis.com", "https://checkout.razorpay.com"],
      connectSrc: ["'self'", "https://localhost:3000", "mongodb+srv://your-mongodb-url"],
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

const port = process.env.port || 5000;

try {
  mongoose.connect('mongodb+srv://deepali4843be21:KSz7kRnUi5zl8nUx@cluster0.zzg5loc.mongodb.net/myFirstDatabase', {useNewUrlParser: true, useUnifiedTopology: true });
} catch (error) {
  console.log(error)
}

app.use(cors());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

try {
  var server = https.createServer(sslOptions, app).listen(port, function(){
    console.log("Express server listening on port " + port);
    });
} catch (error) {
  console.log(error)
}


/**
 * @swagger
 * /test:
 *   get:
 *     summary: testing API
 *     tags: [NULL]
 *     responses:
 *       200:
 *         description: Successful operation
 */
app.get('/test', (req, res) => {
  res.send('The API is working!');
});


//LOGIN

app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

/**
 * @swagger
 * /api/login:
 *   get:
 *     summary: Login User
 *     tags: [Users]
 *     parameters:
 *       - username: username
 *         passw: passw
 *         required: true
 *         schema:
 *           uname: String,
 *           passw: String,
 *           prevdrinks: Array, 
 *           orders: Array
 *     responses:
 *       200:
 *         description: Successful operation
 *       500:
 *         description: Server Error
 */
app.get('/api/login', async (req, res) => {
    const{uname, passw} = req.body;
    console
    try {
      const user = await User.findOne({uname: uname});

      if (!user) {
        res.send('user does not exist');
      }

      else{

        if (user.passw == passw) {
            res.json(user);
        }

        else{
            res.send('password toh yaad rakhlo');
        }

      }
 
    } catch (err) {
      res.status(500).send('Server error');
    }
  });

  /**
 * @swagger
 * /api/mixers:
 *   get:
 *     summary: Get Mixers
 *     tags: [Mixers]
 *     parameters:
 *       - ind: drink index
 *         schema:
 *            index: Number,
 *            cost: Number,
 *            name: String,
 *            alcohol: Number,
 *            mixers: Array 
 *     responses:
 *       200:
 *         description: Successful operation
 *       500:
 *         description: Server Error
 */
  app.get('/api/mixers', async (req, res) => {

    const{ind} = req.query;
    console.log(ind);
    console.log("Api call: mixers");
    try {
      const mixers = await BaseDrink.findOne({index: ind});
      if (!mixers) {
        res.send('no mixers found')
      }
      else{
        res.json(mixers);
        console.log(mixers);
      }
 
    } catch (err) {
      res.status(500).send('Server error');
    }
  });

   /**
 * @swagger
 * /api/drink:
 *   get:
 *     summary: Get Recipes
 *     tags: [Recipes]
 *     parameters:
 *       - drinkIndex: drink index
 *         schema:
 *           index: Number,
 *           name: String,
 *           cost: Number,
 *           alcohol: Number,
 *           descrip: String,
 *           ingredients: Array 
 *     responses:
 *       200:
 *         description: Successful operation
 *       500:
 *         description: Server Error
 */

app.get('/api/drink', async(req,res) => {

    const {drinkIndex} = req.query;
    try {
      const drink = await Recipes.findOne({index: drinkIndex});
      if (!drink) {
        res.send('no drink found');
      }
      else{
        res.json(drink);
        console.log(drink);
      }
      
    } catch (error) {
       res.status(500).send('Server error');
    }

});
  
   /**
 * @swagger
 * /api/order:
 *   post:
 *     summary: Post Order
 *     tags: [Order]
 *     parameters:
 *       - name: name
 *         trans: transaction
 *         content: content of payment
 *         DateTime: Date-Time of order
 *         Cost: Cost of Order
 *         schema:
 *            trans: String,
 *            content: Array,
 *            dateTime: Date,
 *            Cost: String
 *     responses:
 *       200:
 *         description: Successful operation
 *       500:
 *         description: Server Error
 */
app.post('/api/order', async (req, res) => {
    try {
      const name = req.query.name;
      const trans = req.query.trans;
      const content = req.query.content;
      const DateTime = req.query.DateTime;
      const cost = req.query.cost;
      //let data = [];
  
      console.log('Received GET request with query parameters:', { name, trans, content, DateTime, cost });
      
      const newOrder = new Orders({
        id:Date.now() + Math.random(), //random number generated for order id
        name,
        trans,
        content,
        DateTime,
        cost
      });
    
      try {
        await newOrder.save();
        console.log('Successfully added new order');
        res.send('JAO PEEYO, MARO BCD');
      } catch (err) {
        console.log('Error saving new user:', err);
        res.send(err);
      }

      const user = await User.findOne({uname: name});
      user.orders.push(newOrder[id]);
      user.prevdrinks.push(newOrder[content]);
      
      res.send('added the new order into the user');
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
});

//SIGN UP
   /**
 * @swagger
 * /api/signup:
 *   post:
 *     summary: Post new user
 *     tags: [SignUp]
 *     parameters:
 *       - uname: username
 *         passw: password
 *         schema:
 *             uname: String,
 *             passw: String,
 *             prevdrinks: Array, 
 *             orders: Array 
 *     responses:
 *       200:
 *         description: Successful operation
 *       500:
 *         description: Server Error
 */

app.post('/api/signup', async (req, res) => {
    const { uname, passw } = req.body;
    
    console.log('Received POST request to /api/signup');
    console.log('name:', uname);
    console.log('passw:', passw);
    
    const user = await User.findOne({ uname: uname});

    if(!user){
      const newUser = new User({
      uname,
      passw,
      prevdrinks: [],
      orders: []
    });
  
    try {
      await newUser.save();
      console.log('Successfully added new user');
      res.send('ao, swagat hai');
    } catch (err) {
      console.log('Error saving new user:', err);
      res.send(err);
    }

    }
    else{
        console.log('User already exists')
        res.send('bhai yahin rehta hai tu');
    }
    
  });

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// ///////RAZORPAY////// ////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////


   /**
 * @swagger
 * /api/createOrder:
 *   post:
 *     summary: Post new order
 *     tags: [Order]
 *     parameters:
 *       - amount: amount
 *         receipt: receipt
 *         notes: notes
 *     responses:
 *       200:
 *         description: Successful operation
 *       500:
 *         description: Server Error
 */
app.post('/api/createOrder', async (req, res) => {
  const { amount, receipt, notes } = req.body;
  console.log(amount);
  const options = {
    amount: parseInt(amount) * 100, // Amount in paise
    currency: "INR",
    receipt: receipt,
    notes: notes,
  };

  try {
    const order = await razorpay.orders.create(options);
    console.log(order);
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

   /**
 * @swagger
 * /api/webhook:
 *   post:
 *     summary: Post order
 *     tags: [Order-Razorpay]
 *     parameters:
 *       - signature: signature of payment
 *         event: event
 *     responses:
 *       200:
 *         description: Successful operation
 *       500:
 *         description: Server Error
 */
  app.post('/webhook', async (req, res) => {
    // Get the signature and webhook event details from the request headers
    const signature = req.headers['x-razorpay-signature'];
    const event = req.body.event;

    try {
      // Verify the webhook signature to ensure that it was sent by Razorpay
      const verified = razorpay.webhooks.verifySignature(req.body, signature);
      if (verified) {
        // Handle the webhook event based on the event type
        switch (event) {
          case 'payment.captured':
            // Update your database with the payment details
            const paymentId = req.body.payment_id;
            const orderId = req.body.order_id;
            const amount = req.body.amount;

            try {
              const trans = paymentId;
              const content = orderId;
              const DateTime = Date.now();
              const cost = amount;

              const newOrder = new Orders({
                trans,
                content,
                DateTime,
                cost
              });
            
              try {
                await newOrder.save();
                console.log('Successfully added new order');
                
                
                //START MAKING DRINK
                //we can program the server to make the drink when this request is received
                //change to thank page
                $.ajax({
                  url: `${Server_URL}/thank`,
                  type: 'GET',
                  success: function(data) {
                    console.log("over to the server");
                  },
                  error: function(xhr, status, error) {
                    console.log('Error:', error);
                  }
                });

                res.send('success');
              } catch (err) {
                console.log('Error saving new user:', err);
                res.send(err);
              }
        
              // const user = await User.findOne({uname: name});
              // user.orders.push(newOrder[id]);
              // user.prevdrinks.push(newOrder[content]);

              // res.send('added the new order into the user');
            } catch (err) {
              console.error(err);
              res.status(500).json({ error: 'Internal server error' });
            }


            // Do something with the payment details
            console.log(`Payment of ${amount} was captured for order ${orderId} (payment ID: ${paymentId})`);
            break;
  
          case 'payment.failed':
            res.send('unsuccessful');
            console.log('Payment failed!');
            break;
  
          // Handle other webhook events as needed
  
          default:
            console.log(`Received unknown webhook event ${event}`);
        }
  
        // Respond with a 200 OK status code to confirm receipt of the webhook notification
        res.status(200).send('OK');
        
      } else {
        // Respond with a 400 Bad Request status code if the signature could not be verified
        res.status(400).send('Webhook signature verification failed');
      }

    } catch (err) {
      // Handle any errors that occur during webhook handling
      console.error(`Error handling webhook: ${err}`);
      res.status(500).send('Internal server error');
    }

});
  


///////////////////////////IN ORDER TO POPULATE THE DB//////////////////////
//post some data:::
// async function store() {
//   console.log('Received POST request to /api/drink');

//   const options = {
//     amount: 100, // Amount in paise
//     currency: "INR",
//     receipt: "A",
//     notes: "BB",
//   };

//   try {
//     const order = await razorpay.orders.create(options);
//     console.log(order);
//   } catch (error) {
//     console.error(error);
//   }

// }

// store();


