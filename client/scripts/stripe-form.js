function stripeForm ($form, config) {
  var stripeInstance;
  var stripeConfig;

  function registerForm($form) {
    $form.find("button[type=submit]").on("click", displayCheckoutDialog);
  }

  function displayCheckoutDialog(e) {
    var data = {
      description: getDescription(),
      amount: getAmount()
    };

    // Only display the payment dialog if the
    // charge amount is at least a $1.00
    if (data.amount < 100) {
      $form.find("input[data-stripe-amount]").focus();
    } else {
      stripeInstance.open(data);
    }

    e.preventDefault();
  }

  function tokenCreated(token) {
    // Call the success callback if configured
    if (config.success) {
      config.success(getAmount());
    }
    // Call the submit payment process
    // then call the original callback
    submitPayment(token).then(config.token);
  }

  function submitPayment(token) {
    var chargeConfig = _.defaults(stripeConfig.charge, {
      type: "POST",
      contentType: "application/json",
      dataType: "json",
    });
    var data = {
      description: getDescription(),
      amount: getAmount(),
      source: token.id,
      receipt_email: token.email
    };

    chargeConfig.data = JSON.stringify(data);
    return $.ajax(chargeConfig);
  }

  function getDescription() {
    return $form.attr("data-stripe-description") ? $form.attr("data-stripe-description") : undefined;
  }

  function getAmount() {
    var $amountField = $form.find("input[data-stripe-amount]");
    var amount = $amountField.length ? $amountField.val() : $form.attr("data-stripe-amount");
    return _.round(amount, 0) * 100;
  }

  function getAmountInCents(value) {
    return _.round(value, 0) * 100;
  }

  function init() {
    stripeConfig = _.cloneDeep(config);
    stripeConfig.token = tokenCreated;
    stripeInstance = StripeCheckout.configure(stripeConfig);

    registerForm($form)
  }

  init();
}

function initializeStripeConfig(testMode) {
  var stripeKeyLive = "pk_live_9pmNb8EVoamUQMKtvAYuorm5";
  var stripeKeyTest = "pk_test_Cdnp4m36AXNcBVaZISSFwjZ1";
  var stripeKey = testMode ? stripeKeyTest : stripeKeyLive;

  if (testMode) {
    console.log("key: " + stripeKey);
  }

  var stripeConfig = {
    key: stripeKey,
    name: "LovePacs",
    locale: "auto",
    charge: {
      url: "/payment",
      type: "POST",
      contentType: "application/json",
      dataType: "json",
    }
  };

  return stripeConfig;
}
