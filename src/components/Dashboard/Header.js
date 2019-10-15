import React, { Component } from "react";
import Logo from "../../assets/images/logo.png";
import { Dropdown } from "react-bootstrap";
import { get } from "../../utils/API";
import { ACCESS_KEY, SECRET_KEY, LEAD_ID } from "../../utils/Constants";
import ChangePasswordModal from "./ChangePasswordModal";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      leadsInfo: {},
      displayName: "",
      show: false,
      setShow: false,
    };
  }

  showPasswordModal = () => {
    this.setState({
      setShow: true,
      show: true,
    });
  };

  closePasswordModal = () => {
    this.setState({
      show: false,
    });
  };

  async componentDidMount() {
    try {
      const { data } = await get(
        `https://api-in21.leadsquared.com/v2/LeadManagement.svc/Leads.GetById?accessKey=${ACCESS_KEY}&secretKey=${SECRET_KEY}&id=${LEAD_ID}`
      );
      this.props.getUserName(data[0].FirstName);
      this.setState({ leadsInfo: data[0], displayName: data[0].FirstName });
    } catch (e) {
      console.log("error leads info", e);
    }
  }

  render() {
    return (
      <>
        <nav
          className="navbar fixed-top header"
          style={{
            padding: "10px 0px 10px 5px",
            boxShadow: "0px 3px 6px #00000029",
          }}
        >
          <div className="container no-padding">
            <a className="navbar-brand" href={"/dashboard"}>
              <div className="row">
                <div className="col-md-6 col-sm-6 col-6">
                  <img src={Logo} />
                </div>
                <div className="col-md-6 col-sm-5 col-5 header-text">
                  RT Nagar, Bangalore
                </div>
              </div>
            </a>
            {/* <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button> */}
            <div className="header-dropdown">
              <Dropdown>
                <Dropdown.Toggle variant="link" id="dropdown-basic">
                  <span className="web-display">{this.state.displayName}</span>
                  <span className="mobile-display">
                    <i class="fa fa-user" aria-hidden="true"></i>
                  </span>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item href="/dashboard">
                    My Applications
                  </Dropdown.Item>
                  <Dropdown.Item onClick={this.showPasswordModal}>
                    Change password
                  </Dropdown.Item>
                  { this.state.show ? 
                    <ChangePasswordModal
                      show={this.state.show}
                      onHide={this.closePasswordModal}
                    />
                    : null
                  }
                  <Dropdown.Item
                    className="dropdown-logout"
                    onClick={this.props.logout}
                  >
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </nav>
      </>
    );
  }
}

export default Header;
