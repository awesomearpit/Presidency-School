import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import "../assets/css/dashboard.scss";
import "../assets/css/forgotPassword.scss";
import Header from "./Dashboard/Header";
import { logout, activityPost, activityPostEvent } from "../utils/API";
import { ACCESS_KEY, SECRET_KEY, LEAD_ID } from "../utils/Constants";
import { nonDigitRemove } from "../utils/functions";
import "../assets/css/loader.scss";

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
        `https://api-in21.leadsquared.com/v2/ProspectActivity.svc/Retrieve?accessKey=${ACCESS_KEY}&secretKey=${SECRET_KEY}&leadId=${LEAD_ID}`
      );
      console.log("actvity fields", data);
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
        }
      );
      this.setState({
        applicationActivities: data.ProspectActivities,
        application: data,
        applicationActivityId: data.ProspectActivities[0].Id,
      });
      console.log("data", data);
    } catch (e) {
      console.log("error", e);
    }
  }

  render() {
    console.log(
      "Data",
      this.state.applicationActivities.map(activity => activity)
    );
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
                                    {activity.ModifiedOn}
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
                                    {activity.ModifiedOn}
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
                                    {activity.ModifiedOn}
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
                        <>
                          {
                            this.state.applicationActivities.map(
                              (applicationActivity, index) => {
                                if (
                                  !(
                                    applicationActivity.ActivityFields
                                      .mx_Custom_10 ||
                                    applicationActivity.ActivityFields
                                      .mx_Custom_11 ||
                                    applicationActivity.ActivityFields
                                      .mx_Custom_12
                                  )
                                ) {
                                  return (
                                    <div
                                      className="col-md-12 body-box"
                                      key={index + "a"}
                                    >
                                      <div className="col-md-4 d-inline-block no-padding box-display">
                                        <div className="col-md-12 enquiry-text">
                                          Application
                                        </div>
                                        <div className="col-md-12 no-padding">
                                          <div className="submitted-box">
                                            Submitted
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-4 d-inline-block no-padding box-display">
                                        <div className="col-md-12 application-number">
                                          PS-
                                          {nonDigitRemove(
                                            applicationActivity.RelatedProspectId
                                          )}
                                        </div>
                                        <div className="col-md-12 no-padding">
                                          <span className="last-updated">
                                            Last Updated On :
                                          </span>
                                          <span className="date-update">
                                            {applicationActivity.ModifiedOn}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="col-md-4 btn-block box-display">
                                        <Link
                                          className="btn btn-view"
                                          to={`/applicationPreview/${applicationActivity.Id}`}
                                        >
                                          View Application
                                        </Link>
                                      </div>
                                    </div>
                                  );
                                } else if (
                                  applicationActivity.ActivityFields
                                    .mx_Custom_10 &&
                                  JSON.parse(
                                    applicationActivity.ActivityFields
                                      .mx_Custom_10
                                  ).Status === "Approved - Call for Assessment"
                                ) {
                                  return (
                                    <div
                                      className="col-md-12 body-box"
                                      key={index + "a"}
                                    >
                                      <div className="col-md-4 d-inline-block no-padding box-display">
                                        <div className="col-md-12 enquiry-text">
                                          Application
                                        </div>
                                        <div className="col-md-12 no-padding">
                                          <div className="approved-box">
                                            {
                                              JSON.parse(
                                                applicationActivity
                                                  .ActivityFields.mx_Custom_10
                                              ).Status.split("-")[0]
                                            }
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-4 d-inline-block no-padding box-display">
                                        <div className="col-md-12 application-number">
                                          PS-
                                          {nonDigitRemove(
                                            applicationActivity.RelatedProspectId
                                          )}
                                        </div>
                                        <div className="col-md-12 no-padding">
                                          <span className="last-updated">
                                            Last Updated On :
                                          </span>
                                          <span className="date-update">
                                            {applicationActivity.ModifiedOn}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="col-md-4 btn-block box-display">
                                        <Link
                                          className="btn btn-view"
                                          to={`/applicationPreview/${applicationActivity.Id}`}
                                        >
                                          View Application
                                        </Link>
                                      </div>
                                    </div>
                                  );
                                } else if (
                                  applicationActivity.ActivityFields
                                    .mx_Custom_10 &&
                                  JSON.parse(
                                    applicationActivity.ActivityFields
                                      .mx_Custom_10
                                  ).Status === "Rejected - Call for Assessment"
                                ) {
                                  return (
                                    <div
                                      className="col-md-12 body-box"
                                      key={index + "a"}
                                    >
                                      <div className="col-md-4 d-inline-block no-padding box-display">
                                        <div className="col-md-12 enquiry-text">
                                          Application
                                        </div>
                                        <div className="col-md-12 no-padding">
                                          <div className="reject-box">
                                            {
                                              JSON.parse(
                                                applicationActivity
                                                  .ActivityFields.mx_Custom_10
                                              ).Status.split("-")[0]
                                            }
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-4 d-inline-block no-padding box-display">
                                        <div className="col-md-12 application-number">
                                          PS-
                                          {nonDigitRemove(
                                            applicationActivity.RelatedProspectId
                                          )}
                                        </div>
                                        <div className="col-md-12 no-padding">
                                          <span className="last-updated">
                                            Last Updated On :
                                          </span>
                                          <span className="date-update">
                                            {applicationActivity.ModifiedOn}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="col-md-4 btn-block box-display">
                                        <Link
                                          className="btn btn-start"
                                          to={`/applicationForm`}
                                        >
                                          Start New Application
                                        </Link>
                                      </div>
                                    </div>
                                  );
                                } else if (
                                  applicationActivity.ActivityFields
                                    .mx_Custom_11 &&
                                  JSON.parse(
                                    applicationActivity.ActivityFields
                                      .mx_Custom_11
                                  ).Status !== null
                                ) {
                                  return (
                                    <div
                                      className="col-md-12 body-box"
                                      key={index + "a"}
                                    >
                                      <div className="col-md-4 d-inline-block no-padding box-display">
                                        <div className="col-md-12 enquiry-text">
                                          Application
                                        </div>
                                        <div className="col-md-12 no-padding">
                                          {JSON.parse(
                                            applicationActivity.ActivityFields
                                              .mx_Custom_11
                                          ).Status.includes("Approved") ? (
                                            <div className="approved-box">
                                              {
                                                JSON.parse(
                                                  applicationActivity
                                                    .ActivityFields.mx_Custom_11
                                                ).Status.split("-")[0]
                                              }
                                            </div>
                                          ) : (
                                            <>
                                              {JSON.parse(
                                                applicationActivity
                                                  .ActivityFields.mx_Custom_11
                                              ).Status.includes("Reject")}
                                              ?
                                              <div className="reject-box">
                                                {
                                                  JSON.parse(
                                                    applicationActivity
                                                      .ActivityFields
                                                      .mx_Custom_11
                                                  ).Status.split("-")[0]
                                                }
                                              </div>
                                              :
                                              <div className="submitted-box">
                                                {
                                                  JSON.parse(
                                                    applicationActivity
                                                      .ActivityFields
                                                      .mx_Custom_11
                                                  ).Status.split("-")[0]
                                                }
                                              </div>
                                            </>
                                          )}
                                        </div>
                                      </div>
                                      <div className="col-md-4 d-inline-block no-padding box-display">
                                        <div className="col-md-12 application-number">
                                          PS-
                                          {nonDigitRemove(
                                            applicationActivity.RelatedProspectId
                                          )}
                                        </div>
                                        <div className="col-md-12 no-padding">
                                          <span className="last-updated">
                                            Last Updated On :
                                          </span>
                                          <span className="date-update">
                                            {applicationActivity.ModifiedOn}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="col-md-4 btn-block box-display">
                                        {JSON.parse(
                                          applicationActivity.ActivityFields
                                            .mx_Custom_11
                                        ).Status.includes("Approved") ? (
                                          <Link
                                            className="btn btn-view"
                                            to={`/applicationPreview/${applicationActivity.Id}`}
                                          >
                                            View Application
                                          </Link>
                                        ) : (
                                          <>
                                            {JSON.parse(
                                              applicationActivity.ActivityFields
                                                .mx_Custom_11
                                            ).Status.includes("Reject")}
                                            ?
                                            <div className="col-md-4 btn-block box-display">
                                              <Link
                                                className="btn btn-start"
                                                to={`/applicationForm`}
                                              >
                                                Start New Application
                                              </Link>
                                            </div>
                                            :
                                            <Link
                                              className="btn btn-view"
                                              to={`/applicationPreview/${applicationActivity.Id}`}
                                            >
                                              View Application
                                            </Link>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  );
                                } else if (
                                  applicationActivity.ActivityFields
                                    .mx_Custom_12 &&
                                  JSON.parse(
                                    applicationActivity.ActivityFields
                                      .mx_Custom_12
                                  ).Status !== null
                                ) {
                                  return (
                                    <div
                                      className="col-md-12 body-box"
                                      key={index + "a"}
                                    >
                                      <div className="col-md-4 d-inline-block no-padding box-display">
                                        <div className="col-md-12 enquiry-text">
                                          Application
                                        </div>
                                        <div className="col-md-12 no-padding">
                                          {JSON.parse(
                                            applicationActivity.ActivityFields
                                              .mx_Custom_12
                                          ).Status.includes("Approved") ? (
                                            <div className="approved-box">
                                              {
                                                JSON.parse(
                                                  applicationActivity
                                                    .ActivityFields.mx_Custom_12
                                                ).Status.split("-")[0]
                                              }
                                            </div>
                                          ) : (
                                            <>
                                              {JSON.parse(
                                                applicationActivity
                                                  .ActivityFields.mx_Custom_12
                                              ).Status.includes("Reject")}
                                              ?
                                              <div className="reject-box">
                                                {
                                                  JSON.parse(
                                                    applicationActivity
                                                      .ActivityFields
                                                      .mx_Custom_12
                                                  ).Status.split("-")[0]
                                                }
                                              </div>
                                              :
                                              <div className="submitted-box">
                                                {
                                                  JSON.parse(
                                                    applicationActivity
                                                      .ActivityFields
                                                      .mx_Custom_12
                                                  ).Status
                                                }
                                              </div>
                                            </>
                                          )}
                                        </div>
                                      </div>
                                      <div className="col-md-4 d-inline-block no-padding box-display">
                                        <div className="col-md-12 application-number">
                                          PS-
                                          {nonDigitRemove(
                                            applicationActivity.RelatedProspectId
                                          )}
                                        </div>
                                        <div className="col-md-12 no-padding">
                                          <span className="last-updated">
                                            Last Updated On :
                                          </span>
                                          <span className="date-update">
                                            {applicationActivity.ModifiedOn}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="col-md-4 btn-block box-display">
                                        {JSON.parse(
                                          applicationActivity.ActivityFields
                                            .mx_Custom_12
                                        ).Status.includes("Approved") ? (
                                          <Link
                                            className="btn btn-view"
                                            to={`/applicationPreview/${applicationActivity.Id}`}
                                          >
                                            View Application
                                          </Link>
                                        ) : (
                                          <>
                                            {JSON.parse(
                                              applicationActivity.ActivityFields
                                                .mx_Custom_12
                                            ).Status.includes("Reject")}
                                            ?
                                            <div className="col-md-4 btn-block box-display">
                                              <Link
                                                className="btn btn-start"
                                                to={`/applicationForm`}
                                              >
                                                Start New Application
                                              </Link>
                                            </div>
                                            :
                                            <Link
                                              className="btn btn-view"
                                              to={`/applicationPreview/${applicationActivity.Id}`}
                                            >
                                              View Application
                                            </Link>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  );
                                }
                              }
                            )[0]
                          }
                        </>
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
