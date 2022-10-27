sap.ui.define(
  ["sap/ui/core/UIComponent", "sap/ui/model/json/JSONModel"],
  function (UIComponent, JSONModel) {
    "use strict";

    return UIComponent.extend("tutorial.Component", {
      metadata: {
        interfaces: ["sap.ui.core.IAsyncContentCreation"],
        manifest: "json",
        rootView: {
          viewName: "tutorial.view.App",
          type: "XML",
          id: "appppp",
        },
      },

      init: function () {
        // call the init function of the parent
        UIComponent.prototype.init.apply(this, arguments);

        let oData = { recipient: { name: "World" } };

        // instatiate a JSON model
        let oModel = new JSONModel(oData);

        //to use this model in view, we must call setModel() after we got the object of the view with getView()
        this.setModel(oModel);

        // // ============== internationalization ================= commented cuz this steps are done automatically (see manifest.json)

        // //instantiate a i18n model (a resource model)
        // let i18nModel = new ResourceModel({ bundleName: "tutorial.i18n.i18n" });

        // //to use the model in view, we must set it. After this, it is available in the view file.
        // this.setModel(i18nModel, "i18n");
      },
    });
  }
);
