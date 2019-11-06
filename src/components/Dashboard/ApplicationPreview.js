import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "../../assets/css/preview.scss";
import { PDFExport } from "@progress/kendo-react-pdf";
import Header from "./Header";
import { logout } from "../../utils/API";
import "@progress/kendo-theme-bootstrap/dist/all.css";
import PreviewBody from "./PreviewBody";

class ApplicationPreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
    };
    this.downloadPDF = this.downloadPDF.bind(this);
  }

  downloadPDF() {
    this.pdfExportComponent.save();
    // console.log("save",this.pdfExportComponent.save())
  }

  logout = async () => {
    logout();
    this.props.history.push("/");
    window.location.reload();
  };

  getUserName = name => {
    this.setState({ userName: name });
  };

  render() {
    return (
      <>
        <Header logout={this.logout} getUserName={this.getUserName} />
        <div style={{ paddingTop: "100px" }}>
          <div
            className="app-form-preview-header"
            style={{ textAlign: "right", paddingRight: "40px" }}>
            <a
              href="javascript:void(0);"
              className="app-form-preview-download"
              onClick={this.downloadPDF}>
              <i className="fa fa-download" aria-hidden="true"></i>Download PDF
            </a>
          </div>
          <div className="page-header-border-bottom"></div>
          <PDFExport
            forcePageBreak=".page-break"
            ref={component => (this.pdfExportComponent = component)}
            paperSize="A4"
            scale={0.6}
            margin="0.3cm"
            fileName={`LSQUniversityApplicationForm`}>
            <PreviewBody display={"block"} />
          </PDFExport>
        </div>
      </>
    );
  }
}
export default withRouter(ApplicationPreview);
