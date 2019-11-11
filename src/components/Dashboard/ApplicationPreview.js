import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "../../assets/css/preview.scss";
import { PDFExport } from "@progress/kendo-react-pdf";
import { drawDOM, exportPDF } from "@progress/kendo-drawing";
import Header from "./Header";
import {
  logout,
  formDataPost,
  activityPostEvent,
  activityUpdatePost,
  get,
} from "../../utils/API";
import "@progress/kendo-theme-bootstrap/dist/all.css";
import PreviewBody from "./PreviewBody";
import {
  PRIVATE_AUTH_KEY,
  ACCESS_KEY,
  SECRET_KEY,
  LEAD_ID,
} from "../../utils/Constants";
import atob from "atob";
import axios from "axios";

class ApplicationPreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      binaryData: null,
      activityId: null,
      newKey: null,
      loadData: false,
      leadsInfo: {},
      displayName: "",
      photoUrl: "",
      dataFields: null,
    };
    this.downloadPDF = this.downloadPDF.bind(this);
  }

  downloadPDF() {
    this.pdfExportComponent.save();
    // console.log("save",this.pdfExportComponent.save())
  }

  exportPDFWithMethod = () => {
    let gridElement = document.querySelector("#applicationPreview");
    drawDOM(gridElement, {
      paperSize: "A4",
      margin: "0.3cm",
      scale: 0.6,
      forcePageBreak: ".page-break",
    })
      .then(group => {
        return exportPDF(group);
      })
      .then(dataUri => {
        // console.log(dataUri.split(";base64,")[1]);
        this.setState({ binaryData: dataUri.split(";base64,")[1] });
      });
  };

  testMethod = key => {
    this.setState({ newKey: key });
  };

  async componentDidUpdate(prevProps, prevState) {
    if (prevState.binaryData !== this.state.binaryData) {
      var pdfData = atob(this.state.binaryData);

      // var file = new File([pdfData], "arpit.pdf", { type: "application/pdf" });
      var dd = "data:application/pdf;base64," + this.state.binaryData;
      var arr = dd.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }

      let formData = new FormData();

      formData.append(
        "filedata",
        new Blob([u8arr], { type: mime }),
        "application.pdf",
      );
      formData.set("AuthToken", PRIVATE_AUTH_KEY);
      formData.set("FileType", "CustomObjectDocument");
      formData.set("Overwrite", false);
      formData.set("SchemaName", "mx_CustomObject_1");
      formData.set("EntitySchemaName", "mx_Custom_13");
      formData.set("StorageVersion", -1);
      formData.set("Id", 200);
      formData.set("Entity", 1);
      try {
        const { data } = await activityUpdatePost(
          "https://portalapi.leadsquared.com/api/Form/UploadFile",
          formData,
        );
        console.log("data", data.UploadCustomObjectFileResult);
        this.setState({ newKey: data.UploadCustomObjectFileResult.newKey });
      } catch (e) {
        console.log("error", e);
      }

      const updateActivityData = {
        ProspectActivityId: this.state.activityId,
        RelatedProspectId: LEAD_ID,
        ActivityEvent: 200,
        Fields: [
          {
            SchemaName: "mx_Custom_13",
            Value: "",
            Fields: [
              {
                SchemaName: "mx_CustomObject_1",
                Value: this.state.newKey,
              },
            ],
          },
        ],
      };

      console.log("updateActivityData", updateActivityData);

      try {
        const { data } = await activityUpdatePost(
          `https://api-in21.leadsquared.com/v2/ProspectActivity.svc/CustomActivity/Update?accessKey=${ACCESS_KEY}&secretKey=${SECRET_KEY}`,
          updateActivityData,
        );

        console.log("Data", data);
      } catch (e) {
        console.log("error", e);
      }
    }
  }

  async componentDidMount() {
    // let { activityId } = this.props.match.params;
    // this.setState({ activityId: activityId });
    let { activityId } = this.props.match.params;
    this.setState({ activityId: activityId });
    var id = activityId ? activityId : "";

    try {
      const { data } = await get(
        `https://api-in21.leadsquared.com/v2/LeadManagement.svc/Leads.GetById?accessKey=${ACCESS_KEY}&secretKey=${SECRET_KEY}&id=${LEAD_ID}`,
      );
      this.setState({
        leadsInfo: data[0],
        displayName: data[0].firstName,
      });

      console.log("data leads", data);
    } catch (e) {
      console.log("error leads info", e);
    }

    try {
      const { data } = await get(
        `https://api-in21.leadsquared.com/v2/ProspectActivity.svc/GetActivityDetails?accessKey=${ACCESS_KEY}&secretKey=${SECRET_KEY}&activityId=${id}&getfileurl=true`,
      );
      console.log("data......", data.Fields);
      let dataFields = data.Fields;
      this.setState({
        dataFields: dataFields,
        photoUrl:
          dataFields[3].CustomObjectFormProperties.FieldProperties
            .FormMetaData[1].FileURL,
        loadData: true,
      });
      this.exportPDFWithMethod();
    } catch (e) {
      console.log("error", e);
    }
  }

  logout = async () => {
    logout();
    this.props.history.push("/");
    window.location.reload();
  };

  getUserName = name => {
    this.setState({ userName: name });
  };

  loadData = data => {
    this.setState({ loadData: data });
  };

  render() {
    console.log("loadData", this.state.loadData);
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
          {/* <a
            href={`data:application/pdf;base64,${this.state.binaryData}`}
            download="file.pdf">
            Link download
          </a> */}
          <PDFExport
            forcePageBreak=".page-break"
            ref={component => (this.pdfExportComponent = component)}
            paperSize="A4"
            scale={0.6}
            margin="0.3cm"
            fileName={`LSQUniversityApplicationForm`}>
            <div id="applicationPreview">
              <PreviewBody
                display={"block"}
                loadData={this.loadData}
                leadsInfo={this.state.leadsInfo}
                photoUrl={this.state.photoUrl}
                dataFields={this.state.dataFields}
              />
            </div>
          </PDFExport>
        </div>
      </>
    );
  }
}
export default withRouter(ApplicationPreview);
