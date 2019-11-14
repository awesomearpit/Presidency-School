import React, { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import cookie from "react-cookies";
import { get } from "./utils/API";
import { ACCESS_KEY, SECRET_KEY, PRIVATE_AUTH_KEY } from "./utils/Constants";
import Routes from "./routes";
import axios from "axios";

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Router>
          <Routes />
        </Router>
      </div>
    );
  }
}

export default App;
