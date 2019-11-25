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
import moment from "moment";
import "../../assets/css/loader.scss";

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
      activityDate: null,
      isPreviewLoading: false,
    };
    this.downloadPDF = this.downloadPDF.bind(this);
  }

  downloadPDF() {
    this.pdfExportComponent.save();
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
        this.setState({ binaryData: dataUri.split(";base64,")[1] });
      });
  };

  testMethod = key => {
    this.setState({ newKey: key });
  };

  async componentDidUpdate(prevProps, prevState) {
    if (prevState.binaryData !== this.state.binaryData) {
      var pdfData = atob(this.state.binaryData);

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
          "https://portalapi-in21.leadsquared.com/api/Form/UploadFile",
          formData,
        );
        this.setState({ newKey: data.UploadCustomObjectFileResult.newKey });
      } catch (e) {}

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

      try {
        const { data } = await activityUpdatePost(
          `https://api-in21.leadsquared.com/v2/ProspectActivity.svc/CustomActivity/Update?accessKey=${ACCESS_KEY}&secretKey=${SECRET_KEY}`,
          updateActivityData,
        );
      } catch (e) {}
    }
  }

  async componentDidMount() {
    let { activityId } = this.props.match.params;
    this.setState({ activityId: activityId, isPreviewLoading: true });
    var id = activityId ? activityId : "";

    try {
      const { data } = await get(
        `https://api-in21.leadsquared.com/v2/LeadManagement.svc/Leads.GetById?accessKey=${ACCESS_KEY}&secretKey=${SECRET_KEY}&id=${LEAD_ID}`,
      );
      this.setState({
        leadsInfo: data[0],
        displayName: data[0].firstName,
      });
    } catch (e) {}

    try {
      const { data } = await get(
        `https://api-in21.leadsquared.com/v2/ProspectActivity.svc/GetActivityDetails?accessKey=${ACCESS_KEY}&secretKey=${SECRET_KEY}&activityId=${id}&getfileurl=true`,
      );
      let activityDate = data
        ? moment(data.CreatedOnString).format("DD-MM-YYYY")
        : null;
      let dataFields = data.Fields;
      this.setState({
        dataFields: dataFields,
        photoUrl:
          dataFields[3].CustomObjectFormProperties.FieldProperties
            .FormMetaData[1].FileURL,
        loadData: true,
        activityDate: activityDate,
        isPreviewLoading: false,
      });
      this.exportPDFWithMethod();
    } catch (e) {}
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
    return (
      <>
        {this.state.isPreviewLoading ? (
          <div className="loading">Loading&#8230;</div>
        ) : null}
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
            <div id="applicationPreview">
              <PreviewBody
                display={"block"}
                loadData={this.loadData}
                leadsInfo={this.state.leadsInfo}
                photoUrl={this.state.photoUrl}
                dataFields={this.state.dataFields}
                activityDate={this.state.activityDate}
              />
            </div>
          </PDFExport>
        </div>
      </>
    );
  }
}
export default withRouter(ApplicationPreview);
