import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Header from "./Header";
import "../assets/css/forgotPassword.scss";
import SuccessMessage from "./SuccessMessage";
import { post } from "../utils/API";
import { SECRET_KEY, ACCESS_KEY } from "../utils/Constants";
import { checkPassword, validatePassword } from "../utils/Validations";
import Loader from "react-loader-spinner";

class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      confirmPassword: "",
      tempPassword: "",
      errorMessage: null,
      leadId: "",
      successMessage: null,
      isResetLoading: false,
      errors: {
        passwordError: null,
        confirmPasswordError: null,
      },
    };
  }

  componentDidMount() {
    const { leadId, tempPassword } = this.props.match.params;
    this.setState({ leadId: leadId, tempPassword: tempPassword });
  }

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  validateAllInputs = () => {
    const errors = {
      passwordError: null,
      confirmPasswordError: null,
    };
    const { password, confirmPassword } = this.state;
    errors.passwordError = checkPassword(password);
    errors.confirmPasswordError = validatePassword(password, confirmPassword);
    this.setState({ errors });
  };

  resetPassword = async () => {
    this.validateAllInputs();
    if (this.passwordValidity()) {
      this.setState({ isResetLoading: true });
      const resetPassData = {
        Password: this.state.password,
        LeadId: this.state.leadId,
        TemporaryPassword: this.state.tempPassword,
      };

      try {
        const { data } = await post(
          `/api/Authentication/ResetPassword?accessKey=${ACCESS_KEY}&secretKey=${SECRET_KEY}`,
          resetPassData,
        );

        this.setState({
          successMessage: data.IsSuccessful,
          isResetLoading: false,
        });
      } catch (e) {
        console.log(e.message);
        this.setState({ isResetLoading: false });
      }
    } else {
      console.log("Enter valid password");
    }
  };

  passwordValidity = () => {
    return (
      this.state.password &&
      this.state.password.match(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      ) &&
      this.state.confirmPassword &&
      this.state.password === this.state.confirmPassword
    );
  };

  render() {
    const {
      password,
      confirmPassword,
      successMessage,
      errorMessage,
      errors,
    } = this.state;
    return (
      <>
        <Header />
        <div className="forgotpassword">
          {successMessage === null ? (
            <div className="forgotpassword-container">
              <div className="row no-margin">
                <div className="col-md-12 heading">Reset Password</div>
                <div className="col-md-12 no-padding">
                  <input
                    className="form-control"
                    type="password"
                    placeholder="Enter New Password"
                    name="password"
                    value={password}
                    onChange={this.handleChange}
                  />
                  {errors.passwordError ? (
                    <span className="error-warning">
                      {errors.passwordError}
                    </span>
                  ) : null}
                </div>
                <div className="col-md-12 no-padding">
                  <input
                    className="form-control"
                    type="password"
                    style={{ marginTop: "0px" }}
                    placeholder="Confirm Password"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={this.handleChange}
                  />
                  {errors.confirmPasswordError ? (
                    <span className="error-warning">
                      {errors.confirmPasswordError}
                    </span>
                  ) : null}
                </div>
                <div className="col-md-12 no-padding">
                  <button
                    className="btn forgot-btn"
                    onClick={this.resetPassword}>
                    {this.state.isResetLoading ? (
                      <div className="d-inline-block">
                        <Loader
                          type="Oval"
                          color="#FFF"
                          height={20}
                          width={30}
                        />
                      </div>
                    ) : null}
                    <div className="d-inline-block">Update Password</div>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <SuccessMessage message={"Your Password Updated Successfully"} />
          )}
        </div>
      </>
    );
  }
}

export default withRouter(ResetPassword);
