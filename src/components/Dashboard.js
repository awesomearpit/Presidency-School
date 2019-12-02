import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import "../assets/css/dashboard.scss";
import "../assets/css/forgotPassword.scss";
import Header from "./Dashboard/Header";
import { logout, activityPost, activityPostEvent, get } from "../utils/API";
import { ACCESS_KEY, SECRET_KEY, LEAD_ID } from "../utils/Constants";
import { nonDigitRemove, momentFormat, lowerCase } from "../utils/functions";
import "../assets/css/loader.scss";
import moment from "moment";
import ApplicationBox from "./Dashboard/ApplicationBox";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      activities: [],
      applicationActivities: null,
      application: {},
      isDashboardLoading: false,
      applicationActivityId: null,
      applicationModified: null,
      relatedProspectId: null,
      schoolApplingFor: null
    };
  }

  logout = async () => {
    logout();
    this.props.history.push("/");
    window.location.reload();
  };

  getUserName = name => {
    this.setState({ userName: name });
  };

  async componentDidMount() {
    this.setState({ isDashboardLoading: true });
    try {
      const { data } = await activityPost(
        `https://api-in21.leadsquared.com/v2/ProspectActivity.svc/Retrieve?accessKey=${ACCESS_KEY}&secretKey=${SECRET_KEY}&leadId=${LEAD_ID}`
      );
      if (data.RecordCount === 0) {
        this.props.history.push("/enquiryForm");
      }

      this.setState({
        activities: data.ProspectActivities
      });
    } catch (e) {
      console.log("error", e);
    }

    try {
      const { data } = await activityPostEvent(
        `https://api-in21.leadsquared.com/v2/ProspectActivity.svc/Retrieve?accessKey=${ACCESS_KEY}&secretKey=${SECRET_KEY}&leadId=${LEAD_ID}`,
        {
          Parameter: { ActivityEvent: 200 }
        }
      );
      var applicationStatus = data.ProspectActivities[0]
        ? data.ProspectActivities[0].ActivityFields["Status"]
        : "";
      var applicationId = data.ProspectActivities[0]
        ? data.ProspectActivities[0].Id
        : "";
      var modifedOn = data.ProspectActivities[0]
        ? data.ProspectActivities[0].ModifiedOn
        : "";
      var relatedProspect = data.ProspectActivities[0]
        ? data.ProspectActivities[0].RelatedProspectId
        : "";

      this.setState({
        applicationActivities: applicationStatus,
        application: data,
        applicationActivityId: applicationId,
        applicationModified: modifedOn,
        relatedProspectId: relatedProspect
      });
    } catch (e) {
      console.log("error", e);
    }

    try {
      const { data } = await get(
        `https://api-in21.leadsquared.com/v2/LeadManagement.svc/Leads.GetById?accessKey=${ACCESS_KEY}&secretKey=${SECRET_KEY}&id=${LEAD_ID}`
      );
      this.setState({
        schoolApplingFor: data[0].mx_School_Applying_for,
        isDashboardLoading: false
      });
    } catch (e) {
      console.log("error leads info", e);
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
    } else if (
      lowerCase(this.state.applicationActivities) === lowerCase("Submitted")
    ) {
      return (
        <>
          <ApplicationBox
            name={"Application"}
            className={"submitted-box"}
            status={"Submitted"}
            RelatedProspectId={this.state.relatedProspectId}
            ModifiedOn={this.state.applicationModified}
            btnClass={"btn btn-view"}
            link={`/applicationPreview/${this.state.applicationActivityId}`}
            btnText={"View Application"}
          />
        </>
      );
    } else if (
      lowerCase(this.state.applicationActivities) ===
      lowerCase("Pending for Approval")
    ) {
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
      lowerCase(this.state.applicationActivities) ===
      lowerCase("Assessment Pending")
    ) {
      return (
        <>
          <ApplicationBox
            name={"Application"}
            className={"pending-box"}
            status={"Assessment Pending"}
            RelatedProspectId={this.state.relatedProspectId}
            ModifiedOn={this.state.applicationModified}
            btnClass={"btn btn-view"}
            link={`/applicationPreview/${this.state.applicationActivityId}`}
            btnText={"View Application"}
          />
        </>
      );
    } else if (
      lowerCase(this.state.applicationActivities) ===
        lowerCase("Application Rejected") &&
      (this.state.schoolApplingFor === "PSRTN" ||
        this.state.schoolApplingFor === "PSNLO" ||
        this.state.schoolApplingFor === "PSBE" ||
        this.state.schoolApplingFor === "PSBN" ||
        this.state.schoolApplingFor === "PSMNG")
    ) {
      return (
        <>
          <ApplicationBox
            name={"Application"}
            className={"reject-box"}
            status={"Application Rejected"}
            RelatedProspectId={this.state.relatedProspectId}
            ModifiedOn={this.state.applicationModified}
            btnClass={"btn btn-start"}
            link={`/applicationForm/5bc16517-054b-4346-901e-4838e0bed41b`}
            btnText={"Start New Application"}
          />
        </>
      );
    } else if (
      lowerCase(this.state.applicationActivities) ===
        lowerCase("Application Rejected") &&
      (this.state.schoolApplingFor === "PSBS" ||
        this.state.schoolApplingFor === "SPES")
    ) {
      return (
        <>
          <ApplicationBox
            name={"Application"}
            className={"reject-box"}
            status={"Application Rejected"}
            RelatedProspectId={this.state.relatedProspectId}
            ModifiedOn={this.state.applicationModified}
            btnClass={"btn btn-start"}
            link={`/applicationForm/793c3206-0ce9-11ea-aebf-02b00a4d022c`}
            btnText={"Start New Application"}
          />
        </>
      );
    } else if (
      lowerCase(this.state.applicationActivities) ===
      lowerCase("Awaiting Principal Approval")
    ) {
      return (
        <>
          <ApplicationBox
            name={"Application"}
            className={"approved-box"}
            status={"Awaiting Principal Approval"}
            RelatedProspectId={this.state.relatedProspectId}
            ModifiedOn={this.state.applicationModified}
            btnClass={"btn btn-view"}
            link={`/applicationPreview/${this.state.applicationActivityId}`}
            btnText={"View Application"}
          />
        </>
      );
    } else if (
      lowerCase(this.state.applicationActivities) ===
        lowerCase("Not Qualified For Test") &&
      (this.state.schoolApplingFor === "PSRTN" ||
        this.state.schoolApplingFor === "PSNLO" ||
        this.state.schoolApplingFor === "PSBE" ||
        this.state.schoolApplingFor === "PSBN" ||
        this.state.schoolApplingFor === "PSMNG")
    ) {
      return (
        <>
          <ApplicationBox
            name={"Application"}
            className={"reject-box"}
            status={"Not Qualified For Test"}
            RelatedProspectId={this.state.relatedProspectId}
            ModifiedOn={this.state.applicationModified}
            btnClass={"btn btn-start"}
            link={`/applicationForm/5bc16517-054b-4346-901e-4838e0bed41b`}
            btnText={"Start New Application"}
          />
        </>
      );
    } else if (
      lowerCase(this.state.applicationActivities) ===
        lowerCase("Not Qualified For Test") &&
      (this.state.schoolApplingFor === "PSBS" ||
        this.state.schoolApplingFor === "SPES")
    ) {
      return (
        <>
          <ApplicationBox
            name={"Application"}
            className={"reject-box"}
            status={"Not Qualified For Test"}
            RelatedProspectId={this.state.relatedProspectId}
            ModifiedOn={this.state.applicationModified}
            btnClass={"btn btn-start"}
            link={`/applicationForm/793c3206-0ce9-11ea-aebf-02b00a4d022c`}
            btnText={"Start New Application"}
          />
        </>
      );
    } else if (
      lowerCase(this.state.applicationActivities) ===
      lowerCase("Provisional Admission Granted")
    ) {
      return (
        <>
          <ApplicationBox
            name={"Application"}
            className={"approved-box"}
            status={"Provisional Admission Granted"}
            RelatedProspectId={this.state.relatedProspectId}
            ModifiedOn={this.state.applicationModified}
            btnClass={"btn btn-view"}
            link={`/applicationPreview/${this.state.applicationActivityId}`}
            btnText={"View Application"}
          />
        </>
      );
    } else if (
      lowerCase(this.state.applicationActivities) ===
        lowerCase("Admission Rejected") &&
      (this.state.schoolApplingFor === "PSRTN" ||
        this.state.schoolApplingFor === "PSNLO" ||
        this.state.schoolApplingFor === "PSBE" ||
        this.state.schoolApplingFor === "PSBN" ||
        this.state.schoolApplingFor === "PSMNG")
    ) {
      return (
        <>
          <ApplicationBox
            name={"Application"}
            className={"reject-box"}
            status={"Admission Rejected"}
            RelatedProspectId={this.state.relatedProspectId}
            ModifiedOn={this.state.applicationModified}
            btnClass={"btn btn-start"}
            link={`/applicationForm/5bc16517-054b-4346-901e-4838e0bed41b`}
            btnText={"Start New Application"}
          />
        </>
      );
    } else if (
      lowerCase(this.state.applicationActivities) ===
        lowerCase("Admission Rejected") &&
      (this.state.schoolApplingFor === "PSBS" ||
        this.state.schoolApplingFor === "SPES")
    ) {
      return (
        <>
          <ApplicationBox
            name={"Application"}
            className={"reject-box"}
            status={"Admission Rejected"}
            RelatedProspectId={this.state.relatedProspectId}
            ModifiedOn={this.state.applicationModified}
            btnClass={"btn btn-start"}
            link={`/applicationForm/793c3206-0ce9-11ea-aebf-02b00a4d022c`}
            btnText={"Start New Application"}
          />
        </>
      );
    } else if (
      lowerCase(this.state.applicationActivities) ===
      lowerCase("Admission Done")
    ) {
      return (
        <>
          <ApplicationBox
            name={"Application"}
            className={"approved-box"}
            status={"Admission Done"}
            RelatedProspectId={this.state.relatedProspectId}
            ModifiedOn={this.state.applicationModified}
            btnClass={"btn btn-view"}
            link={`/applicationPreview/${this.state.applicationActivityId}`}
            btnText={"View Application"}
          />
        </>
      );
    } else {
      return (
        <>
          <ApplicationBox
            name={"Application"}
            className={""}
            status={""}
            RelatedProspectId={this.state.relatedProspectId}
            ModifiedOn={this.state.applicationModified}
            btnClass={"btn btn-view"}
            link={`/applicationPreview/${this.state.applicationActivityId}`}
            btnText={"View Application"}
          />
        </>
      );
    }
  };

  renderEnquiry = () => {};

  render() {
    return (
      <>
        {this.state.isDashboardLoading ? (
          <div className="loading">Loading&#8230;</div>
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
              position: "absolute"
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
                        if (!activity.ActivityFields["Status"]) {
                          return (
                            <ApplicationBox
                              name={"Enquiry"}
                              className={"pending-box"}
                              status={"Pending"}
                              RelatedProspectId={activity.RelatedProspectId}
                              ModifiedOn={activity.ModifiedOn}
                              btnClass={"btn btn-view"}
                              link={`/enquiryForm/${activity.Id}`}
                              btnText={"View Application"}
                            />
                          );
                        } else if (
                          activity.ActivityFields.Status === "Approved" &&
                          (this.state.schoolApplingFor === "PSRTN" ||
                            this.state.schoolApplingFor === "PSNLO" ||
                            this.state.schoolApplingFor === "PSBE" ||
                            this.state.schoolApplingFor === "PSBN" ||
                            this.state.schoolApplingFor === "PSMNG")
                        ) {
                          return (
                            <>
                              {this.state.application.RecordCount !== 0 ? (
                                <ApplicationBox
                                  name={"Enquiry"}
                                  className={"approved-box"}
                                  status={"Approved"}
                                  RelatedProspectId={activity.RelatedProspectId}
                                  ModifiedOn={activity.ModifiedOn}
                                  btnClass={"btn btn-view"}
                                  link={`/applicationPreview/${this.state.applicationActivityId}`}
                                  btnText={"View Application"}
                                />
                              ) : (
                                <ApplicationBox
                                  name={"Enquiry"}
                                  className={"approved-box"}
                                  status={"Approved"}
                                  RelatedProspectId={activity.RelatedProspectId}
                                  ModifiedOn={activity.ModifiedOn}
                                  btnClass={"btn btn-start"}
                                  link={`/applicationForm/5bc16517-054b-4346-901e-4838e0bed41b/${this.state.applicationActivityId}`}
                                  btnText={"Start Application"}
                                />
                              )}
                            </>
                          );
                        } else if (
                          activity.ActivityFields.Status === "Approved" &&
                          (this.state.schoolApplingFor === "PSBS" ||
                            this.state.schoolApplingFor === "SPES")
                        ) {
                          return (
                            <>
                              {this.state.application.RecordCount !== 0 ? (
                                <ApplicationBox
                                  name={"Enquiry"}
                                  className={"approved-box"}
                                  status={"Approved"}
                                  RelatedProspectId={activity.RelatedProspectId}
                                  ModifiedOn={activity.ModifiedOn}
                                  btnClass={"btn btn-view"}
                                  link={`/applicationPreview/${this.state.applicationActivityId}`}
                                  btnText={"View Application"}
                                />
                              ) : (
                                <ApplicationBox
                                  name={"Enquiry"}
                                  className={"approved-box"}
                                  status={"Approved"}
                                  RelatedProspectId={activity.RelatedProspectId}
                                  ModifiedOn={activity.ModifiedOn}
                                  btnClass={"btn btn-start"}
                                  link={`/applicationForm/793c3206-0ce9-11ea-aebf-02b00a4d022c/${this.state.applicationActivityId}`}
                                  btnText={"Start Application"}
                                />
                              )}
                            </>
                          );
                        } else if (
                          activity.ActivityFields.Status === "Rejected"
                        ) {
                          return (
                            <ApplicationBox
                              name={"Enquiry"}
                              className={"reject-box"}
                              status={"Rejected"}
                              RelatedProspectId={activity.RelatedProspectId}
                              ModifiedOn={activity.ModifiedOn}
                              btnClass={"btn btn-start"}
                              link={`/enquiryForm`}
                              btnText={"Start New Enquiry"}
                            />
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
