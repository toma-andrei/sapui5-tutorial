sap.ui.define(
  ["sap/ui/core/UIComponent", "sap/ui/model/json/JSONModel", "sap/ui/Device"],
  function (UIComponent, JSONModel, Device) {
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

        // ============== internationalization ================= commented cuz this steps are done automatically (see manifest.json)

        // //instantiate a i18n model (a resource model)
        // let i18nModel = new ResourceModel({ bundleName: "tutorial.i18n.i18n" });

        // //to use the model in view, we must set it. After this, it is available in the view file.
        // this.setModel(i18nModel, "i18n");

        // ============== set device model =================

        //initialize the device model
        // this makes deviceAPI properties available as a JSON model
        let oDeviceModel = new JSONModel(Device);

        //set binding mode to OneWay to avoid changing the model accidentally when we bind properties of a control to it
        oDeviceModel.setDefaultBindingMode("OneWay");
        this.setModel(oDeviceModel, "device");

        //initialize the router. We don't have to instantiate the router. This is done automatically based on manifest.json router configuration
        // initializing the router will evaluate the current URL and load the corresponding view automatically. It is done
        // <- via routes and targets from manifest.json. When a route is hit, corresponding view is diplayed.
        this.getRouter().initialize();
      },

      // this method queries the deviceAPI for touch support of the client and returns the CSS class for the specific size (compact/cozy)
      getContentDensityClass: function () {
        //compact size = optimized for Desktop and non-touch devices
        //cozy size = optimized for phones / touch devices
        if (!this._sContentDensityClass) {
          if (!Device.support.touch) {
            this._sContentDensityClass = "sapUiSizeCompact";
          } else {
            this._sContentDensityClass = "sapUiSizeCozy";
          }
        }
        return this._sContentDensityClass;
      },
    });
  }
);
