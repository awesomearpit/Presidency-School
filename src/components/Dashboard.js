import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import "../assets/css/dashboard.scss";
import "../assets/css/forgotPassword.scss";
import Header from "./Dashboard/Header";
import { logout, activityPost, activityPostEvent } from "../utils/API";
import { ACCESS_KEY, SECRET_KEY, LEAD_ID } from "../utils/Constants";
import { nonDigitRemove, momentFormat } from "../utils/functions";
import "../assets/css/loader.scss";
import moment from "moment";
import ApplicationBox from "./Dashboard/ApplicationBox";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      activities: [],
      applicationActivities: [],
      application: {},
      isDashboardLoading: false,
      applicationActivityId: null,
      applicationModified: null,
      relatedProspectId: null,
    };
  }

  logout = async () => {
    logout();
    this.props.history.push("/");
  };

  getUserName = name => {
    this.setState({ userName: name });
  };

  async componentDidMount() {
    this.setState({ isDashboardLoading: true });
    try {
      const { data } = await activityPost(
        `https://api-in21.leadsquared.com/v2/ProspectActivity.svc/Retrieve?accessKey=${ACCESS_KEY}&secretKey=${SECRET_KEY}&leadId=${LEAD_ID}`,
      );
      console.log("actvity field", data);
      if (data.RecordCount === 0) {
        this.props.history.push("/enquiryForm");
      }
      this.setState({
        activities: data.ProspectActivities,
        isDashboardLoading: false,
      });
    } catch (e) {
      console.log("error", e);
    }

    try {
      const { data } = await activityPostEvent(
        `https://api-in21.leadsquared.com/v2/ProspectActivity.svc/Retrieve?accessKey=${ACCESS_KEY}&secretKey=${SECRET_KEY}&leadId=${LEAD_ID}`,
        {
          Parameter: { ActivityEvent: 200 },
        },
      );
      var applicationId = data.ProspectActivities[0]
        ? data.ProspectActivities[0].Id
        : "";

      console.log("Data", data.ProspectActivities[0]);
      this.setState({
        applicationActivities:
          data.ProspectActivities[0].ActivityFields["Status"],
        application: data,
        applicationActivityId: applicationId,
        applicationModified: data.ProspectActivities[0].ModifiedOn,
        relatedProspectId: data.ProspectActivities[0].RelatedProspectId,
      });
    } catch (e) {
      console.log("error", e);
    }
  }

  renderApplication = () => {
    if (!this.state.applicationActivities) {
      return (
        <>
          <ApplicationBox
            name={"Application"}
            className={"pending-box"}
            status={"Pending"}
            RelatedProspectId={this.state.relatedProspectId}
            ModifiedOn={this.state.applicationModified}
            btnClass={"btn btn-view"}
            link={`/applicationPreview/${this.state.applicationActivityId}`}
            btnText={"View Application"}
          />
        </>
      );
    } else if (this.state.applicationActivities === "Pending for Approval") {
      return (
        <>
          <ApplicationBox
            name={"Application"}
            className={"pending-box"}
            status={"Pending"}
            RelatedProspectId={this.state.relatedProspectId}
            ModifiedOn={this.state.applicationModified}
            btnClass={"btn btn-view"}
            link={`/applicationPreview/${this.state.applicationActivityId}`}
            btnText={"View Application"}
          />
        </>
      );
    } else if (
      this.state.applicationActivities === "Approved - Call for Assessment"
    ) {
      return (
        <>
          <ApplicationBox
            name={"Application"}
            className={"approved-box"}
            status={"Approved"}
            RelatedProspectId={this.state.relatedProspectId}
            ModifiedOn={this.state.applicationModified}
            btnClass={"btn btn-view"}
            link={`/applicationPreview/${this.state.applicationActivityId}`}
            btnText={"View Application"}
          />
        </>
      );
    } else if (this.state.applicationActivities === "Application Rejected") {
      return (
        <>
          <ApplicationBox
            name={"Application"}
            className={"reject-box"}
            status={"Rejected"}
            RelatedProspectId={this.state.relatedProspectId}
            ModifiedOn={this.state.applicationModified}
            btnClass={"btn btn-start"}
            link={`/applicationForm`}
            btnText={"Start New Application"}
          />
        </>
      );
    } else if (
      this.state.applicationActivities === "Qualified for Assessment Test"
    ) {
      return (
        <>
          <ApplicationBox
            name={"Application"}
            className={"approved-box"}
            status={"Qualified"}
            RelatedProspectId={this.state.relatedProspectId}
            ModifiedOn={this.state.applicationModified}
            btnClass={"btn btn-view"}
            link={`/applicationPreview/${this.state.applicationActivityId}`}
            btnText={"View Application"}
          />
        </>
      );
    } else if (this.state.applicationActivities === "Not Qualified for Test") {
      return (
        <>
          <ApplicationBox
            name={"Application"}
            className={"reject-box"}
            status={"Not Qualified"}
            RelatedProspectId={this.state.relatedProspectId}
            ModifiedOn={this.state.applicationModified}
            btnClass={"btn btn-start"}
            link={`/applicationForm`}
            btnText={"Start New Application"}
          />
        </>
      );
    } else if (this.state.applicationActivities === "Admission Granted") {
      return (
        <>
          <ApplicationBox
            name={"Application"}
            className={"approved-box"}
            status={"Granted"}
            RelatedProspectId={this.state.relatedProspectId}
            ModifiedOn={this.state.applicationModified}
            btnClass={"btn btn-view"}
            link={`/applicationPreview/${this.state.applicationActivityId}`}
            btnText={"View Application"}
          />
        </>
      );
    } else if (this.state.applicationActivities === "Admission Rejected") {
      return (
        <>
          <ApplicationBox
            name={"Application"}
            className={"reject-box"}
            status={"Rejected"}
            RelatedProspectId={this.state.relatedProspectId}
            ModifiedOn={this.state.applicationModified}
            btnClass={"btn btn-start"}
            link={`/applicationForm`}
            btnText={"Start New Application"}
          />
        </>
      );
    }
  };

  render() {
    return (
      <>
        {this.state.isDashboardLoading ? (
          <div class="loading">Loading&#8230;</div>
        ) : null}
        <>
          <Header logout={this.logout} getUserName={this.getUserName} />
          <div
            style={{
              backgroundColor: "#EBEEF1",
              width: "100%",
              top: "0",
              left: "0",
              right: "0",
              bottom: "0",
              position: "absolute",
            }}
          >
            <div className="dashboard">
              <div className="dashboard-header-box">
                <div className="header-box-container">
                  <div className="row no-margin">
                    <div className="col-md-12 no-padding">
                      <div className="name">Hello {this.state.userName},</div>
                    </div>
                    <div className="col-md-12 text">
                      Here’s your application history.
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="dashboard-body">
                  <div className="row dashboard-body-container">
                    {
                      this.state.activities.map((activity, index) => {
                        // if (
                        //   Object.entries(activity.ActivityFields).length === 0 &&
                        //   activity.ActivityFields.constructor === Object
                        // ) {
                        if (!activity.ActivityFields["Status"]) {
                          return (
                            <div className="col-md-12 body-box" key={index}>
                              <div className="col-md-4 d-inline-block no-padding box-display">
                                <div className="col-md-12 enquiry-text">
                                  Enquiry
                                </div>
                                <div className="col-md-12 no-padding">
                                  <div className="pending-box">Pending</div>
                                </div>
                              </div>
                              <div className="col-md-4 d-inline-block no-padding box-display">
                                <div className="col-md-12 application-number">
                                  PS-
                                  {nonDigitRemove(activity.RelatedProspectId)}
                                </div>
                                <div className="col-md-12 no-padding">
                                  <span className="last-updated">
                                    Last Updated On :
                                  </span>
                                  <span className="date-update">
                                    {momentFormat(activity.ModifiedOn)}
                                  </span>
                                </div>
                              </div>
                              <div className="col-md-4 btn-block box-display">
                                <Link
                                  className="btn btn-view"
                                  to={`/enquiryForm/${activity.Id}`}
                                >
                                  View Application
                                </Link>
                              </div>
                            </div>
                          );
                        } else if (
                          activity.ActivityFields.Status === "Approved"
                        ) {
                          return (
                            <div className="col-md-12 body-box" key={index}>
                              <div className="col-md-4 d-inline-block no-padding box-display">
                                <div className="col-md-12 enquiry-text">
                                  Enquiry
                                </div>
                                <div className="col-md-12 no-padding">
                                  <div className="approved-box">
                                    {activity.ActivityFields.Status}
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-4 d-inline-block no-padding box-display">
                                <div className="col-md-12 application-number">
                                  PS-
                                  {nonDigitRemove(activity.RelatedProspectId)}
                                </div>
                                <div className="col-md-12 no-padding">
                                  <span className="last-updated">
                                    Last Updated On :
                                  </span>
                                  <span className="date-update">
                                    {momentFormat(activity.ModifiedOn)}
                                  </span>
                                </div>
                              </div>
                              <div className="col-md-4 btn-block box-display">
                                {this.state.application.RecordCount !== 0 ? (
                                  <Link
                                    className="btn btn-view"
                                    to={`/applicationPreview/${this.state.applicationActivityId}`}
                                  >
                                    View Application
                                  </Link>
                                ) : (
                                  <Link
                                    className="btn btn-start"
                                    to={`/applicationForm/${this.state.applicationActivityId}`}
                                  >
                                    Start Application
                                  </Link>
                                )}
                              </div>
                            </div>
                          );
                        } else if (
                          activity.ActivityFields.Status === "Rejected"
                        ) {
                          return (
                            <div className="col-md-12 body-box" key={index}>
                              <div className="col-md-4 d-inline-block no-padding box-display">
                                <div className="col-md-12 enquiry-text">
                                  Enquiry
                                </div>
                                <div className="col-md-12 no-padding">
                                  <div className="reject-box">
                                    {activity.ActivityFields.Status}
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-4 d-inline-block no-padding box-display">
                                <div className="col-md-12 application-number">
                                  PS-
                                  {nonDigitRemove(activity.RelatedProspectId)}
                                </div>
                                <div className="col-md-12 no-padding">
                                  <span className="last-updated">
                                    Last Updated On :
                                  </span>
                                  <span className="date-update">
                                    {momentFormat(activity.ModifiedOn)}
                                  </span>
                                </div>
                              </div>
                              <div className="col-md-4 btn-block box-display">
                                <Link
                                  className="btn btn-start"
                                  to={`/enquiryForm`}
                                >
                                  Start New Enquiry
                                </Link>
                              </div>
                            </div>
                          );
                        }
                      })[0]
                    }
                    <>
                      {this.state.application.RecordCount !== 0 ? (
                        <>{this.renderApplication()}</>
                      ) : null}
                    </>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      </>
    );
  }
}

export default withRouter(Dashboard);
