console.log("app starting");

var STRIPE_CONFIG_PATH = "./stripe.json";
var _ = require("lodash");
var fs = require("fs");
var serverConfig = require("./server.json");
var express = require("express");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var app = express();


// Get configurations
setupEnvironment();
console.log(process.env)

// Configure the server
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(process.env.STATIC_PATH));
console.log("express configured");

// Routes
app.post("/payment", function (request, response) {
  var payment = require("./server/payment.js");
  payment.charge(request, function(error, charge) {
    if (error) {
      var errorResponse = {
        message: "There was an error processing the payment"
      }
      response.sendStatus(500, errorResponse);
    } else {
      response.sendStatus(204);
    }
  });
});

function setupEnvironment() {
  // Server config
  _.defaults(process.env, serverConfig);

  // Stripe config
  if (fs.existsSync(STRIPE_CONFIG_PATH)) {
    var stripeConfig = require(STRIPE_CONFIG_PATH);
    _.defaults(process.env, stripeConfig);
  }

  // Ensure the stripe configurations are present
  if (!process.env.STRIPE_SERVER_KEY) {
    throw new Error("STRIPE_SERVER_KEY must be configured for the environment or specified in stripe.json");
  }
}

// Start the server
var server = app.listen(process.env.PORT, function () {
  console.log("Server active on port: %s", server.address().port)
});
