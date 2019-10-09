import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Header from "./Header";
import "../assets/css/forgotPassword.scss";
import { post } from "../utils/API";
import { SECRET_KEY, ACCESS_KEY } from "../utils/Constants";
import SuccessMessage from "./SuccessMessage";
import { validateEmail } from "../utils/Validations";

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      tempPassword: null,
      errorMessage: null,
      errors: {
        emailError: null,
      },
    };
  }

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  validateAllInputs = () => {
    const errors = {
      emailError: null,
    };
    const { email } = this.state;

    errors.emailError = validateEmail(email);

    this.setState({ errors });
  };

  forgotPassword = async () => {
    this.validateAllInputs();
    if (this.emailValidity()) {
      const forgotPassData = {
        EmailAddress: this.state.email,
      };

      try {
        const { data } = await post(
          `/api/Authentication/ForgotPassword?accessKey=${ACCESS_KEY}&secretKey=${SECRET_KEY}`,
          forgotPassData
        );
        this.setState({ tempPassword: data.TemporaryPassword });
      } catch (e) {
        this.setState({ errorMessage: e.response.data.ExceptionMessage });
      }
    } else {
      console.log("Enter valid email address");
    }
  };

  emailValidity = () => {
    return (
      this.state.email &&
      this.state.email.includes("@") &&
      this.state.email.includes(".")
    );
  };

  render() {
    const { email, tempPassword, errorMessage, errors } = this.state;
    return (
      <>
        <Header />
        <div className="forgotpassword">
          {tempPassword === null ? (
            <div className="forgotpassword-container">
              <div className="row no-margin">
                <div className="col-md-12 heading">Forgot Password</div>
                <div className="col-md-12 text">
                  Please enter your email, We will send a password reset link.
                </div>
                <div className="col-md-12 no-padding">
                  <input
                    className="form-control"
                    type="email"
                    placeholder="Enter your Email"
                    name="email"
                    value={email}
                    onChange={this.handleChange}
                  />
                  {errors.emailError ? (
                    <div className="error-warning">{errors.emailError}</div>
                  ) : null}
                  {errorMessage ? (
                    <div
                      className="error-warning"
                      style={{ marginBottom: "20px" }}
                    >
                      {errorMessage}
                    </div>
                  ) : null}
                </div>
                <div className="col-md-12 no-padding">
                  <button
                    className="btn forgot-btn"
                    onClick={this.forgotPassword}
                  >
                    Send Password Reset Link
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <SuccessMessage
              message={"A password reset link sent to your email"}
            />
          )}
        </div>
      </>
    );
  }
}

export default withRouter(ForgotPassword);
