/*
Logs student interactions with the activity on OLI
author: zmineroff@cmu.edu
*/

$(document).ready(function () {
  $('#num-protons').change(function () {
    APIActivity.logNavigation("num-protons-slider", this.value);
  });

  var logPHValue = function() {
    APIActivity.logNavigation("ph-input", $('#ph').val());
  }
  var timeout = null;
  $('#ph').on('input', function () {
    clearTimeout(timeout);
    timeout = setTimeout(logPHValue,1000);
  });
});
