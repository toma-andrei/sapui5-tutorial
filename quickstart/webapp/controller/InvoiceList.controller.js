sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
  ],
  function (Controller, JSONModel, formatter, Filter, FilterOperator) {
    "use strict";
    return Controller.extend("tutorial.controller.InvoiceList", {
      formatter: formatter,
      onInit: function () {
        let oViewModel = new JSONModel({ currency: "EUR" });
        this.getView().setModel(oViewModel, "view");
      },
      // oEvent is a paramater that all event handlers have
      onFilterInvoices: function (oEvent) {
        /**Filtering is not case sensitive */

        // array of different filters which will filter the information
        let aFilter = [];

        // console.log(oEvent);

        //get value from search field
        let sQuery = oEvent.getParameter("query");
        // console.log(sQuery);

        // if search field has a value
        if (sQuery) {
          //add to filterArray a filter for ProductNames that data from search field is a substring of
          //filter operation is saying the way the filtering is done: this ex. search input must be contained by productName
          aFilter.push(
            new Filter("ProductName", FilterOperator.Contains, sQuery)
          );
        }

        // if search field has no value, elements are filtered with an empty array which results in selecting all elements
        let oList = this.byId("invoiceListIdentifier");

        let oBinding = oList.getBinding("items");
        oBinding.filter(aFilter);
      },
      onPress: function (oEvent) {
        let oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("detail");
        // setTimeout(() => {
        //   oRouter.navTo("overview");
        // }, 2000);
      },
    });
  }
);
