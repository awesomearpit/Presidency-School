import React, { Component } from "react";
import Logo from "../../assets/images/logo.png";
import { Dropdown } from "react-bootstrap";
import { logout, get } from "../../utils/API";
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
        <nav class="navbar fixed-top header">
          <div className="container">
            <a class="navbar-brand" href="#">
              <div className="row">
                <div className="col-md-6">
                  <img src={Logo} />
                </div>
                <div className="col-md-6 header-text">RT Nagar, Bangalore</div>
              </div>
            </a>
            <button
              class="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span class="navbar-toggler-icon"></span>
            </button>
            <div className="header-dropdown">
              <Dropdown>
                <Dropdown.Toggle variant="link" id="dropdown-basic">
                  {this.state.displayName}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item href="/dashboard">
                    My Applications
                  </Dropdown.Item>
                  <Dropdown.Item onClick={this.showPasswordModal}>
                    Change password
                  </Dropdown.Item>
                  <ChangePasswordModal
                    show={this.state.show}
                    onHide={this.closePasswordModal}
                  />
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
