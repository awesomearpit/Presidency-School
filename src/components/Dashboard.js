import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import "../assets/css/dashboard.scss";
import "../assets/css/forgotPassword.scss";
import Header from "./Dashboard/Header";
import { logout, activityPost, activityPostEvent } from "../utils/API";
import { ACCESS_KEY, SECRET_KEY, LEAD_ID } from "../utils/Constants";
import { nonDigitRemove } from "../utils/functions";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      activities: [],
      applicationActivities: [],
      application: {},
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
    try {
      const { data } = await activityPost(
        `https://api-in21.leadsquared.com/v2/ProspectActivity.svc/Retrieve?accessKey=${ACCESS_KEY}&secretKey=${SECRET_KEY}&leadId=${LEAD_ID}`
      );
      console.log("actvity fields", data);
      if (data.RecordCount === 0) {
        this.props.history.push("/enquiryForm");
      }
      this.setState({ activities: data.ProspectActivities });
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
      });
      console.log("data", data);
    } catch (e) {
      console.log("error", e);
    }
  }

  render() {
    return (
      <>
        <Header logout={this.logout} getUserName={this.getUserName} />
        <div style={{ backgroundColor: "#EBEEF1" }}>
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
                  {this.state.activities.map((activity, index) => {
                    if (
                      Object.entries(activity.ActivityFields).length === 0 &&
                      activity.ActivityFields.constructor === Object
                    ) {
                      return (
                        <div className="col-md-12 body-box" key={index}>
                          <div className="col-md-4 d-inline-block no-padding">
                            <div className="col-md-12 enquiry-text">
                              Enquiry
                            </div>
                            <div className="col-md-12 no-padding">
                              <div className="submitted-box">Submitted</div>
                            </div>
                          </div>
                          <div className="col-md-4 d-inline-block no-padding">
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
                          <div className="col-md-4 btn-block">
                            <Link className="btn btn-view" to={`/enquiryForm`}>
                              View Application
                            </Link>
                          </div>
                        </div>
                      );
                    } else if (activity.ActivityFields.Status === "Approved") {
                      return (
                        <div className="col-md-12 body-box" key={index}>
                          <div className="col-md-4 d-inline-block no-padding">
                            <div className="col-md-12 enquiry-text">
                              Enquiry
                            </div>
                            <div className="col-md-12 no-padding">
                              <div className="approved-box">
                                {activity.ActivityFields.Status}
                              </div>
                            </div>
                          </div>
                          <div className="col-md-4 d-inline-block no-padding">
                            <div className="col-md-12 application-number">
                              PS-{nonDigitRemove(activity.RelatedProspectId)}
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
                          <div className="col-md-4 btn-block">
                            <Link
                              className="btn btn-start"
                              to={`/applicationForm`}
                            >
                              Start Application
                            </Link>
                          </div>
                        </div>
                      );
                    } else if (activity.ActivityFields.Status === "Rejected") {
                      return (
                        <div className="col-md-12 body-box" key={index}>
                          <div className="col-md-4 d-inline-block no-padding">
                            <div className="col-md-12 enquiry-text">
                              Enquiry
                            </div>
                            <div className="col-md-12 no-padding">
                              <div className="reject-box">
                                {activity.ActivityFields.Status}
                              </div>
                            </div>
                          </div>
                          <div className="col-md-4 d-inline-block no-padding">
                            <div className="col-md-12 application-number">
                              PS-{nonDigitRemove(activity.RelatedProspectId)}
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
                          <div className="col-md-4 btn-block">
                            <Link className="btn btn-view" to={`/enquiryForm`}>
                              View Application
                            </Link>
                          </div>
                        </div>
                      );
                    }
                  })}
                  <>
                    {this.state.application.RecordCount !== 0 ? (
                      <>
                        {this.state.applicationActivities.map(
                          (applicationActivity, index) => {
                            if (
                              JSON.parse(
                                applicationActivity.ActivityFields.mx_Custom_9
                              ).Status === "Approved"
                            ) {
                              return (
                                <div
                                  className="col-md-12 body-box"
                                  key={index + "a"}
                                >
                                  <div className="col-md-4 d-inline-block no-padding">
                                    <div className="col-md-12 enquiry-text">
                                      Application
                                    </div>
                                    <div className="col-md-12 no-padding">
                                      <div className="approved-box">
                                        {
                                          JSON.parse(
                                            applicationActivity.ActivityFields
                                              .mx_Custom_9
                                          ).Status
                                        }
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-4 d-inline-block no-padding">
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
                                  <div className="col-md-4 btn-block">
                                    <Link
                                      className="btn btn-view"
                                      to={`/applicationPreview`}
                                    >
                                      View Application
                                    </Link>
                                  </div>
                                </div>
                              );
                            } else if (
                              JSON.parse(
                                applicationActivity.ActivityFields.mx_Custom_9
                              ).Status === "Pending"
                            ) {
                              return (
                                <div
                                  className="col-md-12 body-box"
                                  key={index + "a"}
                                >
                                  <div className="col-md-4 d-inline-block no-padding">
                                    <div className="col-md-12 enquiry-text">
                                      Application
                                    </div>
                                    <div className="col-md-12 no-padding">
                                      <div className="pending-box">
                                        {
                                          JSON.parse(
                                            applicationActivity.ActivityFields
                                              .mx_Custom_9
                                          ).Status
                                        }
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-4 d-inline-block no-padding">
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
                                  <div className="col-md-4 btn-block">
                                    <Link
                                      className="btn btn-start"
                                      to={`/applicationForm`}
                                    >
                                      Continue Application
                                    </Link>
                                  </div>
                                </div>
                              );
                            } else if (
                              JSON.parse(
                                applicationActivity.ActivityFields.mx_Custom_9
                              ).Status === "Rejected"
                            ) {
                              return (
                                <div
                                  className="col-md-12 body-box"
                                  key={index + "a"}
                                >
                                  <div className="col-md-4 d-inline-block no-padding">
                                    <div className="col-md-12 enquiry-text">
                                      Application
                                    </div>
                                    <div className="col-md-12 no-padding">
                                      <div className="pending-box">
                                        {
                                          JSON.parse(
                                            applicationActivity.ActivityFields
                                              .mx_Custom_9
                                          ).Status
                                        }
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-4 d-inline-block no-padding">
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
                                  <div className="col-md-4 btn-block">
                                    <Link
                                      className="btn btn-view"
                                      to={`/applicationPreview`}
                                    >
                                      View Application
                                    </Link>
                                  </div>
                                </div>
                              );
                            }
                          }
                        )}
                      </>
                    ) : null}
                  </>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

const Application = props => {
  if (props.application.RecordCount !== 0) {
    console.log("Application Activity", props.application.RecordCount);
    return null;
    // props.applicationActivities.map(
    //   (applicationActivity, index) => {
    //     return <div>Arpit</div>;
    //   }
    // JSON.parse(applicationActivity.ActivityFields.mx_Custom_1).Status
    // );
  } else {
    return null;
  }
};

export default withRouter(Dashboard);
