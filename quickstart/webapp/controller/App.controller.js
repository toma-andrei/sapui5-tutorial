// in the array (first parameter) are found required modules
// modules must be specified in the array so module loading can be separated of code execution == performace++
sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/m/MessageToast"],
  function (Controller) {
    "use strict";

    return Controller.extend("tutorial.controller.App", {
      onInit: function () {
        //when app is initialized it sets the specific CSS for the device size: compact or cozy size
        this.getView().addStyleClass(
          this.getOwnerComponent().getContentDensityClass()
        );
      },
      onOpenDialog: function () {},
    });
  }
);
