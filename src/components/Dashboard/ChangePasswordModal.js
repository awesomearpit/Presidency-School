import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import axios from "axios";
import { post, updatePasword } from "../../utils/API";
import {
  checkPassword,
  validatePassword,
  required,
} from "../../utils/Validations";
import { PRIVATE_AUTH_KEY } from "../../utils/Constants";

class ChangePasswordModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      errors: {
        currentPasswordError: null,
        newPasswordError: null,
        confirmPasswordError: null,
      },
      errorMessage: null,
      successMessage: null,
    };
  }

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  validityCheck = () => {
    const { confirmPassword, currentPassword, newPassword } = this.state;
    return (
      newPassword &&
      currentPassword &&
      confirmPassword &&
      newPassword === confirmPassword &&
      newPassword.match(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
      )
    );
  };

  updatePassword = async () => {
    this.validateInputs();
    if (this.validityCheck()) {
      const updatePasswordData = {
        CurrentPassword: this.state.currentPassword,
        NewPassword: this.state.newPassword,
      };
      try {
        axios.defaults.headers.common["Authorization"] = PRIVATE_AUTH_KEY;
        const { data } = await updatePasword(updatePasswordData);
        this.setState({ successMessage: data.ResponseText });
      } catch (e) {
        console.log("Update Password Error", e.response.data);
        this.setState({ errorMessage: e.response.data.ExceptionMessage });
      }
    } else {
      console.log("Enter valid Details");
    }
  };

  validateInputs = () => {
    const { confirmPassword, currentPassword, newPassword } = this.state;
    const errors = {
      newPasswordError: null,
      confirmPasswordError: null,
      currentPasswordError: null,
    };
    errors.newPasswordError = checkPassword(newPassword);
    errors.confirmPasswordError = validatePassword(
      newPassword,
      confirmPassword
    );
    errors.currentPasswordError = required(currentPassword);
    this.setState({ errors });
  };

  render() {
    const {
      newPassword,
      confirmPassword,
      currentPassword,
      errors,
      errorMessage,
      successMessage,
    } = this.state;
    return (
      <>
        <Modal
          show={this.props.show}
          className="changePassword-modal"
          onHide={this.props.onHide}
        >
          <div className="col-md-12 text-right changePassword-close">
            <button className="btn btn-link" onClick={this.props.onHide}>
              <i className="fa fa-times" aria-hidden="true"></i>
            </button>
          </div>
          {successMessage ? (
            <div className="success-container">
              <div className="row no-margin">
                <div className="col-md-12 check-box">
                  <i className="fa fa-check-circle" aria-hidden="true"></i>
                </div>
                <div className="col-md-12 text">{successMessage}</div>
              </div>
            </div>
          ) : (
            <div className="row changePassword-box">
              <div className="col-md-12 heading">Change Password</div>
              {errorMessage ? (
                <div
                  className="col-md-12"
                  style={{
                    textAlign: "center",
                    color: "#FD1F1F",
                    fontWeight: "bold",
                  }}
                >
                  {errorMessage}
                </div>
              ) : null}

              <div className="col-md-12 input-box">
                <input
                  type="password"
                  placeholder="Enter Current Password"
                  name="currentPassword"
                  className="form-control"
                  value={currentPassword}
                  onChange={this.handleChange}
                />
                {errors.currentPasswordError ? (
                  <span className="error-warning">
                    {errors.currentPasswordError}
                  </span>
                ) : null}
              </div>
              <div className="col-md-12 input-box">
                <input
                  type="password"
                  placeholder="Enter New Password"
                  name="newPassword"
                  className="form-control"
                  value={newPassword}
                  onChange={this.handleChange}
                />
                {errors.newPasswordError ? (
                  <span className="error-warning">
                    {errors.newPasswordError}
                  </span>
                ) : null}
              </div>
              <div className="col-md-12 input-box">
                <input
                  type="password"
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  className="form-control"
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
                  className="btn changePassword-btn"
                  onClick={this.updatePassword}
                >
                  Update Password
                </button>
              </div>
            </div>
          )}
        </Modal>
      </>
    );
  }
}

export default ChangePasswordModal;
