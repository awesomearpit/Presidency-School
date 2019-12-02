import React, { Component } from "react";
import Header from "./Header";
import { withRouter } from "react-router-dom";
import "../../assets/css/dashboard.scss";
import "../../assets/css/forgotPassword.scss";
import {
  PRIVATE_AUTH_KEY,
  LEAD_ID,
  APPLICATION_FORM_ID,
  utilityFunction
} from "../../utils/Constants";
import { logout } from "../../utils/API";
import $ from "jquery";
import moment from "moment";

class ApplicationForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      isLoginLoading: true,
      activityId: "",
      formId: ""
    };
  }

  loadOverrideCSS = () => {
    var activityStyle = this.state.activityId ? "display:none" : "";
    this.lsqFormContainer.querySelector(".modal-footer").style = activityStyle;
    this.lsqFormContainer.querySelector(".lsq-form-header").style =
      "display:none";
    this.lsqFormContainer.querySelector(".lsq-form-custom-tab-wrapper").style =
      "display:unset";

    this.lsqFormContainer.querySelector(
      ".lsq-external-form-container input[type=text]"
    ).style = "color: #212b36 !important;font-size: 14px !important;  ";

    this.lsqFormContainer.querySelector(".number-input").style =
      "font-size: 14px !important; padding-bottom:3px !important";

    this.lsqFormContainer.querySelector(
      ".lsq-form-custom-tab-center-panel-wrapper"
    ).style = "height:60px !important; border-right: 1px solid #ffffff";
    var parentClass = ".lsq-form-custom-tab-tabs.lsq-form-tabs-list-item";

    this.lsqFormContainer.querySelector(parentClass).style = "height:60px;";

    this.setState({ isLoginLoading: false });

    document.lsqformevaluator.container
      .find(".mx-custom-tabs-scroll-container.lsq-form-custom-tab-wrapper")
      .css("display", "")
      .lsqFormCustomTabs("destroy")
      .lsqFormCustomTabs({
        tabContentContainer: document.lsqformevaluator.ref.find(
          ".lsq-form-tabs-content"
        )
      })
      .children(".lsq-form-custom-tab-control-wrapper:first")
      .remove();

    $("body").on("click", ".mx-form-step-indicator", function(e) {
      var thisElm = $(this),
        tabId = thisElm.attr("data-href");
      document.lsqformevaluator.ref.lsqmultistepform(
        "setTabImmediate",
        thisElm.attr("data-tabid"),
        thisElm
      );
      var allTabs = document.lsqformevaluator.container.find(
        ".lsq-form-tabs-list-item"
      );
      $.each(allTabs, function(t) {
        var $tab = $(this),
          shouldMarkActive =
            $tab.children("a[href='" + tabId + "']").length > 0;
        shouldMarkActive ? $tab.addClass("active") : $tab.removeClass("active");
      });

      e.stopPropagation();
      e.preventDefault();
    });

    document.lsqformevaluator.container.on(
      "click",
      ".lsq-form-tabs-list-item a",
      function(e) {
        var thisElm = $(this),
          tabId = thisElm.attr("href"),
          tabToBeShown = document.lsqformevaluator.ref.find(
            ".mx-form-step-indicator[data-href='" + tabId + "']"
          );
        document.lsqformevaluator.ref.lsqmultistepform(
          "setTabImmediate",
          tabToBeShown.attr("data-tabid"),
          tabToBeShown
        );
      }
    );

    this.lsqFormContainer
      .querySelector(".lsq-form-action-back")
      .addEventListener("click", () => (window.location.href = "/dashboard"));

    document.lsqformevaluator.prevBtn.click(this.extendPrevAndNextBtnListener);

    document.lsqformevaluator.nextBtn.click(this.extendPrevAndNextBtnListener);
  };

  extendPrevAndNextBtnListener = () => {
    var currentStep = document.lsqformevaluator.ref.lsqmultistepform(
        "getCurrentStepIndicator"
      ),
      tabId = currentStep.attr("data-href");
    var allTabs = document.lsqformevaluator.container.find(
      ".lsq-form-tabs-list-item"
    );
    $.each(allTabs, function(t) {
      var $tab = $(this),
        shouldMarkActive = $tab.children("a[href='" + tabId + "']").length > 0;
      shouldMarkActive ? $tab.addClass("active") : $tab.removeClass("active");
    });
  };

  onLSQFormSubmissionSuccessAtEachStep = e => {};

  onLSQFormSubmissionSuccess = e => {
    this.props.history.push("/applicationSuccess");
  };

  onLSQFormLoadError = e => {};

  componentDidMount() {
    let { activityId, formId } = this.props.match.params;
    this.setState({ activityId: activityId, formId: formId });
    var id = activityId ? activityId : "";

    window.lsq_setupPortalProcess({
      id: `${formId}`,
      authKeyProvider: utilityFunction,
      leadId: `${LEAD_ID}`,
      activityId: `${id}`
    });

    this.lsqFormContainer.addEventListener(
      "lsqformloadcomplete",
      this.loadOverrideCSS
    );

    this.lsqFormContainer.addEventListener(
      "lsqformsubmissionsuccessateachstep",
      this.onLSQFormSubmissionSuccessAtEachStep
    );

    this.lsqFormContainer.addEventListener(
      "lsqformsubmissionsuccess",
      this.onLSQFormSubmissionSuccess
    );

    this.lsqFormContainer.addEventListener(
      "LSQFormLoadError",
      this.onLSQFormLoadError
    );
  }

  logout = async () => {
    logout();
    this.props.history.push("/");
    window.location.reload();
  };

  getUserName = name => {
    this.setState({ userName: name });
  };

  render() {
    return (
      <>
        {this.state.isLoginLoading ? (
          <div className="loading">Loading&#8230;</div>
        ) : null}
        <>
          <Header logout={this.logout} getUserName={this.getUserName} />

          <div className="application-form">
            <div className="application-box">
              <div
                id="lsq-form-modal"
                data-process-id={this.state.formId}
                className="modal-v4 fullscreen external lsq-external-form-container"
                ref={elem => (this.lsqFormContainer = elem)}
              >
                <div className="lsq-form-container-wrapper"></div>
                <div className="lsq-form-hidden-fields">
                  <input
                    id="lsq-authKey"
                    name="lsq-authKey"
                    type="hidden"
                    value="K2RpWjRSNTltOThmTFlFUGlBdUtZTjdWM1dhNzU1aWR4Q1FBT2pMZTlaT21QNFBoWHloQ1dWWitkZlNLRDJzKzMzVVpmSWFtWWdESURBWnFjQUErNlNRZVZ3ckxBZVNWWDhEOXc3MnRKRzlRbnVFTFkwT2R1MCtEWm91aC9iZjdwQ2ptMkVMMUQwdUxkQ0lCWXVFK2R3bXdwUVE0UVBoNnBwYzROMjA5Z3BPM2doQW0rS0dlVnFzVGtTTm5wMFpPMFM1MkdFbzVYdVliYVBTZ0MzdzNjdz09"
                  />
                  <input
                    id="lsq-api-service-url"
                    name="lsq-api-service-url"
                    type="hidden"
                    value="https://portalapi-in21.leadsquared.com/api/Form"
                  />
                  <input
                    id="lsq-app-url"
                    name="lsq-app-url"
                    type="hidden"
                    value="http://in21.leadsquared.com"
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      </>
    );
  }
}

export default withRouter(ApplicationForm);
