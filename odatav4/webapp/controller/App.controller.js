sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/model/Sorter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/FilterType",
  ],
  function (
    Controller,
    JSONModel,
    MessageBox,
    MessageToast,
    Sorter,
    Filter,
    FilterOperator,
    FilterType
  ) {
    "use strict";

    return Controller.extend("sap.ui.core.tutorial.odatav4.controller.App", {
      /**
       *  Hook for initializing the controller
       */
      onInit: function () {
        // var oJSONData = {
        //   busy: false,
        //   order: 0,
        // };
        // var oModel = new JSONModel(oJSONData);
        // this.getView().setModel(oModel, "appView");

        // hasUIChanges and usernameEmpty are used to make specific controls visible / enabled during user entries
        let oViewModel = new JSONModel({
          busy: false,
          hasUIChanges: false,
          usernameEmpty: true,
          order: 0,
        });
        this.getView().setModel(oViewModel, "appView");

        //make Message model available in the view
        //when OData service reports any error while writing data, OData Model adds them to MessageModel so they are available in the view
        let oMessageManager = sap.ui.getCore().getMessageManager();
        let oMessageModel = oMessageManager.getMessageModel();
        let oMessageModelBinding = oMessageModel.bindList(
          "/",
          undefined,
          [],
          new Filter("technical", FilterOperator.EQ, true)
        );
        this.getView().setModel(oMessageModel, "message");

        oMessageModelBinding.attachChange(this.onMessageBindingChange, this);
        this._bTechnicalErrors = false;
      },

      //called when Add user button is pressed
      onCreate: function () {
        let oList = this.byId("peopleList");
        let oBinding = oList.getBinding("items");
        // create a new user
        let oContext = oBinding.create({
          UserName: "",
          FirstName: "",
          LastName: "",
          Age: "18",
        });

        this._setUIChanges();
        this.getView().getModel("appView").setProperty("/usernameEmpty", true);

        //focuses on the new added element?
        oList.getItems().some(function (oItem) {
          if (oItem.getBindingContext() === oContext) {
            oItem.focus();
            oItem.setSelected(true);
            return true;
          }
        });
      },

      onDelete: function () {
        //get selected items from table
        var oSelected = this.byId("peopleList").getSelectedItem();

        // if there is at least one selected item
        if (oSelected) {
          //get binding context and call delete method
          oSelected
            .getBindingContext()
            // delete is set to $auto to make sure that the request to the service is sent immediately as a batch request
            .delete("$auto")
            .then(
              function () {
                MessageToast.show(this._getText("deletionSuccessMessage", []));
              }.bind(this),
              function (oError) {
                MessageBox.error(oError.message);
              }
            );
        }
      },

      //manages entries in any Input field and triggers updates to the appView model
      onInputChange: function (oEvt) {
        if (oEvt.getParameter("escPressed")) {
          this._setUIChanges();
        } else {
          this._setUIChanges(true);
          if (
            oEvt
              .getSource()
              .getParent()
              .getBindingContext()
              .getProperty("UserName")
          ) {
            this.getView()
              .getModel("appView")
              .setProperty("/usernameEmpty", false);
          }
        }
      },
      onRefresh: function () {
        let oBinding = this.byId("peopleList").getBinding("items");
        // console.log(oBinding);

        if (oBinding.hasPendingChanges()) {
          MessageBox.error(this._getText("refreshSuccessMessage", []));
          return;
        }

        oBinding.refresh();
        MessageToast.show(this._getText("refreshSuccessMessage", []));
      },
      // discards pending changes.
      onResetChanges: function () {
        // resetChanges is from ODataListBinding API and removes any change
        this.byId("peopleList").getBinding("items").resetChanges();
        this._bTechnicalErrors = false;
        // enables UI
        this._setUIChanges();
      },
      onSave: function () {
        // called on successful response (succesfully saved)
        var fnSuccess = function () {
          this._setBusy(false);
          MessageToast.show(this._getText("changesSentMessage", []));
          this._setUIChanges(false);
        }.bind(this);

        // called on unsuccessful response (unsuccesfully saved)
        var fnError = function (oError) {
          this._setBusy(false);
          this._setUIChanges(false);
          MessageBox.error(oError.message);
        }.bind(this);

        this._setBusy(true); // Lock UI until submitBatch is resolved.
        // the promise returned by submitBatch is rejected only if the request itself fails (ex. odata service is unavailable / authorizatoin problems)
        this.getView()
          .getModel() // submit batch (from ODataModel API submits changes)
          .submitBatch("peopleGroup")
          .then(fnSuccess, fnError);
        this._bTechnicalErrors = false; // If there were technical errors, a new save resets them.
      },
      onSearch: function () {
        let oView = this.getView();
        let sValue = oView.byId("searchField").getValue();
        let oFilter = new Filter("LastName", FilterOperator.Contains, sValue);
        oView
          .byId("peopleList")
          .getBinding("items")
          .filter(oFilter, FilterType.Application);
      },

      onSort: function () {
        var oView = this.getView(),
          aStates = [undefined, "asc", "desc"],
          aStateTextIds = ["sortNone", "sortAscending", "sortDescending"],
          sMessage,
          iOrder = oView.getModel("appView").getProperty("/order");

        iOrder = (iOrder + 1) % aStates.length;
        var sOrder = aStates[iOrder];

        oView.getModel("appView").setProperty("/order", iOrder);
        oView
          .byId("peopleList")
          .getBinding("items")
          .sort(sOrder && new Sorter("LastName", sOrder === "desc"));

        sMessage = this._getText("sortMessage", [
          this._getText(aStateTextIds[iOrder], []),
        ]);
        MessageToast.show(sMessage);
      },

      //this is fired with every change
      onMessageBindingChange: function (oEvent) {
        var aContexts = oEvent.getSource().getContexts();
        let aMessages;
        let bMessageOpen = false;

        if (bMessageOpen || !aContexts.length) {
          return;
        }

        // Extract and remove the technical messages
        aMessages = aContexts.map(function (oContext) {
          return oContext.getObject();
        });
        sap.ui.getCore().getMessageManager().removeMessages(aMessages);

        this._setUIChanges(true);
        this._bTechnicalErrors = true;
        // error message will be displayed as an error
        MessageBox.error(aMessages[0].message, {
          id: "serviceErrorMessageBox",
          onClose: function () {
            bMessageOpen = false;
          },
        });

        bMessageOpen = true;
      },

      _getText: function (sTextId, aArgs) {
        return this.getOwnerComponent()
          .getModel("i18n")
          .getResourceBundle()
          .getText(sTextId, aArgs);
      },

      //used to modify fields in json model from onInit. Modify fields related to error during user entries
      _setUIChanges: function (bHasUIChanges) {
        if (this._bTechnicalErrors) {
          // If there is currently a technical error, then force 'true'.
          bHasUIChanges = true;
        } else if (bHasUIChanges === undefined) {
          bHasUIChanges = this.getView().getModel().hasPendingChanges();
        }
        var oModel = this.getView().getModel("appView");
        oModel.setProperty("/hasUIChanges", bHasUIChanges);
      },

      // used to lock the UI while data is submitted to back-end
      _setBusy: function (bIsBusy) {
        var oModel = this.getView().getModel("appView");
        oModel.setProperty("/busy", bIsBusy);
      },
    });
  }
);
