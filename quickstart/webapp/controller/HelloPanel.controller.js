sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/m/MessageToast", "sap/ui/core/Fragment"],
  function (Controller, MessageToast, Fragment) {
    "use strict";

    return Controller.extend("tutorial.controller.HelloPanel", {
      //this is a SAPUI5 lifecycle method. It is called when the controller is created
      onPressHelloText: function () {
        //take data from i18n.properties file
        let oBundle = this.getView().getModel("i18n").getResourceBundle();

        //take data from the recipient/name - the model specified in the init function of this view
        let sRecipient = this.getView()
          .getModel()
          .getProperty("/recipient/name");

        //generate text from i18n file (property helloMsg) and set it to arg {0} from the value of this property
        let sMsg = oBundle.getText("helloMsg", [sRecipient]);
        MessageToast.show(sMsg);
      },
      onPressHelloDialogButton: function () {
        //if dialog is not rendered
        if (!this.pDialog) {
          // instantiate and add it to this
          this.pDialog = this.loadFragment({
            name: "tutorial.view.HelloDialog",
          }).then(
            function (oDialog) {
              syncStyleClass(
                this.getOwnerComponent().getContentDensityClass(),
                this.getView(),
                oDialog
              );
              return oDialog;
            }.bind(this)
          );
        }
        //after it is created, display it
        this.pDialog.then((oDialog) => {
          oDialog.open();
        });
      },

      onCloseDialog: function () {
        //get the element by id.
        this.byId("helloDialog").close();
      },
    });
  }
);
