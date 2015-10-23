var _ = require("lodash");
var fs = require("fs");
var serverConfig = require("./server.json");
var express = require("express");
var bodyParser = require("body-parser");
var app = express();

var STRIPE_CONFIG_PATH = "./stripe.json";

console.log("app.js - starting");

// Configure the server
app.use(bodyParser.json());
app.use(express.static(serverConfig.staticPath));

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

function setupStripeEnvironment() {
  if (!fs.existsSync(STRIPE_CONFIG_PATH)) {
    return;
  }

  var stripeConfig = require(STRIPE_CONFIG_PATH);
  _.defaults(process.env, stripeConfig);
}

console.log("setupStripeEnvironment");
setupStripeEnvironment();
console.log("STRIPE_SERVER_KEY: " + process.env.STRIPE_SERVER_KEY)

// Start the server
var server = app.listen(serverConfig.port, function () {
  console.log("Server active on port: %s", server.address().port)
});
