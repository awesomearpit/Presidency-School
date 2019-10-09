import React from "react";
import Logo from "../assets/images/logo.png";

const Header = props => {
  return (
    <>
      <nav class="navbar fixed-top header">
        <div className="container">
          <a class="navbar-brand" href="/">
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
        </div>
      </nav>
    </>
  );
};

export default Header;
