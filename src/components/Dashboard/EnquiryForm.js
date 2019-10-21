import React, { Component } from "react";
import Header from "./Header";
import { withRouter, useParams } from "react-router-dom";
import "../../assets/css/dashboard.scss";
import "../../assets/css/forgotPassword.scss";
import {
  ENQUIRY_FORM_ID,
  PRIVATE_AUTH_KEY,
  LEAD_ID,
  getBranchName,
} from "../../utils/Constants";
import { logout } from "../../utils/API";
import "../../assets/css/loader.scss";

class EnquiryForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      activityId: "",
      isLoginLoading: true,
    };
  }

  loadOverrideCSS = () => {
    var activityStyle = this.state.activityId ? "display:none" : "";
    this.lsqFormContainer.querySelector(".lsq-form-action-btn").textContent =
      "Submit Enquiry Form";
    this.lsqFormContainer.querySelector(
      ".lsq-form-action-btn",
    ).style = activityStyle;

    this.lsqFormContainer.querySelector(
      ".lsq-external-form-container input[type=text]",
    ).style = "color: #212b36 !important;font-size: 14px !important;  ";

    this.lsqFormContainer.querySelector(".number-input").style =
      "font-size: 14px !important; padding-bottom:3px !important";

    this.lsqFormContainer.querySelector(".required").style =
      "font-size: 14px !important;color: #212b36 !important;";

    // this.lsqFormContainer.querySelector(".lsq-form-action-btn").click(event => {
    //   console.log("event", event);
    // });

    // var parentClass = ".lsq-form-custom-tab-tabs";
    // this.lsqFormContainer
    //   .querySelector(parentClass + " a[data-old-value='Information']")
    //   .prepend(`<i class="fa fa-2x fa-file-code-o " aria-hidden="true"></i>`);
    // console.log(
    //   "claaasss",
    //   this.lsqFormContainer.querySelector(
    //     parentClass + " a[data-old-value='Information']"
    //   )
    // );
    this.lsqFormContainer.querySelector(".lsq-form-action-back").style.display =
      "none";
    this.lsqFormContainer.querySelector(
      ".lsq-form-custom-tab-center-panel-wrapper",
    ).style.display = "none";
    this.lsqFormContainer.querySelector(".popup-header").style.display = "none";
    this.lsqFormContainer.querySelector(
      ".modal-header",
    ).innerHTML = `<div class="enquiry-form-header">Welcome to Precidency School ${getBranchName()}, ${
      this.state.userName.split(" ")[0]
    },<br /><br /><span>Please fill in the enquiry form below to get started</span></div>`;
    this.setState({ isLoginLoading: false });
  };

  onLSQFormSubmissionSuccessAtEachStep = e => {
    console.log("each step", e);
  };

  onLSQFormSubmissionSuccess = e => {
    console.log("on success", e);
    this.props.history.push("/enquirySuccess");
  };

  onLSQFormLoadError = e => {
    console.log("on form load error", e);
  };

  componentDidMount() {
    let { activityId } = this.props.match.params;
    this.setState({ activityId: activityId });
    var id = activityId ? activityId : "";

    console.log("id", id);

    window.lsq_setupForm({
      id: `${ENQUIRY_FORM_ID}`,
      authKeyProvider: `${PRIVATE_AUTH_KEY}`,
      leadId: `${LEAD_ID}`,
      activityId: `${id}`,
    });

    this.lsqFormContainer.addEventListener(
      "lsqformloadcomplete",
      this.loadOverrideCSS,
    );

    this.lsqFormContainer.addEventListener(
      "lsqformsubmissionsuccessateachstep",
      this.onLSQFormSubmissionSuccessAtEachStep,
    );

    this.lsqFormContainer.addEventListener(
      "lsqformsubmissionsuccess",
      this.onLSQFormSubmissionSuccess,
    );

    this.lsqFormContainer.addEventListener(
      "LSQFormLoadError",
      this.onLSQFormLoadError,
    );
  }

  logout = async () => {
    logout();
    this.props.history.push("/");
  };

  getUserName = name => {
    this.setState({ userName: name });
  };

  render() {
    console.log("Enquiry Form");
    return (
      <>
        {this.state.isLoginLoading ? (
          <div class="loading">Loading&#8230;</div>
        ) : null}
        <>
          <Header logout={this.logout} getUserName={this.getUserName} />

          <div className="enquiry-form">
            <div className="enquiryForm-box">
              <div
                id="lsq-form-modal"
                data-form-id="2197ea44-ddd0-11e9-aebf-02b00a4d022c"
                class="modal-v4 fullscreen external lsq-external-form-container"
                ref={elem => (this.lsqFormContainer = elem)}>
                <div class="lsq-form-container-wrapper"></div>

                <div class="lsq-form-hidden-fields">
                  <input
                    id="lsq-authKey"
                    name="lsq-authKey"
                    type="hidden"
                    value="cFh1eUlYeHJMWFNFbmYxbkxFWElKNktlbVQrMEx2ZkdtS08wMXpmeGJXZGdORnkzcHFkMDdTcmdnTHhJajcvMDRqcm5oSGNiellJSllBZmErZlk5OExDRFpyVFJRSFZyMXcxNXJSdEtiWXJTcGlPeXczeVpPRFpENWF4MzNYeTM4U3o1bHFlSy9HL24rNW9Bb1p3RXZ1Q203YlJZdk83RE05cDRqUXFzbEJJQ2dONTAwSzErajBCNXI2VW5IYm9NYmNiNFhFU05GOVRxRU9HREFiQTJaQT09"
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
                    value="https://in21.leadsquared.com"
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

export default withRouter(EnquiryForm);
