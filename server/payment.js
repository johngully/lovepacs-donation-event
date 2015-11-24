module.exports = function () {
  var _ = require("lodash");

  if (!process.env.STRIPE_SERVER_KEY) {
    throw new Error("STRIPE_SERVER_KEY was not found in process.env");
  }

  function charge(request, callback) {
    // copy the configuration sent from the client
    // and override key settings, so the client
    // cannot manipulate the data.
    var chargeConfig = _.clone(request.body);
    chargeConfig.currency = "USD";

    // Charge the card
    var key = getStripeKey(request);
    var stripe = require("stripe")(key);
    log(isTestMode(request), key, "chargeConfig", chargeConfig);
    stripe.charges.create(chargeConfig, callback);
  }

  function subscription(request, callback) {
    var subscriptionConfig = _.clone(request.body);

    // Create the customer and setup a subscription
    var key = getStripeKey(request);
    log(isTestMode(request), key, "subscriptionConfig", subscriptionConfig);
    createCustomer(key, subscriptionConfig, callback);
  }

  function customer(request, callback) {
    var customerConfig = _.clone(request.body);

    // Create the customer
    var key = getStripeKey(request);
    log(isTestMode(request), key, "customerConfig", customerConfig);
    createCustomer(key, customerConfig, callback);
  }

  function createCustomer(key, config, callback) {
    // Create the customer
    // (stripe will charge the card if the payment deatils are included)
    var stripe = require("stripe")(key);
    stripe.customers.create(config, callback);
  }

  function getStripeKey(request) {
    var testMode = isTestMode(request);
    return testMode ? process.env.STRIPE_SERVER_KEY_TEST : process.env.STRIPE_SERVER_KEY
  }

  function isTestMode(request) {
    return request.cookies.mode === "test";
  }

  function log(testMode, key, name, value) {
    if (!testMode) {
      return;
    }

    console.log("key: %s", key);
    console.log("%s: ", name);
    console.log(value);
  }

  return {
    charge: charge,
    subscription: subscription
  };
}();
