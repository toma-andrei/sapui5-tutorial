sap.ui.define(["sap/ui/core/mvc/Controller"], function (Controller) {
  "use strict";

  return Controller.extend("tutorial.controller.Detail", {
    onInit: function () {
      let oRouter = this.getOwnerComponent().getRouter();
      oRouter
        .getRoute("detail")
        .attachPatternMatched(this._onObjectMatched, this);
    },
    _onObjectMatched: function (oEvent) {
      this.getView().bindElement({
        path:
          "/" +
          window.decodeURIComponent(
            oEvent.getParameter("arguments").invoicePath
          ),
        model: "invoiceee",
      });
    },
  });
});
