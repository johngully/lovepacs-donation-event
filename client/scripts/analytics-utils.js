function initializeGoogleAnalytics() {
  window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
  ga('create', 'UA-69631931-1', 'auto');
  ga('require', 'linkid');
  ga('send', 'pageview');
}

function sendAnalyticsEvent(category, action, label, value) {
  label = label || "Feather a friend";
  if (getTestMode()) {
    label = label + " - Test";
  }
  ga('send', 'event', category, action, label, value);
}
