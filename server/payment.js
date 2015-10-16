module.exports = function () {
  if (!process.env.STRIPE_SERVER_KEY) {
    throw new Error("STRIPE_SERVER_KEY was not found in process.env");
  }
  
  var _ = require("lodash");
  var stripe = require("stripe")(process.env.STRIPE_SERVER_KEY);

  function charge(request, callback) {
    // copy the configuration sent from the client
    // and override key settings, so the client
    // cannot manipulate the data.
    var chargeConfig = _.clone(request.body);
    chargeConfig.currency = "USD";

    // Charge the card
    stripe.charges.create(chargeConfig, callback);
  }

  return {
    charge: charge
  };
}();
