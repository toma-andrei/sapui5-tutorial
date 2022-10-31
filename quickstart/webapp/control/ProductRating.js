// create a new control
// our control inherits the common control functionalities fron SAPUI5 base object
sap.ui.define(
  [
    "sap/ui/core/Control",
    "sap/m/RatingIndicator",
    "sap/m/Label",
    "sap/m/Button",
  ],
  function (Control, RatingIndicator, Label, Button) {
    "use strict";
    // a custom control is a JS object that has 2 special sections:
    //    metadata: defines the data structure - meta infos on properties, events, and aggregation
    //    renderer: defines the HTML structure to be added to the DOM nad has 2 params:
    //        oRM: Sapui5 render manager used to write string and control properties to the HTML page
    //        oControl
    return Control.extend("tutorial.control.ProductRating", {
      metadata: {
        // the value control property hold the value that the user selected for rating
        properties: { value: { type: "float", defaultValue: 0 } },
        //aggregation are internal controls created by developer
        aggregations: {
          //used to collect user input on the product
          _rating: {
            type: "sap.m.RatingIndicator",
            multiple: false,
            visibility: "hidden",
          },
          // used to display information
          _label: {
            type: "sap.m.Label",
            multiple: false,
            visibility: "hidden",
          },
          // used to submit the rating to the app to store it
          _button: {
            type: "sap.m.Button",
            multiple: false,
            visibility: "hidden",
          },
        },
        // the change event will fire when the rating is submitted. It contains the current value as an event parameter.
        events: { change: { parameters: { value: { type: "int" } } } },
      },
      //this function is called anytime the control is instantiated. Used especially set up the control and prepare content for display
      init: function () {
        // we use setAggregation method from sap.ui.core.Control module to
        // assign the specific controls to our new custom control
        this.setAggregation(
          "_rating",
          new RatingIndicator({
            value: this.getValue(),
            iconSize: "2rem",
            visualMode: "Half",
            liveChange: this._onRate.bind(this),
          })
        );

        this.setAggregation(
          "_label",
          new Label({ text: "{i18n>productRatingLabelInitial}" }).addStyleClass(
            "sapUiSmallMargin"
          )
        );

        this.setAggregation(
          "_button",
          new Button({
            text: "{i18n>productRatingButton}",
            press: this._onSubmit.bind(this),
          }).addStyleClass("sapUiTinyMarginTopBottom")
        );
      },
      //an overridden setten to set the rating value
      setValue: function (fValue) {
        this.setProperty("value", fValue, true);
        this.getAggregation("_rating").setValue(fValue);
      },
      //We define the reset method to be able to revert the state of the control on the UI to its initial state so that the
      //    user can again submit a rating.
      reset: function () {
        let oResourceBundle = this.getModel("i18n").getResourceBundle();
        this.setValue(0);
        this.getAggregation("_label").setDesign("Standard");
        this.getAggregation("_rating").setEnabled(true);
        this.getAggregation("_label").setText(
          oResourceBundle.getText("productRatingLabelInitial")
        );
        this.getAggregation("_button").setEnabled(true);
      },

      _onRate: function (oEvent) {
        var oRessourceBundle = this.getModel("i18n").getResourceBundle();
        var fValue = oEvent.getParameter("value");

        this.setProperty("value", fValue, true);

        this.getAggregation("_label").setText(
          oRessourceBundle.getText("productRatingLabelIndicator", [
            fValue,
            oEvent.getSource().getMaxValue(),
          ])
        );
        this.getAggregation("_label").setDesign("Bold");
      },
      _onSubmit: function (oEvent) {
        var oResourceBundle = this.getModel("i18n").getResourceBundle();

        this.getAggregation("_rating").setEnabled(false);
        this.getAggregation("_label").setText(
          oResourceBundle.getText("productRatingLabelFinal")
        );
        this.getAggregation("_button").setEnabled(false);
        this.fireEvent("change", {
          value: this.getValue(),
        });
      },
      // creates a div with specific attributes
      renderer: function (oRm, oControl) {
        // creates <div
        oRm.openStart("div", oControl);
        // adds class="myAppDemoWTProductRating"
        oRm.class("myAppDemoWTProductRating");
        // adds > to close the start div
        oRm.openEnd();
        // render three internal controls by passing the content of the internal aggregation
        //this will call the renderer of the control and add their HTML to the page
        oRm.renderControl(oControl.getAggregation("_rating"));
        oRm.renderControl(oControl.getAggregation("_label"));
        oRm.renderControl(oControl.getAggregation("_button"));
        // adds </div.
        oRm.close("div");
      },
    });
  }
);
