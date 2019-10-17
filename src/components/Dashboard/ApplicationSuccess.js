import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Header from "./Header";
import { logout } from "../../utils/API";
import "../../assets/css/dashboard.scss";

class ApplicationSuccess extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
    };
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
        <Header logout={this.logout} getUserName={this.getUserName} />

        <div className="enquiry-success">
          <div className="enquirySuccess-box">
            <div className="enquiry-container">
              <div className="row no-margin">
                <div className="col-md-12 check-box">
                  <i className="fa fa-check-circle" aria-hidden="true"></i>
                </div>
                <div className="col-md-12 heading">
                  Your Application Successfully Submitted.
                </div>
                <div className="col-md-12 text">
                  Our representative will contact you via your registered email
                  and phone number as soon as possible.
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default withRouter(ApplicationSuccess);
