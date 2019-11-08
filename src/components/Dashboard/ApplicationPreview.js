import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "../../assets/css/preview.scss";
import { PDFExport } from "@progress/kendo-react-pdf";
import { drawDOM, exportPDF } from "@progress/kendo-drawing";
import Header from "./Header";
import { logout, formDataPost } from "../../utils/API";
import "@progress/kendo-theme-bootstrap/dist/all.css";
import PreviewBody from "./PreviewBody";
import { PRIVATE_AUTH_KEY } from "../../utils/Constants";
import atob from "atob";

class ApplicationPreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      binaryData: null,
    };
    this.downloadPDF = this.downloadPDF.bind(this);
  }

  downloadPDF() {
    this.pdfExportComponent.save();
    // console.log("save",this.pdfExportComponent.save())
  }

  exportPDFWithMethod = () => {
    let gridElement = document.querySelector("#applicationPreview");
    drawDOM(gridElement, { paperSize: "A3", margin: 100 })
      .then(group => {
        return exportPDF(group);
      })
      .then(dataUri => {
        console.log(dataUri.split(";base64,")[1]);
        this.setState({ binaryData: dataUri.split(";base64,")[1] });
      });
  };

  async componentDidUpdate(prevProps, prevState) {
    if (prevState.binaryData !== this.state.binaryData) {
      var pdfData = atob(this.state.binaryData);

      var dd = "data:application/pdf;base64," + this.state.binaryData;
      let formData = new FormData();

      formData.set(
        "filedata",
        new Blob([this.state.binaryData], { type: "application/pdf" }),
      );
      formData.set("AuthToken", PRIVATE_AUTH_KEY);
      formData.set("FileType", "CustomObjectDocument");
      formData.set("Overwrite", false);
      formData.set("SchemaName", "mx_CustomObject_1");
      formData.set("EntitySchemaName", "mx_Custom_13");
      formData.set("StorageVersion", -1);
      formData.set("Id", 200);
      formData.set("Entity", 1);

      console.log("Form Data", formData);

      const uploadData = {
        filedata: pdfData,
        AuthToken: PRIVATE_AUTH_KEY,
        FileType: "CustomObjectDocument",
        Overwrite: false,
        SchemaName: "mx_CustomObject_1",
        EntitySchemaName: "mx_Custom_13",
        StorageVersion: -1,
        Id: 200,
        Entity: 1,
      };

      let request = new XMLHttpRequest();
      request.open(
        "POST",
        "https://portalapi.leadsquared.com/api/Form/UploadFile",
      );
      request.setRequestHeader("Authorization", PRIVATE_AUTH_KEY);
      request.send(formData);

      // try {
      //   const { data } = await formDataPost(
      //     "https://portalapi.leadsquared.com/api/Form/UploadFile",
      //     formData,
      //   );
      //   console.log("form Upload Data", data);
      // } catch (e) {
      //   console.log("e", e);
      // }
      // fetch("https://portalapi.leadsquared.com/api/Form/UploadFile", {
      //   body: uploadData,
      //   method: "post",
      //   config: { headers: { "Content-Type": "multipart/form-data" } },
      // });
    }
  }

  componentDidMount() {
    this.exportPDFWithMethod();
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
          <a
            href={`data:application/pdf;base64,${this.state.binaryData}`}
            download="file.pdf">
            Link download
          </a>
          <PDFExport
            forcePageBreak=".page-break"
            ref={component => (this.pdfExportComponent = component)}
            paperSize="A4"
            scale={0.6}
            margin="0.3cm"
            fileName={`LSQUniversityApplicationForm`}>
            <div id="applicationPreview">
              <PreviewBody display={"block"} />
            </div>
          </PDFExport>
        </div>
      </>
    );
  }
}
export default withRouter(ApplicationPreview);
