import React from "react";
import Logo from "../assets/images/logo.png";
import { getBranchName } from "../utils/Constants";

const Header = props => {
  return (
    <>
      <nav className="navbar fixed-top header">
        <div className="container">
          <a className="navbar-brand" href="/">
            <div className="row">
              <div className="col-md-4">
                <img src={Logo} />
              </div>
              <div className="col-md-8 header-text">{getBranchName()}</div>
            </div>
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default Header;
