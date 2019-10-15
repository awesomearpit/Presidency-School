import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import OtpInput from "react-otp-input";
import { otpVerify, register } from "../../utils/API";
import moment from "moment";
import Timer from "react-compound-timer";

class OtpModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      otp: this.props.state.emptyField,
      status: "",
      errorMessage: null,
      isResendOtp: false,
      time: "",
      successMessage: "",
    };
  }

  componentDidMount() {
    this.setState({ otp: "" });

    setTimeout(() => {
      console.log("Resend");
      this.setState({ isResendOtp: true });
    }, 120000);
  }

  async componentDidUpdate(prevProps, prevState) {
    if (prevState.otp !== this.state.otp) {
      if (this.state.otp.length === 6) {
        const otpVerifyData = {
          Otp: `${this.state.otp}`,
          FieldContent: `${this.props.fieldContent}`,
          Code: `${this.props.code}`,
        };
        try {
          const { data } = await otpVerify(otpVerifyData);
          this.setState({ status: data.Status });
          if (data.Status === "Success") {
            // this.props.handleClose();
            const signupData = {
              LeadFields: [
                {
                  Attribute: "FirstName",
                  Value: `${this.props.state.name}`,
                },
                {
                  Attribute: "mx_Grade_Applied_for",
                  Value: `${this.props.state.grade}`,
                },
                {
                  Attribute: "mx_Date_of_Birth",
                  Value: `${moment(this.props.state.dob).format("YYYY-MM-DD")}`,
                },
                {
                  Attribute: "Mobile",
                  Value: `${this.props.state.mobile}`,
                },
                {
                  Attribute: "mx_Portal_Confirm_Password",
                  Value: `${this.props.state.confirmPassword}`,
                },
                {
                  Attribute: "mx_Portal_Password",
                  Value: `${this.props.state.password}`,
                },
                {
                  Attribute: "EmailAddress",
                  Value: `${this.props.state.email}`,
                },
                {
                  Attribute: "mx_School_Applying_for",
                  Value: `${this.props.branch}`,
                },
              ],
            };
            try {
              const { data } = await register(signupData);
              console.log("data", data);
              this.props.successMessage(null);
              this.setState({ successMessage: data.Message });
            } catch (e) {
              console.log("error signup", e);
              this.props.handleClose();
              this.props.errorMessage(e.response.data.ExceptionMessage);
            }
          }
        } catch (e) {
          console.log("error", e);
        }
      }
    }
  }

  checkStatus = () => {
    if (this.state.status === "Failure") {
      return true;
    }
    return false;
  };

  incorrectMessage = () => {
    if (this.state.status === "Failure") {
      return "Incorrect OTP";
    }
    return null;
  };

  render() {
    return (
      <>
        <Modal
          show={this.props.show}
          className="otp-modal"
          onHide={this.props.handleShow}
        >
          <div className="col-md-12 text-right otp-close">
            <button className="btn btn-link" onClick={this.props.handleClose}>
              <i className="fa fa-times" aria-hidden="true"></i>
            </button>
          </div>
          <div className="row otp-box">
            {this.state.successMessage === "Registration Successful" ? (
              <>
                <div className="successOtp">
                  <div className="row no-margin">
                    <div className="col-md-12 check-box">
                      <i className="fa fa-check-circle" aria-hidden="true"></i>
                    </div>
                    <div className="col-md-12 text">
                      {this.state.successMessage}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="col-md-12 otp-heading">Verify OTP</div>
                <div className="col-md-12 otp-text">
                  A 6 digit OTP has been sent to +91-{this.props.fieldContent}
                </div>
                <div className="col-md-12 otp-layout">
                  <OtpInput
                    onChange={otp => this.setState({ otp })}
                    numInputs={6}
                    inputStyle="form-control otp-input"
                    value={this.state.otp}
                    isInputNum={false}
                    hasErrored={this.checkStatus}
                    shouldAutoFocus={true}
                  />
                </div>
                <div className="col-md-12 otp-incorrect">
                  {this.incorrectMessage()}
                </div>
                <div className="col-md-12 otp-resend">
                  {this.state.isResendOtp ? (
                    <button
                      className="btn btn-link"
                      onClick={this.props.signup}
                    >
                      Resend OTP
                    </button>
                  ) : (
                    <Timer initialTime={120000} direction="backward">
                      {() => (
                        <>
                          <Timer.Minutes />:
                          <Timer.Seconds />
                        </>
                      )}
                    </Timer>
                  )}
                </div>
              </>
            )}
          </div>
        </Modal>
      </>
    );
  }
}

export default OtpModal;
