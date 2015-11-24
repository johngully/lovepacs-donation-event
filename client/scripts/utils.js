function setTestModeCookie() {
  // set the testMode based upon the presence of ?mode=test in the querystring
  if (window.location.search.indexOf("mode=test") > -1) {
    Cookies.set("mode", "test");
  } else {
    Cookies.remove("mode");
  }
}

function getTestMode() {
  return Cookies.get("mode") === "test";
}
