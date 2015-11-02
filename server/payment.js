module.exports = function () {
  var _ = require("lodash");

  if (!process.env.STRIPE_SERVER_KEY) {
    throw new Error("STRIPE_SERVER_KEY was not found in process.env");
  }

  function charge(request, callback) {
    var testMode = isTestMode(request);
    var key = testMode ? process.env.STRIPE_SERVER_KEY_TEST : process.env.STRIPE_SERVER_KEY

    // copy the configuration sent from the client
    // and override key settings, so the client
    // cannot manipulate the data.
    var chargeConfig = _.clone(request.body);
    chargeConfig.currency = "USD";

    if (testMode) {
      console.log("Test Mode");
      console.log("key: ");
      console.log(key);
      console.log("chargeConfig: ");
      console.log(chargeConfig);
    }

    // Charge the card
    var stripe = require("stripe")(key);
    stripe.charges.create(chargeConfig, callback);
  }

  function isTestMode(request) {
    return request.cookies.mode === "test";
  }

  return {
    charge: charge
  };
}();
