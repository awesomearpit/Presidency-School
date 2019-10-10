import React, { Component } from "react";
import {
  validateName,
  validateMobile,
  checkPassword,
  validateEmail,
  validatePassword,
  validateGrades,
  validateDob,
} from "../../utils/Validations";
import { register, otp } from "../../utils/API";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_green.css";
import Loader from "react-loader-spinner";
import OtpModal from "./OtpModal";

class Register extends Component {
  constructor(props) {
    super(props);
    this.grades = [
      "Pre-K",
      "K-1",
      "K-2",
      "Grade-1",
      "Grade-2",
      "Grade-3",
      "Grade-4",
      "Grade-5",
      "Grade-6",
      "Grade-7",
      "Grade-8",
      "Grade-9",
      "Grade-10",
      "Grade-11 Science",
      "Grade-12 Science",
      "Grade-11 Commerce",
      "Grade-12 Commerce",
      "PU-1 Science",
      "PU-2 Science",
      "PU-1 Commerce",
      "PU-2 Commerce",
    ];
    this.state = {
      name: "",
      grade: "",
      dob: "",
      email: "",
      mobile: "",
      password: "",
      confirmPassword: "",
      isRegisterLoading: false,
      errors: {
        nameError: null,
        gradeError: null,
        dobError: null,
        mobileError: null,
        emailError: null,
        passwordError: null,
        confirmPasswordError: null,
      },
      errorMessage: "",
      successMessage: "",
      show: false,
      setShow: false,
      otp: "",
      formOtpCode: "",
      filedContent: "",
      emptyField: "",
    };
  }

  validateAllInputs = () => {
    const errors = {
      nameError: null,
      gradeError: null,
      dobError: null,
      mobileError: null,
      emailError: null,
      passwordError: null,
      confirmPasswordError: null,
    };
    const {
      name,
      grade,
      dob,
      email,
      mobile,
      password,
      confirmPassword,
    } = this.state;
    errors.nameError = validateName(name);
    errors.mobileError = validateMobile(mobile);
    errors.passwordError = checkPassword(password);
    errors.emailError = validateEmail(email);
    errors.gradeError = validateGrades(grade);
    errors.dobError = validateDob(dob);
    errors.confirmPasswordError = validatePassword(password, confirmPassword);
    this.setState({ errors });
  };

  validityCheck = () => {
    const {
      name,
      grade,
      dob,
      email,
      mobile,
      password,
      confirmPassword,
    } = this.state;
    return (
      name &&
      grade &&
      dob &&
      mobile &&
      email &&
      password &&
      confirmPassword &&
      password === confirmPassword
    );
  };

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  showOTPModal = () => {
    this.setState({
      setShow: true,
      show: true,
    });
  };

  closeOTPModal = () => {
    this.setState({
      show: false,
    });
  };

  successMessage = value => {
    this.setState({ successMessage: value });
  };

  errorMessage = value => {
    this.setState({ errorMessage: value });
  };

  signUp = async () => {
    this.setState({ isRegisterLoading: true });
    this.validateAllInputs();
    if (this.validityCheck()) {
      const otpData = {
        FormId: "00ac15b8-e361-11e9-aebf-02b00a4d022c",
        SchemaName: "Mobile",
        FieldDataType: "phone",
        FieldContent: `${this.state.mobile}`,
      };
      try {
        const { data } = await otp(otpData);
        console.log("data signup", data);
        this.setState({
          setShow: true,
          show: true,
          emptyField: "",
          formOtpCode: data.FormOTPResponseModel.Code,
          fieldContent: data.FormOTPResponseModel.FieldContent,
          isRegisterLoading: false,
        });
      } catch (e) {
        // console.log("Signup Error", e.response.data);
        this.setState({ isRegisterLoading: false });
      }
    } else {
      console.log("Enter valid Details");
    }
  };

  render() {
    const {
      name,
      grade,
      dob,
      email,
      mobile,
      password,
      confirmPassword,
      errors,
      successMessage,
      errorMessage,
    } = this.state;

    const isEnable =
      name && grade && dob && email && mobile && password && confirmPassword;
    return (
      <>
        <div className="col-md-5 signup-container">
          <div className="col-md-12 signup-heading">REGISTER TO APPLY</div>
          {successMessage === "Registration Successful" ? (
            <div
              style={{
                color: "green",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              {successMessage}
            </div>
          ) : (
            <div
              style={{
                color: "#FD1F1F",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              {errorMessage}
            </div>
          )}
          <div className="col-md-12 input-box">
            <input
              type="text"
              placeholder="Full Name"
              className="form-control"
              name="name"
              value={name}
              onChange={this.handleChange}
            />
            {errors.nameError ? (
              <span className="error-warning">{errors.nameError}</span>
            ) : null}
          </div>
          <div className="col-md-12 input-box">
            <select
              value={grade}
              onChange={this.handleChange}
              name="grade"
              className="form-control"
            >
              <option value="">Grade Applied For</option>
              {this.grades.map((grade, index) => (
                <option value={grade} key={index}>
                  {grade}
                </option>
              ))}
            </select>
            {errors.gradeError ? (
              <span className="error-warning">{errors.gradeError}</span>
            ) : null}
          </div>
          <div className="col-md-12 input-box">
            {/* <input
              type="text"
              placeholder="Date Of Birth"
              className="form-control"
              name="dob"
              onFocus={e => (e.currentTarget.type = "date")}
              onBlur={e => {
                e.currentTarget.type = "text";
                e.currentTarget.placeholder = "Date Of Birth";
              }}
              value={dob}
              onChange={this.handleChange}
            /> */}
            <Flatpickr
              className="form-control"
              placeholder="Select DOB"
              value={dob}
              data-input
              onChange={date => {
                this.setState({ dob: date[0] });
              }}
              options={{
                maxDate: new Date(),
                dateFormat: "d/m/Y",
              }}
              data-input
            />
            {errors.dobError ? (
              <span className="error-warning">{errors.dobError}</span>
            ) : null}
          </div>
          <div className="col-md-12 input-box">
            <input
              type="email"
              placeholder="Email Id"
              className="form-control"
              name="email"
              value={email}
              onChange={this.handleChange}
            />
            {errors.emailError ? (
              <span className="error-warning">{errors.emailError}</span>
            ) : null}
          </div>
          <div className="col-md-12 input-box">
            <input
              type="tel"
              placeholder="Phone Number"
              className="form-control"
              name="mobile"
              value={mobile}
              onChange={this.handleChange}
            />
            {errors.mobileError ? (
              <span className="error-warning">{errors.mobileError}</span>
            ) : null}
          </div>
          <div className="col-md-12 input-box">
            <input
              type="password"
              placeholder="Password"
              className="form-control"
              name="password"
              value={password}
              onChange={this.handleChange}
            />
            {errors.passwordError ? (
              <span className="error-warning">{errors.passwordError}</span>
            ) : null}
          </div>
          <div className="col-md-12 input-box">
            <input
              type="password"
              placeholder="Retype Password"
              className="form-control"
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
          <div className="col-md-12 button-box">
            <button
              className="btn signup-button"
              onClick={this.signUp}
              // disabled={!isEnable}
            >
              {this.state.isRegisterLoading ? (
                <div className="d-inline-block">
                  <Loader type="Oval" color="#FFF" height={20} width={30} />
                </div>
              ) : null}
              <div className="d-inline-block">Register</div>
            </button>
          </div>
          {this.state.show ? (
            <OtpModal
              handleShow={this.showOTPModal}
              handleClose={this.closeOTPModal}
              show={this.state.show}
              mobile={this.state.mobile}
              code={this.state.formOtpCode}
              fieldContent={this.state.fieldContent}
              state={this.state}
              successMessage={this.successMessage}
              errorMessage={this.errorMessage}
              signup={this.signUp}
              branch={this.props.branch}
            />
          ) : null}
        </div>
      </>
    );
  }
}

export default Register;
