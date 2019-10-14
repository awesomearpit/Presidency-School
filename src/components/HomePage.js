import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import "../assets/css/homepage.scss";
import Logo from "../assets/images/logo.png";
import Landing from "../assets/images/landing.jpg";
import Register from "./HomePage/Register";
import { signIn, activityPost } from "../utils/API";
import cookie from "react-cookies";
import { ACCESS_KEY, SECRET_KEY, PRIVATE_AUTH_KEY } from "../utils/Constants";
import { validateEmail, required } from "../utils/Validations";
import Loader from "react-loader-spinner";
import BranchModal from "./HomePage/BranchModal";

class Homepage extends Component {
  constructor(props) {
    super(props);
    this.branch = ["PSBN", "PSBS", "PSBE", "PSMNG", "PSNLO", "PSRTN", "SPES"];
    this.state = {
      email: "",
      password: "",
      errorMessage: null,
      isLoginLoading: false,
      show: false,
      setShow: false,
      branchName: "",
      errors: {
        emailError: null,
        passwordError: null,
      },
    };
  }

  validateAllInputs = () => {
    const errors = {
      emailError: null,
      passwordError: null,
    };

    const { email, password } = this.state;

    errors.emailError = validateEmail(email);
    errors.passwordError = required(password);

    this.setState({ errors });
  };

  componentWillMount() {
    const branch = this.props.location.search.split("=")[1];
    if (!branch) {
      this.setState({
        setShow: true,
        show: true,
      });
    } else {
      this.setState({ branchName: branch });
    }
  }

  componentDidMount() {
    if (PRIVATE_AUTH_KEY) {
      this.props.history.push("/dashboard");
    }
  }

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  login = async () => {
    this.setState({ errorMessage: null });
    this.validateAllInputs();
    if (this.isPresentAllInputs()) {
      this.setState({ isLoginLoading: true });
      const loginData = {
        EmailAddress: this.state.email,
        Password: this.state.password,
      };

      try {
        const { data } = await signIn(loginData);
        var LEAD_ID = data.LeadId;
        cookie.save("AuthKey", data.AuthKey, { path: "/", maxAge: 14400 });
        cookie.save("LeadId", data.LeadId, { path: "/", maxAge: 14400 });
        this.setState({ isLoginLoading: false });
        try {
          const { data } = await activityPost(
            `https://api-in21.leadsquared.com/v2/ProspectActivity.svc/Retrieve?accessKey=${ACCESS_KEY}&secretKey=${SECRET_KEY}&leadId=${LEAD_ID}`
          );
          if (data.RecordCount === 0) {
            this.props.history.push("/enquiryForm");
            window.location.reload();
          } else {
            this.props.history.push("/dashboard");
            window.location.reload();
          }
        } catch (e) {
          console.log("error", e);
        }
      } catch (e) {
        console.log("Error login", e.response.data.ExceptionMessage);
        this.setState({
          errorMessage: e.response.data.ExceptionMessage,
          isLoginLoading: false,
        });
      }
    } else {
      console.log("Enter valid email address and password");
    }
  };

  isPresentAllInputs = () => {
    return (
      this.state.email &&
      this.state.email.includes("@") &&
      this.state.email.includes(".") &&
      this.state.password
    );
  };

  handleBranchChange = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  showBranchModal = () => {
    this.setState({
      setShow: true,
      show: true,
    });
  };

  closeBranchModal = () => {
    this.setState({
      show: false,
    });
  };

  changeModal = (show, value) => {
    this.setState({ show: show, branchName: value });
  };

  render() {
    const { email, password, errorMessage, errors, branchName } = this.state;
    const branch = this.props.location.search.split("=")[1];
    return (
      <>
        <BranchModal
          show={this.state.show}
          showBranchModal={this.showBranchModal}
          setShow={this.state.setShow}
          branch={this.branch}
          changeModal={this.changeModal}
        />
        <div className="homepage container-fluid">
          <div className="main">
            <div className="header row">
              <div className="col-md-4 logo-box">
                <div className="col-md-12 text-center ">
                  <img
                    src={Logo}
                    className="img-responsive logo-box-img"
                    width="221px"
                    height="64px"
                  />
                </div>
                <div className="col-md-12 text-center logo-text">
                  <select
                    name="branchName"
                    value={branchName}
                    onChange={this.handleBranchChange}
                  >
                    {this.branch.map((branch, index) => (
                      <option value={branch} key={index}>
                        {branch}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {/* Login Component Start */}
              <div className="col-md-8 login-box">
                <div className="col-md-12 login-heading">
                  LOGIN TO YOUR ACCOUNT
                </div>
                <div className="row login-input-box">
                  <div className="input-div" style={{ paddingRight: "15px" }}>
                    <input
                      type="text"
                      placeholder="Email Id"
                      className="form-control"
                      name="email"
                      value={email}
                      onChange={this.handleChange}
                    />
                    {errors.emailError ? (
                      <div
                        style={{
                          color: "#FD1F1F",
                          fontSize: "12px",
                        }}
                      >
                        {errors.emailError}
                      </div>
                    ) : null}
                    <div className="col-md-12 no-padding">
                      {errorMessage ? (
                        <span
                          style={{
                            color: "#FD1F1F",
                            fontSize: "12px",
                            fontWeight: "bold",
                          }}
                        >
                          {errorMessage}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className="input-div" style={{ paddingLeft: "15px" }}>
                    <input
                      type="password"
                      placeholder="Password"
                      className="form-control"
                      name="password"
                      value={password}
                      onChange={this.handleChange}
                    />
                    {errors.passwordError ? (
                      <div
                        style={{
                          color: "#FD1F1F",
                          fontSize: "12px",
                        }}
                      >
                        {errors.passwordError}
                      </div>
                    ) : null}
                    <div className="col-md-12 no-padding">
                      <Link to={"/forgotPassword"}>Forgot Password?</Link>
                    </div>
                  </div>
                  <button
                    className="btn btn-primary login-button"
                    onClick={this.login}
                  >
                    {this.state.isLoginLoading ? (
                      <div className="d-inline-block">
                        <Loader
                          type="Oval"
                          color="#FFF"
                          height={20}
                          width={30}
                        />
                      </div>
                    ) : null}
                    <div className="d-inline-block">Login</div>
                  </button>
                </div>
              </div>
              {/* Login Component End */}
            </div>
            {/* Body box Start */}
            <div className="row body-box">
              <div className="col-md-7 image-container">
                <img src={Landing} className="img-responsive" />
              </div>
              {/* Signup Component Start  */}
              <Register branch={branchName} />
              {/* Signup Component End  */}
            </div>
            {/* Body box End */}
          </div>
        </div>
      </>
    );
  }
}

export default withRouter(Homepage);
