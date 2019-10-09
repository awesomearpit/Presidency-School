import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import cookie from "react-cookies";
import Homepage from "./components/HomePage";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import Dashboard from "./components/Dashboard";
import EnquiryForm from "./components/Dashboard/EnquiryForm";
import EnquirySuccess from "./components/Dashboard/EnquirySuccess";
import ApplicationForm from "./components/Dashboard/ApplicationForm";
import ApplicationPreview from "./components/Dashboard/ApplicationPreview";

class Routes extends Component {
  constructor(props) {
    super(props);
    this.Routes = [
      {
        path: "/",
        exact: true,
        component: Homepage,
        title: "homepage",
      },
      {
        path: "/forgotPassword",
        exact: true,
        component: ForgotPassword,
        title: "forgotPassword",
      },
      {
        path: "/:leadId/:tempPassword",
        exact: true,
        component: ResetPassword,
        title: "resetPassword",
      },
      {
        path: "/dashboard",
        exact: true,
        component: Dashboard,
        title: "dashboard",
      },
      {
        path: "/enquiryForm/:activityId?",
        exact: true,
        component: EnquiryForm,
        title: "enquiryForm",
      },
      {
        path: "/enquirySuccess",
        exact: true,
        component: EnquirySuccess,
        title: "enquirySuccess",
      },
      {
        path: "/applicationForm",
        exact: true,
        component: ApplicationForm,
        title: "applicationForm",
      },
      {
        path: "/applicationPreview",
        exact: true,
        component: ApplicationPreview,
        title: "applicationPreview",
      },
    ];
  }

  isAllowed = (props, RouteComponent, title) => {
    if (this.isCurrentUser()) {
      if (
        title !== "homepage" &&
        title !== "forgotPassword" &&
        title !== "resetPassword"
      ) {
        return <RouteComponent {...props} />;
      } else if (title === "homepage") {
        return <Homepage {...props} />;
      }
      // return <Redirect to="/dashboard" />;
    } else {
      if (title === "homepage") {
        return <Homepage {...props} />;
      } else if (title === "forgotPassword") {
        return <ForgotPassword {...props} />;
      } else if (title === "resetPassword") {
        return <ResetPassword {...props} />;
      } else if (title !== "forgotPassword" && title !== "resetPassword") {
        return <Homepage {...props} />;
      }
    }
  };

  isCurrentUser = () => {
    return !!cookie.load("AuthKey");
  };

  render() {
    return (
      <div>
        {this.Routes.map((route, i) => (
          <Route
            key={i}
            exact={route.exact}
            path={route.path}
            render={props =>
              this.isAllowed(props, route.component, route.title)
            }
          />
        ))}
      </div>
    );
  }
}

export default Routes;
