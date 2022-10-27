// in the array (first parameter) are found required modules
// modules must be specified in the array so module loading can be separated of code execution == performace++
sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/m/MessageToast"],
  function (Controller) {
    "use strict";

    return Controller.extend("tutorial.controller.App", {});
  }
);
