sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
  ],
  function (Controller, History, MessageToast, JSONModel) {
    "use strict";

    return Controller.extend("tutorial.controller.Detail", {
      onInit: function () {
        let oViewModel = new JSONModel({ currency: "EUR" });

        this.getView().setModel(oViewModel, "view");

        //fetch the instance of router
        let oRouter = this.getOwnerComponent().getRouter();

        //attach the _onObjectMatched function
        //_onObjectMatch is a callback and is executed when item is clicked or url is hit
        oRouter
          .getRoute("detail")
          .attachPatternMatched(this._onObjectMatched, this);
      },

      //this method is triggered by the router (when navigate to detail page)
      //it gets an event used for accessing the URL and navigation parameters
      _onObjectMatched: function (oEvent) {
        // reset the rating button when page is changed (like navigating to other item)
        this.byId("rating").reset();
        //bindElement function creates a binding context for a SAPUI5 control
        //it receives the model name and the path to the item in the configuration object
        this.getView().bindElement({
          path:
            "/" +
            window.decodeURIComponent(
              //"arguments" parameter return an object that coresponds to our navigation parameters from route pattern
              oEvent.getParameter("arguments").invoicePath
            ),
          model: "invoiceee",
        });
      },
      // this approach is better than browser's back button because if we go back from an external link we will automatically go to overview page
      // for ex. we access detail page from bookmark bar and the UI5 back button will get us to overview page, not previous page (browse empty tab)
      onNavBack: function () {
        // get the history instance
        let oHistory = History.getInstance();

        //get the previous hash = get a valid result only if a navigation step happened before in our app
        let sPreviousHash = oHistory.getPreviousHash();

        // if navigation step happened before, use brouser history to go to previous page
        if (sPreviousHash !== undefined) {
          window.history.go(-1);
        }
        //if no navigatoin step happened before, go to overview page
        else {
          let oRouter = this.getOwnerComponent().getRouter();
          // second param "{}" is used to pass additional arguments to the back route
          //"true" parameter tells the router to replace current history state with the new one since we actually do a back navigation by ourself
          oRouter.navTo("overview", {}, true);
        }
      },

      onRatingChange: function (oEvent) {
        var fValue = oEvent.getParameter("value");
        var oResourceBundle = this.getView()
          .getModel("i18n")
          .getResourceBundle();

        MessageToast.show(
          oResourceBundle.getText("ratingConfirmation", [fValue])
        );
      },
    });
  }
);
