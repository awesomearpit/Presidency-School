import React, { Component } from "react";
import Header from "./Header";
import { withRouter } from "react-router-dom";
import "../../assets/css/dashboard.scss";
import "../../assets/css/forgotPassword.scss";
import {
  PRIVATE_AUTH_KEY,
  LEAD_ID,
  APPLICATION_FORM_ID,
} from "../../utils/Constants";
import { logout } from "../../utils/API";

class ApplicationForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      isLoginLoading: true
    };
  }

  loadOverrideCSS = () => {
    this.lsqFormContainer.querySelector(".lsq-form-header").style =
      "display:none";
    this.lsqFormContainer.querySelector(".lsq-form-custom-tab-wrapper").style =
      "display:unset";

    this.lsqFormContainer.querySelector(
      ".lsq-form-custom-tab-center-panel-wrapper"
    ).style = "height:60px; border-right: 1px solid #ffffff";
    var parentClass = ".lsq-form-custom-tab-tabs.lsq-form-tabs-list-item";
    console.log(this.lsqFormContainer.querySelector(parentClass));

    this.lsqFormContainer.querySelector(parentClass).style = "height:60px;";
    // + " a[data-old-value='Application Fee']"

    console.log(
      this.lsqFormContainer.querySelector(
        parentClass + "a[data-old-value='Application Fee']"
      )
    );
    this.setState({ isLoginLoading: false });
    // .prepend('<i class="fa fa-credit-card" aria-hidden="true"></i>');
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
    window.lsq_setupForm({
      id: `${APPLICATION_FORM_ID}`,
      authKeyProvider: `${PRIVATE_AUTH_KEY}`,
      leadId: `${LEAD_ID}`,
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
  };

  getUserName = name => {
    this.setState({ userName: name });
  };

  render() {
    return (
      <>
        {this.state.isLoginLoading ? (
          <div class="loading">Loading&#8230;</div>
        ) : null}
        <>
          <Header logout={this.logout} getUserName={this.getUserName} />

          <div className="application-form">
            <div className="application-box">
              <div
                id="lsq-form-modal"
                data-form-id="3c6c587e-df79-11e9-aebf-02b00a4d022c"
                className="modal-v4 fullscreen external lsq-external-form-container"
                ref={elem => (this.lsqFormContainer = elem)}
              >
                <div class="lsq-form-container-wrapper"></div>
                <div class="lsq-form-hidden-fields">
                  <input
                    id="lsq-authKey"
                    name="lsq-authKey"
                    type="hidden"
                    value="TFdzZ3M3L0RlMUR1YXhDL0UydFRuSVoxeG5hUFVoaUgvVndJc0JLdGZrYksxY1BURUMveWUwM0dmYlJLbEJTTXUxSFYzUXRpSE9TSTlxTk9IZ2xRdjB1ZWQxZmVBTHYwQVVyemRBeHV5ZVJ5eTB2NzMzZjkrNCtVc29DVk5hSldHRHlMVko3MklrUXNNOXlVVjIxMU9TeWhXQ25WdFlvc295TmxRTTJPeWlKak5aaUdnMnZzczF3ZHFzdTE1c0FUT2hHWFN6dFR2eVJic1BFZjY4cTB0UT09"
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
