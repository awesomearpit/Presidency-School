import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import "../assets/css/dashboard.scss";
import "../assets/css/forgotPassword.scss";
import Header from "./Dashboard/Header";
import { logout, activityPost, activityPostEvent } from "../utils/API";
import { ACCESS_KEY, SECRET_KEY, LEAD_ID } from "../utils/Constants";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      activities: [],
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
                    <div className="col-md-6 name">
                      Hello {this.state.userName},
                    </div>
                    <div className="col-md-6 btn-box">
                      <Link to={"/enquiryForm"} className="btn new-enquiry-btn">
                        New Enquiry
                      </Link>
                    </div>
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
                          <div className="col-md-4 d-inline-block">
                            <div className="col-md-12 application-number">
                              PS-24459595966
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
                              className="btn btn-view"
                              to={`/enquiryForm/${activity.Id}`}
                            >
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
                          <div className="col-md-4 d-inline-block">
                            <div className="col-md-12 application-number">
                              PS-24459595966
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
                              to={`/enquiryForm/${activity.Id}`}
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
                          <div className="col-md-4 d-inline-block"></div>
                          <div className="col-md-4 d-inline-block"></div>
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default withRouter(Dashboard);
