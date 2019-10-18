import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { get } from "../../utils/API";
import { ACCESS_KEY, SECRET_KEY, LEAD_ID } from "../../utils/Constants";
import "../../assets/css/preview.scss";
import { PDFExport } from "@progress/kendo-react-pdf";
import moment from "moment";
import Header from "./Header";
import { logout } from "../../utils/API";

class ApplicationPreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      leadsInfo: {},
      displayName: "",
      userName: "",
      photoUrl: "",
    };
    this.downloadPDF = this.downloadPDF.bind(this);
  }

  downloadPDF() {
    this.pdfExportComponent.save();
  }

  async componentDidMount() {
    let { activityId } = this.props.match.params;
    this.setState({ activityId: activityId });
    var id = activityId ? activityId : "";

    try {
      const { data } = await get(
        `https://api-in21.leadsquared.com/v2/LeadManagement.svc/Leads.GetById?accessKey=${ACCESS_KEY}&secretKey=${SECRET_KEY}&id=${LEAD_ID}`
      );
      this.setState({
        leadsInfo: data[0],
        displayName: data[0].FirstName,
      });

      console.log("data leads", data);
    } catch (e) {
      console.log("error leads info", e);
    }

    try {
      const { data } = await get(
        `https://api-in21.leadsquared.com/v2/ProspectActivity.svc/GetActivityDetails?accessKey=${ACCESS_KEY}&secretKey=${SECRET_KEY}&activityId=${id}&getfileurl=true`
      );
      this.setState({
        photoUrl:
          data.Fields[3].CustomObjectFormProperties.FieldProperties
            .FormMetaData[1].FileURL,
      });
      console.log(
        "Dtaa...",
        data.Fields[3].CustomObjectFormProperties.FieldProperties
          .FormMetaData[1].FileURL
      );
    } catch (e) {
      console.log("error", e);
    }
  }

  logout = async () => {
    logout();
    this.props.history.push("/");
  };

  getUserName = name => {
    this.setState({ userName: name });
  };

  render() {
    const { leadsInfo, photoUrl } = this.state;
    const date = moment(leadsInfo.mx_Date_of_Birth)
      .format("DD/MM/YYYY")
      .split("");
    return (
      <>
        <Header logout={this.logout} getUserName={this.getUserName} />
        <div style={{ paddingTop: "100px" }}>
          <div
            className="app-form-preview-header"
            style={{ textAlign: "right", paddingRight: "40px" }}
          >
            <a
              href="javascript:void(0);"
              class="app-form-preview-download"
              onClick={this.downloadPDF}
            >
              <i class="fa fa-download" aria-hidden="true"></i>Download PDF
            </a>
          </div>
          <div class="page-header-border-bottom"></div>
          <PDFExport
            forcePageBreak=".page-break"
            ref={component => (this.pdfExportComponent = component)}
            paperSize="A4"
            scale={0.6}
            margin="0.3cm"
            fileName={`LSQUniversityApplicationForm`}
          >
            {leadsInfo ? (
              <div className="preview">
                <div className="application-preview">
                  <div className="col-md-12 application-heading">
                    APPLICATION FOR ADMISSION
                  </div>
                  <div className="row no-margin top-view">
                    <div className="col-md-10 no-padding left-view">
                      <div className="col-md-12 text">
                        General Instructions 1) Fill the form in BLOCK LETTERS
                        Only 2) To be ﬁlled and signed only by Parents.
                      </div>
                      <div className="col-md-12 text">
                        Names and DOB entered in this form will be treated as
                        ﬁnal and no changes will be accepted in future.
                      </div>
                      <div className="row session-box" style={{margin:"0px"}}>
                        <div className="col session-text">
                          Grade Applied for
                        </div>
                        <div className="col-2 session-div" style={{marginRight:"0px"}}>
                          {leadsInfo.mx_Grade_Applied_for}
                        </div>
                        <div className="col session-text">
                          For Academic Session
                        </div>
                        <div className="col session-div" style={{marginRight:"0px"}}>
                          {leadsInfo.mx_For_Academic_Session}
                        </div>
                      </div>
                      <div className="col-md-12 office-use">Office Use Only</div>
                      <div className="col-md-12 no-padding">
                        <div className="receipt-text">Receipt No.</div>
                        <div className="col-md-3 d-inline-block receipt-text"></div>
                        <div className="receipt-text">Date</div>
                        <div className="receipt-text col-md-3 d-inline-block"></div>
                      </div>
                    </div>
                    <div className="col-md-2">
                      <img
                        src={photoUrl}
                        className="img-responsive"
                        height="100%"
                        width="100%"
                        crossorigin="anonymous"
                      />
                    </div>
                  </div>
                  <div className="row body-view no-margin">
                    <div className="col-md-12 office-use">
                      Student Information
                    </div>
                    <div className="col-md-12 student-name">
                      Name of the Student
                      <span>( As per Birth Certiﬁcate / Passport )</span>
                    </div>
                    <div className="col-md-12 student-name">
                      {this.state.leadsInfo.FirstName}
                    </div>
                    <div className="col-md-12 no-padding">
                      <div className="col-md-1 no-padding d-inline-block">
                        <div className="dob">Date of Birth</div>
                      </div>
                      <div className="d-inline-block dob">
                        {!leadsInfo.mx_Date_of_Birth ? (
                          <>
                            <div className="checkBox"></div>
                            <div
                              className="checkBox"
                              style={{ marginRight: "10px" }}
                            >
                              {date[1]}
                            </div>
                            <div className="checkBox"></div>
                            <div
                              className="checkBox"
                              style={{ marginRight: "10px" }}
                            >
                              {date[4]}
                            </div>
                            <div className="checkBox"></div>
                            <div className="checkBox"></div>
                            <div className="checkBox"></div>
                            <div className="checkBox">+</div>
                          </>
                        ) : (
                          <>
                            <div className="checkBox">{date[0]}</div>
                            <div
                              className="checkBox"
                              style={{ marginRight: "10px" }}
                            >
                              {date[1]}
                            </div>
                            <div className="checkBox">{date[3]}</div>
                            <div
                              className="checkBox"
                              style={{ marginRight: "10px" }}
                            >
                              {date[4]}
                            </div>
                            <div className="checkBox">{date[6]}</div>
                            <div className="checkBox">{date[7]}</div>
                            <div className="checkBox">{date[8]}</div>
                            <div className="checkBox">{date[9]}</div>
                          </>
                        )}
                      </div>
                      <div
                        className="gender d-inline-block pull-right"
                        style={{ marginRight: "10px" }}
                      >
                        Gender:{" "}
                        {leadsInfo.mx_Gender === "Male" ? (
                          <>
                            Male&nbsp;&nbsp;
                            <i class="fa fa-check-circle"></i>
                            &nbsp;&nbsp;Female&nbsp;&nbsp;
                            <div className="radioBox"></div>
                          </>
                        ) : leadsInfo.mx_Gender === "Female" ? (
                          <>
                            Male&nbsp;&nbsp;<div className="radioBox"></div>
                            &nbsp;&nbsp;Female&nbsp;&nbsp;
                            <i class="fa fa-check-circle"></i>
                          </>
                        ) : (
                          <>
                            Male&nbsp;&nbsp;<div className="radioBox"></div>
                            &nbsp;&nbsp;Female&nbsp;&nbsp;
                            <div className="radioBox"></div>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="col-md-12 dob">In Words</div>
                    <div className="col-md-12 dob">
                      Age as on 1st June :{" "}
                      <div className="borderBox">
                        {leadsInfo.mx_Age_as_on_1_June_2019}
                      </div>
                    </div>
                    <div className="col-md-12 dob">
                      Place of Birth(City and country):{" "}
                      <div className="borderBox">
                        {leadsInfo.mx_Place_of_Birth}
                      </div>
                    </div>
                    <div className="col-md-12 dob">
                      Nationality :
                      <div className="borderBox">
                        {" "}
                        {leadsInfo.mx_Nationality}
                      </div>
                    </div>
                    <div className="col-md-12 no-padding">
                      <div className="col-md-6 d-inline-block dob">
                        Aadhar Card No.:{" "}
                        <div className="borderBox">
                          {leadsInfo.mx_Aadhaar_Card_No}
                        </div>
                      </div>
                      <div className="col-md-6 d-inline-block dob">
                        Blood Group :{" "}
                        <div className="borderBox">
                          {leadsInfo.mx_Blood_Group}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-12 no-padding">
                      <div className="col-md-6 d-inline-block dob">
                        Religion :{" "}
                        <div className="borderBox">{leadsInfo.mx_Religion}</div>
                      </div>
                      <div className="col-md-6 d-inline-block dob">
                        Caste :
                        <div className="borderBox"> {leadsInfo.mx_Caste}</div>
                      </div>
                    </div>
                    <div className="col-md-12 no-padding">
                      <div className="col-md-6 d-inline-block dob">
                        Mother Tounge :{" "}
                        <div className="borderBox">
                          {leadsInfo.mx_Mother_Tongue}
                        </div>
                      </div>
                      <div className="col-md-6 d-inline-block dob">
                        Whether School transport required :{" "}
                        {leadsInfo.mx_Whether_School_transport_required ===
                        "Yes" ? (
                          <>
                            Yes&nbsp;&nbsp;
                            <i class="fa fa-check-circle"></i>
                            &nbsp;&nbsp;No&nbsp;&nbsp;
                            <div className="radioBox"></div>
                          </>
                        ) : leadsInfo.mx_Whether_School_transport_required ===
                          "No" ? (
                          <>
                            Yes&nbsp;&nbsp;<div className="radioBox"></div>
                            &nbsp;&nbsp;No&nbsp;&nbsp;
                            <i class="fa fa-check-circle"></i>
                          </>
                        ) : (
                          <>
                            Yes&nbsp;&nbsp;<div className="radioBox"></div>
                            &nbsp;&nbsp;No&nbsp;&nbsp;
                            <div className="radioBox"></div>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="col-md-12 office-use">
                      Family Details ( Please Tick{" "}
                      <i class="fa fa-check" ></i> the name of
                      the person to be contacted in case of Emergency )
                    </div>
                    <div className="col-md-6" style={{ paddingLeft: "0px" }}>
                      <div className="col-md-12 family-box">
                        <div className="col-md-12 family-text text-center">
                          Father’s Full Name ( as per proof attached ){" "}
                          
                      

                         {!leadsInfo.mx_Father_Emergency_contact ? (
                          <span
                            className="checkBox"
                            style={{ marginLeft: "8px" }}
                          ></span>
                        ) : (
                          leadsInfo.mx_Father_Emergency_contact === 0 ? (
                            <span
                              className="checkBox"
                              style={{ marginLeft: "8px" }}
                            ></span>
                          ) : (
                            <span
                              className="checkBox"
                              style={{ marginLeft: "8px" }}
                            >
                              <i class="fa fa-check" aria-hidden="true"></i>
                            </span>
                          )
                        )}
                          <div style={{ fontWeight: "bold" }}>
                            {leadsInfo.mx_Father_Full_Name}
                          </div>
                        </div>
                        <div className="col-md-12 family-text">
                          Educational Qualiﬁcation :{" "}
                          <div className="borderBox">{leadsInfo.mx_Father_Educational_Qualifications}</div>
                        </div>
                        <div className="col-md-12 family-text">
                          Employed / Self-Employed :{" "}
                          <div className="borderBox">{leadsInfo.mx_Father_Employed_or_Self_Employed}</div>
                        </div>
                        <div className="col-md-12 family-text">
                          Occupation : <div className="borderBox">{leadsInfo.mx_Father_Occupation}</div>
                        </div>
                        <div className="col-md-12 family-text">
                          Designation : <div className="borderBox">{leadsInfo.mx_Father_Designation}</div>
                        </div>
                        <div className="col-md-12 family-text">
                          Name Of the Organization :{" "}
                          <div className="borderBox">{leadsInfo.mx_Father_Organisation}</div>
                        </div>
                        <div className="col-md-12 family-text">
                          Phone Number office :{" "}
                          <div className="borderBox">{leadsInfo.mx_Father_Mobile_Number}</div>
                        </div>
                        <div className="col-md-12 family-text">
                          Annual Income : <div className="borderBox">{leadsInfo.mx_Father_Annual_Income}</div>
                        </div>
                        <div className="col-md-12 family-text">
                          Mobile Number : <div className="borderBox">{leadsInfo.mx_Father_Mobile_Number}</div>
                        </div>
                        <div className="col-md-12 family-text">
                          E-mail : <div className="borderBox">{leadsInfo.mx_Father_EMail_ID}</div>
                        </div>
                        <div className="col-md-12 family-text">
                          Aadhar Card No. :{" "}
                          <div className="borderBox">{leadsInfo.mx_Father_Aadhaar_Card_No}</div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6" style={{ paddingRight: "0px" }}>
                      <div className="col-md-12 family-box">
                        <div className="col-md-12 family-text text-center">
                          Mother's Full Name ( as per proof attached ) :{" "}
                          {!leadsInfo.mx_Mother_Emergency_Contact ? (
                          <span
                            className="checkBox"
                            style={{ marginLeft: "8px" }}
                          ></span>
                        ) : (
                          leadsInfo.mx_Mother_Emergency_Contact === 0 ? (
                            <span
                              className="checkBox"
                              style={{ marginLeft: "8px" }}
                            ></span>
                          ) : (
                            <span
                              className="checkBox"
                              style={{ marginLeft: "8px" }}
                            >
                              <i class="fa fa-check" aria-hidden="true"></i>
                            </span>
                          )
                        )}
                          <div style={{ fontWeight: "bold" }}>
                            {leadsInfo.mx_Mother_Name}
                          </div>
                        </div>
                        <div className="col-md-12 family-text">
                          Educational Qualiﬁcation :{" "}
                          <div className="borderBox">{leadsInfo.mx_Mother_Educational_Qualifications}</div>
                        </div>
                        <div className="col-md-12 family-text">
                          Employed / Self-Employed :{" "}
                          <div className="borderBox">{leadsInfo.mx_Mother_Employed_or_Self_Employed}</div>
                        </div>
                        <div className="col-md-12 family-text">
                          Occupation : <div className="borderBox">{leadsInfo.mx_Mother_Occupation}</div>
                        </div>
                        <div className="col-md-12 family-text">
                          Designation : <div className="borderBox">{leadsInfo.mx_Mother_Designation}</div>
                        </div>
                        <div className="col-md-12 family-text">
                          Name Of the Organization :{" "}
                          <div className="borderBox">{leadsInfo.mx_Mother_Organisation}</div>
                        </div>
                        <div className="col-md-12 family-text">
                          Phone Number office :{" "}
                          <div className="borderBox">{leadsInfo.mx_Mother_Mobile_Number}</div>
                        </div>
                        <div className="col-md-12 family-text">
                          Annual Income : <div className="borderBox">{leadsInfo.mx_Mother_Annual_Income}</div>
                        </div>
                        <div className="col-md-12 family-text">
                          Mobile Number : <div className="borderBox">{leadsInfo.mx_Mother_Mobile_Number}</div>
                        </div>
                        <div className="col-md-12 family-text">
                          E-mail : <div className="borderBox">{leadsInfo.mx_Mother_Email_ID}</div>
                        </div>
                        <div className="col-md-12 family-text">
                          Aadhar Card No. :{" "}
                          <div className="borderBox">{leadsInfo.mx_Mother_Aadhaar_Card_No}</div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-12 dob">
                      Resedential Address :{" "}
                      <div className="borderBox">{leadsInfo.mx_Father_Residential_Address}</div>
                    </div>
                    <div className="col-md-12 no-padding">
                      <div className="col-md-6 d-inline-block dob">
                        Pin Code : <div className="borderBox">{leadsInfo.mx_Pincode}{" "}</div>
                      </div>
                      <div className="col-md-6 d-inline-block dob">
                        Phone number Residence :<div className="borderBox">{leadsInfo.Phone}</div>
                      </div>
                    </div>
                    <div className="col-md-12 office-use">Guardian Details</div>
                    <div className="col-md-12 dob">
                      Full Name Of Guardian :{" "}
                      <div className="borderBox">{leadsInfo.mx_Full_Name_of_the_Guardian}</div>
                    </div>
                    <div className="col-md-12 dob">
                      Residential Address :{" "}
                      <div className="borderBox">{leadsInfo.mx_Guardian_Residential_Address}</div>
                    </div>
                    <div className="col-md-12 dob">
                      Mobile : <div className="borderBox">{leadsInfo.mx_Guardian_Mobile}{" "}</div>
                    </div>
                    <div className="col-md-12 dob">
                      E-mail : <div className="borderBox">{leadsInfo.mx_Guardian_Email}{" "}</div>
                    </div>
                    <div className="col-md-12 office-use">Other Details </div>
                    <div className="col-md-12 dob">
                      Single Parent ( Please tick{" "}
                      <i class="fa fa-check" aria-hidden="true"></i> if
                      applicable ) :{" "}
                      {!leadsInfo.mx_Single_Parent_Please_select_if_applicable ? (
                        <>
                          <div>
                            <div className="checkBox"></div>&nbsp;&nbsp;
                            <span style={{ verticalAlign: "super" }}>
                              Father
                            </span>
                          </div>
                          <div>
                            <div className="checkBox"></div>&nbsp;&nbsp;
                            <span style={{ verticalAlign: "super" }}>
                              Mother
                            </span>
                          </div>
                        </>
                      ) : leadsInfo.mx_Single_Parent_Please_select_if_applicable ===
                        "Father" ? (
                        <>
                          <div>
                            <div className="checkBox">
                              <i class="fa fa-check" aria-hidden="true"></i>
                            </div>
                            &nbsp;&nbsp;
                            <span style={{ verticalAlign: "super" }}>
                              Father
                            </span>
                          </div>
                          <div>
                            <div className="checkBox"></div>&nbsp;&nbsp;
                            <span style={{ verticalAlign: "super" }}>
                              Mother
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <div className="checkBox"></div>&nbsp;&nbsp;
                            <span style={{ verticalAlign: "super" }}>
                              Father
                            </span>
                          </div>
                          <div>
                            <div className="checkBox">
                              <i class="fa fa-check" aria-hidden="true"></i>
                            </div>
                            &nbsp;&nbsp;
                            <span style={{ verticalAlign: "super" }}>
                              Mother
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="col-md-12 dob">
                      In case Parents are separated, custody of the child is
                      with ( Please tick{" "}
                      <i class="fa fa-check" aria-hidden="true"></i> if
                      applicable ) :{" "}
                      {
                        leadsInfo.mx_In_case_Parents_are_separated_Select_if_applicable
                      }
                      {!leadsInfo.mx_In_case_Parents_are_separated_Select_if_applicable ? (
                        <>
                          <div>
                            <div className="checkBox"></div>&nbsp;&nbsp;
                            <span style={{ verticalAlign: "super" }}>
                              Father
                            </span>
                          </div>
                          <div>
                            <div className="checkBox"></div>&nbsp;&nbsp;
                            <span style={{ verticalAlign: "super" }}>
                              Mother
                            </span>
                          </div>
                        </>
                      ) : leadsInfo.mx_In_case_Parents_are_separated_Select_if_applicable ===
                        "Father" ? (
                        <>
                          <div>
                            <div className="checkBox">
                              <i class="fa fa-check" aria-hidden="true"></i>
                            </div>
                            &nbsp;&nbsp;
                            <span style={{ verticalAlign: "super" }}>
                              Father
                            </span>
                          </div>
                          <div>
                            <div className="checkBox"></div>&nbsp;&nbsp;
                            <span style={{ verticalAlign: "super" }}>
                              Mother
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <div className="checkBox"></div>&nbsp;&nbsp;
                            <span style={{ verticalAlign: "super" }}>
                              Father
                            </span>
                          </div>
                          <div>
                            <div className="checkBox">
                              <i class="fa fa-check" aria-hidden="true"></i>
                            </div>
                            &nbsp;&nbsp;
                            <span style={{ verticalAlign: "super" }}>
                              Mother
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="col-md-12 dob">
                      Copy of Court Order / Death Certificate to be attached, if
                      applicable
                    </div>
                    <div className="col-md-12 office-use">
                      Second Language and Third Language Selection
                    </div>
                    <div
                      className="col-md-12 family-box"
                      style={{ padding: "15px", border: "1px solid #161717" }}
                    >
                      <div className="col-md-12 family-text">
                        Kannada Language is compulsory from Grades I to IV
                      </div>
                      <div className="col-md-12 family-text">
                        Second Language ( Grades V to X ) :{" "}
                        {leadsInfo.mx_Second_Language_Grades_V_to_X ===
                        "Kannada" ? (
                          <>
                            <div
                              className="checkBox"
                              style={{ verticalAlign: "super" }}
                            >
                              {" "}
                              <i class="fa fa-check" aria-hidden="true"></i>
                            </div>
                            &nbsp;&nbsp;
                            <span style={{ verticalAlign: "super" }}>
                              Kannada
                            </span>
                            &nbsp;&nbsp;
                            <div className="checkBox"></div>&nbsp;&nbsp;
                            <span style={{ verticalAlign: "super" }}>
                              Hindi
                            </span>
                            &nbsp;&nbsp;
                            <div className="checkBox"></div>&nbsp;&nbsp;
                            <span style={{ verticalAlign: "super" }}>
                              Sanskrit
                            </span>
                            &nbsp;&nbsp;
                            <div className="checkBox"></div>&nbsp;&nbsp;
                            <span style={{ verticalAlign: "super" }}>
                              French
                            </span>
                          </>
                        ) : leadsInfo.mx_Second_Language_Grades_V_to_X ===
                          "Hindi" ? (
                          <>
                            <div className="checkBox"></div>&nbsp;&nbsp;
                            <span style={{ verticalAlign: "super" }}>
                              Kannada
                            </span>
                            &nbsp;&nbsp;
                            <div
                              className="checkBox"
                              style={{ verticalAlign: "super" }}
                            >
                              {" "}
                              <i class="fa fa-check" aria-hidden="true"></i>
                            </div>
                            &nbsp;&nbsp;
                            <span style={{ verticalAlign: "super" }}>
                              Hindi
                            </span>
                            &nbsp;&nbsp;
                            <div className="checkBox"></div>&nbsp;&nbsp;
                            <span style={{ verticalAlign: "super" }}>
                              Sanskrit
                            </span>
                            &nbsp;&nbsp;
                            <div className="checkBox"></div>&nbsp;&nbsp;
                            <span style={{ verticalAlign: "super" }}>
                              French
                            </span>
                          </>
                        ) : leadsInfo.mx_Second_Language_Grades_V_to_X ===
                          "Sanskrit" ? (
                          <>
                            <div className="checkBox"></div>&nbsp;&nbsp;
                            <span style={{ verticalAlign: "super" }}>
                              Kannada
                            </span>
                            &nbsp;&nbsp;
                            <div className="checkBox"></div>
                            &nbsp;&nbsp;
                            <span style={{ verticalAlign: "super" }}>
                              Hindi
                            </span>
                            &nbsp;&nbsp;
                            <div
                              className="checkBox"
                              style={{ verticalAlign: "super" }}
                            >
                              <i class="fa fa-check" aria-hidden="true"></i>
                            </div>
                            &nbsp;&nbsp;
                            <span style={{ verticalAlign: "super" }}>
                              Sanskrit
                            </span>
                            &nbsp;&nbsp;
                            <div className="checkBox"></div>&nbsp;&nbsp;
                            <span style={{ verticalAlign: "super" }}>
                              French
                            </span>
                          </>
                        ) : leadsInfo.mx_Second_Language_Grades_V_to_X ===
                          "French" ? (
                          <>
                            <div className="checkBox"></div>&nbsp;&nbsp;
                            <span style={{ verticalAlign: "super" }}>
                              Kannada
                            </span>
                            &nbsp;&nbsp;
                            <div className="checkBox"></div>
                            &nbsp;&nbsp;
                            <span style={{ verticalAlign: "super" }}>
                              Hindi
                            </span>
                            &nbsp;&nbsp;
                            <div className="checkBox"></div>&nbsp;&nbsp;
                            <span style={{ verticalAlign: "super" }}>
                              Sanskrit
                            </span>
                            &nbsp;&nbsp;
                            <div
                              className="checkBox"
                              style={{ verticalAlign: "super" }}
                            >
                              <i class="fa fa-check" aria-hidden="true"></i>
                            </div>
                            &nbsp;&nbsp;
                            <span style={{ verticalAlign: "super" }}>
                              French
                            </span>
                          </>
                        ) : (
                          <>
                            <div className="checkBox"></div>&nbsp;&nbsp;
                            <span style={{ verticalAlign: "super" }}>
                              Kannada
                            </span>
                            &nbsp;&nbsp;
                            <div className="checkBox"></div>
                            &nbsp;&nbsp;
                            <span style={{ verticalAlign: "super" }}>
                              Hindi
                            </span>
                            &nbsp;&nbsp;
                            <div className="checkBox"></div>&nbsp;&nbsp;
                            <span style={{ verticalAlign: "super" }}>
                              Sanskrit
                            </span>
                            &nbsp;&nbsp;
                            <div className="checkBox"></div>
                            &nbsp;&nbsp;
                            <span style={{ verticalAlign: "super" }}>
                              French
                            </span>
                          </>
                        )}
                      </div>
                      <div className="col-md-12 family-text">
                        Third Language ( Grades V to VIII ) :{" "}
                        {leadsInfo.mx_Third_Language__Grades_V_to_VIII ===
                        "Kannada" ? (
                          <>
                            <div
                              className="checkBox"
                              style={{ verticalAlign: "super" }}
                            >
                              {" "}
                              <i class="fa fa-check" aria-hidden="true"></i>
                            </div>
                            &nbsp;&nbsp;
                            <span style={{ verticalAlign: "super" }}>
                              Kannada
                            </span>
                            &nbsp;&nbsp;
                            <div className="checkBox"></div>&nbsp;&nbsp;
                            <span style={{ verticalAlign: "super" }}>
                              Hindi
                            </span>
                            &nbsp;&nbsp;
                            <div className="checkBox"></div>&nbsp;&nbsp;
                            <span style={{ verticalAlign: "super" }}>
                              Sanskrit
                            </span>
                            &nbsp;&nbsp;
                            <div className="checkBox"></div>&nbsp;&nbsp;
                            <span style={{ verticalAlign: "super" }}>
                              French
                            </span>
                          </>
                        ) : leadsInfo.mx_Third_Language__Grades_V_to_VIII ===
                          "Hindi" ? (
                          <>
                            <div className="checkBox"></div>&nbsp;&nbsp;
                            <span style={{ verticalAlign: "super" }}>
                              Kannada
                            </span>
                            &nbsp;&nbsp;
                            <div
                              className="checkBox"
                              style={{ verticalAlign: "super" }}
                            >
                              {" "}
                              <i class="fa fa-check" aria-hidden="true"></i>
                            </div>
                            &nbsp;&nbsp;
                            <span style={{ verticalAlign: "super" }}>
                              Hindi
                            </span>
                            &nbsp;&nbsp;
                            <div className="checkBox"></div>&nbsp;&nbsp;
                            <span style={{ verticalAlign: "super" }}>
                              Sanskrit
                            </span>
                            &nbsp;&nbsp;
                            <div className="checkBox"></div>&nbsp;&nbsp;
                            <span style={{ verticalAlign: "super" }}>
                              French
                            </span>
                          </>
                        ) : leadsInfo.mx_Third_Language__Grades_V_to_VIII ===
                          "Sanskrit" ? (
                          <>
                            <div className="checkBox"></div>&nbsp;&nbsp;
                            <span style={{ verticalAlign: "super" }}>
                              Kannada
                            </span>
                            &nbsp;&nbsp;
                            <div className="checkBox"></div>
                            &nbsp;&nbsp;
                            <span style={{ verticalAlign: "super" }}>
                              Hindi
                            </span>
                            &nbsp;&nbsp;
                            <div
                              className="checkBox"
                              style={{ verticalAlign: "super" }}
                            >
                              <i class="fa fa-check" aria-hidden="true"></i>
                            </div>
                            &nbsp;&nbsp;
                            <span style={{ verticalAlign: "super" }}>
                              Sanskrit
                            </span>
                            &nbsp;&nbsp;
                            <div className="checkBox"></div>&nbsp;&nbsp;
                            <span style={{ verticalAlign: "super" }}>
                              French
                            </span>
                          </>
                        ) : leadsInfo.mx_Third_Language__Grades_V_to_VIII ===
                          "French" ? (
                          <>
                            <div className="checkBox"></div>&nbsp;&nbsp;
                            <span style={{ verticalAlign: "super" }}>
                              Kannada
                            </span>
                            &nbsp;&nbsp;
                            <div className="checkBox"></div>
                            &nbsp;&nbsp;
                            <span style={{ verticalAlign: "super" }}>
                              Hindi
                            </span>
                            &nbsp;&nbsp;
                            <div className="checkBox"></div>&nbsp;&nbsp;
                            <span style={{ verticalAlign: "super" }}>
                              Sanskrit
                            </span>
                            &nbsp;&nbsp;
                            <div
                              className="checkBox"
                              style={{ verticalAlign: "super" }}
                            >
                              <i class="fa fa-check" aria-hidden="true"></i>
                            </div>
                            &nbsp;&nbsp;
                            <span style={{ verticalAlign: "super" }}>
                              French
                            </span>
                          </>
                        ) : (
                          <>
                            <div className="checkBox"></div>&nbsp;&nbsp;
                            <span style={{ verticalAlign: "super" }}>
                              Kannada
                            </span>
                            &nbsp;&nbsp;
                            <div className="checkBox"></div>
                            &nbsp;&nbsp;
                            <span style={{ verticalAlign: "super" }}>
                              Hindi
                            </span>
                            &nbsp;&nbsp;
                            <div className="checkBox"></div>&nbsp;&nbsp;
                            <span style={{ verticalAlign: "super" }}>
                              Sanskrit
                            </span>
                            &nbsp;&nbsp;
                            <div className="checkBox"></div>
                            &nbsp;&nbsp;
                            <span style={{ verticalAlign: "super" }}>
                              French
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div
                      className="col-md-12 dob"
                      style={{ paddingTop: "0px" }}
                    >
                      Note: a) 2nd and 3rd Language cannot be same.
                      <br /> b) Availability of 2nd and 3rd Language option to
                      be checked with Relationship Executive before filling the
                      details.
                    </div>
                    <div className="col-md-12 office-use">Academic Record</div>
                    <div className="col-md-12 no-padding">
                      <div className="col-md-6 d-inline-block dob">
                        School last attended<div className="borderBox"></div>
                      </div>
                      <div className="col-md-6 d-inline-block dob">
                        Board of the School last attended :{" "}
                        <div className="borderBox">{leadsInfo.mx_Board_of_the_School_last_attended}</div>
                      </div>
                    </div>
                    <div className="col-md-12 no-padding">
                      <div className="col-md-6 d-inline-block dob">
                        City : <div className="borderBox">{leadsInfo.mx_City_Last_School_Attended}{" "}</div>
                      </div>
                      <div className="col-md-3 d-inline-block dob">State<div className="borderBox"></div></div>
                      <div className="col-md-3 d-inline-block dob">
                        Country : <div className="borderBox">{leadsInfo.mx_Country_of_last_school_attended}</div>
                      </div>
                    </div>
                    <div className="col-md-12 no-padding">
                      <div className="col-md-6 d-inline-block dob">
                        Grade previously studied in :{" "}
                        <div className="borderBox">{leadsInfo.mx_Grade_previously_studied_in}</div>
                      </div>
                      <div className="col-md-6 d-inline-block dob">
                        Number of years in the previous School :{" "}
                        <div className="borderBox">{leadsInfo.mx_Number_of_years_in_the_previous_School}</div>
                      </div>
                    </div>
                    <div className="col-md-12 dob">
                      Reasons for withdrawal :{" "}
                      <div className="borderBox">{leadsInfo.mx_Reasons_for_withdrawal}{" "}</div>
                    </div>
                    <div className="col-md-12 office-use">
                      Details of previous schooling & photocopies of grades or
                      marks obtained in last exam to be attached.
                    </div>
                    <div
                      className="col-md-12 no-padding family-box"
                      style={{ border: "1px solid #161717" }}
                    >
                      <table class="table table-bordered">
                        <thead>
                          <tr>
                            <th scope="col">Year From - to</th>
                            <th scope="col">Name of the School</th>
                            <th scope="col">English</th>
                            <th scope="col">2nd Language</th>
                            <th scope="col">Mathematics</th>
                            <th scope="col">Science</th>
                            <th scope="col">Social Science</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td scope="row"></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                          </tr>
                          <tr>
                            <td scope="row"></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="col-md-12 no-padding">
                      <div className="col-md-6 d-inline-block dob">
                        Languages formally studied - First :{" "}
                        <div className="borderBox">{leadsInfo.mx_Languages_formally_studied__First}</div>
                      </div>
                      <div className="col-md-3 d-inline-block dob">
                        Second :{" "}
                        <div className="borderBox">{leadsInfo.mx_Languages_formally_studied__Second}{" "}</div>
                      </div>
                      <div className="col-md-3 d-inline-block dob">
                        Third : <div className="borderBox">{leadsInfo.mx_Languages_formally_studied_Third}{" "}</div>
                      </div>
                    </div>
                    <div className="col-md-12 dob">
                      Sports, Games and Activities involved in :{" "}
                      <div className="borderBox">{leadsInfo.mx_Sports_Games_and_Activities_involved_in}</div>
                    </div>
                    <div className="col-md-12 dob">
                      Recent Accomplishments :{" "}
                      <div className="borderBox">{leadsInfo.mx_Recent_Accomplishments}</div>
                    </div>
                    <div className="col-md-12 dob">
                      Submitted Original Transfer Certificate ( Please tick ✓ )
                      :{" "}
                      {leadsInfo.mx_Submitted_Original_Transfer_Certificate ===
                      null ? (
                        <span>&nbsp;&nbsp;Yes&nbsp;✓ No</span>
                      ) : (
                        <span> ✓ Yes&nbsp;&nbsp;No</span>
                      )}
                    </div>
                    <div className="col-md-12 no-padding">
                      <div className="col-md-4 ml-auto dob">
                        T.C. No : <div className="borderBox">{leadsInfo.mx_TC_No}{" "}</div>
                      </div>
                    </div>
                    <div className="col-md-12 no-padding">
                      <div className="col-md-4 ml-auto dob">
                        School DISE Code :<div className="borderBox"> {leadsInfo.mx_School_DISE_Code}{" "}</div>
                      </div>
                    </div>
                    <div className="col-md-12 no-padding">
                      <div className="col-md-4 ml-auto dob">
                        Student Enrollment Number :{" "}
                        <div className="borderBox">{leadsInfo.mx_Student_Enrollment_Number}</div>
                      </div>
                    </div>
                    <div className="col-md-12 office-use">
                      Sibling Details{" "}
                      <span>( to be filled in if applicable )</span>
                    </div>
                    <div
                      className="col-md-12 no-padding family-box"
                      style={{ border: "1px solid #161717" }}
                    >
                      <table class="table table-bordered">
                        <thead>
                          <tr>
                            <th scope="col"></th>
                            <th scope="col">Sibling 1</th>
                            <th scope="col">Sibling 2</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td scope="col">Name</td>
                            <td scope="col">{leadsInfo.mx_Sibling_Name_1}</td>
                            <td scope="col">{leadsInfo.mx_Sibling_Name_2}</td>
                          </tr>
                          <tr>
                            <td scope="col">School & Grade Studying in</td>
                            <td scope="col"></td>
                            <td scope="col">
                              {
                                leadsInfo.mx_Grade_Studying_and_Applied_for_Sibling_2
                              }
                            </td>
                          </tr>
                          <tr>
                            <td scope="col">Date of Birth</td>
                            <td scope="col">
                              {leadsInfo.mx_Sibling_1_Date_of_Birth}
                            </td>
                            <td scope="col">
                              {leadsInfo.mx_Sibling_2_Date_of_Birth}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="col-md-12 dob">
                      In case parent is ( Please tick{" "}
                      <i class="fa fa-check" aria-hidden="true"></i> if
                      applicable )
                    </div>
                    <div className="col-md-12 dob">
                      School Alumni ( Presidency)
                    </div>
                    <div className="col-md-12 dob">School Staff ( PGI)</div>
                    <div className="col-md-12 office-use">
                      Check list for parents
                    </div>
                    <div
                      className="col-md-12 family-box"
                      style={{ padding: "15px", border: "1px solid #161717" }}
                    >
                      <div className="col-md-6 d-inline-block">
                        <div className="col-md-12 no-padding family-text">
                          1. Six Passport size Photographs :{" "}
                          {leadsInfo.mx_Six_Passport_size_Photographs == 0 ? (
                            <>
                              <div
                                className="checkBox"
                                style={{ marginLeft: "30%" }}
                              ></div>
                            </>
                          ) : (
                            <>
                              <div
                                className="checkBox"
                                style={{ marginLeft: "30%" }}
                              >
                                <i class="fa fa-check" aria-hidden="true"></i>
                              </div>
                            </>
                          )}
                        </div>
                        <div className="col-md-12 no-padding family-text">
                          2. Birth Certificate (photocopy) :{" "}
                          {leadsInfo.mx_Birth_Certificate_Photocopy == 0 ? (
                            <>
                              <div
                                className="checkBox"
                                style={{ marginLeft: "32%" }}
                              ></div>
                            </>
                          ) : (
                            <>
                              <div
                                className="checkBox"
                                style={{ marginLeft: "32%" }}
                              >
                                <i class="fa fa-check" aria-hidden="true"></i>
                              </div>
                            </>
                          )}
                        </div>
                        <div className="col-md-12 no-padding family-text">
                          3. Copy of Passport (Foreign Nationals) :{" "}
                          {leadsInfo.mx_Copy_of_Passport_Foreign_Nationals ==
                          0 ? (
                            <>
                              <div
                                className="checkBox"
                                style={{ marginLeft: "23%" }}
                              ></div>
                            </>
                          ) : (
                            <>
                              <div
                                className="checkBox"
                                style={{ marginLeft: "23%" }}
                              >
                                <i class="fa fa-check" aria-hidden="true"></i>
                              </div>
                            </>
                          )}
                        </div>
                        <div className="col-md-12 no-padding family-text">
                          4. Transfer Certificate - Original :{" "}
                          {leadsInfo.mx_Submitted_Original_Transfer_Certificate ==
                          0 ? (
                            <>
                              <div
                                className="checkBox"
                                style={{ marginLeft: "31%" }}
                              ></div>
                            </>
                          ) : (
                            <>
                              <div
                                className="checkBox"
                                style={{ marginLeft: "31%" }}
                              >
                                <i class="fa fa-check" aria-hidden="true"></i>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6 d-inline-block">
                        <div className="col-md-12 no-padding family-text">
                          5. School Performance Report :{" "}
                          {leadsInfo.mx_School_Performance_Report == 0 ? (
                            <>
                              <div
                                className="checkBox"
                                style={{ marginLeft: "30%" }}
                              ></div>
                            </>
                          ) : (
                            <>
                              <div
                                className="checkBox"
                                style={{ marginLeft: "30%" }}
                              >
                                <i class="fa fa-check" aria-hidden="true"></i>
                              </div>
                            </>
                          )}
                        </div>
                        <div className="col-md-12 no-padding family-text">
                          6. Post card size family photograph :{" "}
                          {leadsInfo.mx_Post_card_size_family_photograph ==
                          0 ? (
                            <>
                              <div
                                className="checkBox"
                                style={{ marginLeft: "25%" }}
                              ></div>
                            </>
                          ) : (
                            <>
                              <div
                                className="checkBox"
                                style={{ marginLeft: "25%" }}
                              >
                                <i class="fa fa-check" aria-hidden="true"></i>
                              </div>
                            </>
                          )}
                        </div>
                        <div className="col-md-12 no-padding family-text">
                          7. Copy of Caste Certificate ( if applicable ) :{" "}
                          {leadsInfo.mx_Copy_of_Caste_Certificate_if_applicable ==
                          0 ? (
                            <>
                              <div
                                className="checkBox"
                                style={{ marginLeft: "17%" }}
                              ></div>
                            </>
                          ) : (
                            <>
                              <div
                                className="checkBox"
                                style={{ marginLeft: "17%" }}
                              >
                                <i class="fa fa-check" aria-hidden="true"></i>
                              </div>
                            </>
                          )}
                        </div>
                        <div className="col-md-12 no-padding family-text">
                          8. Copy of Aadhar Card :{" "}
                          {leadsInfo.mx_Copy_of_Aadhar_Card == 0 ? (
                            <>
                              <div
                                className="checkBox"
                                style={{ marginLeft: "37%" }}
                              ></div>
                            </>
                          ) : (
                            <>
                              <div
                                className="checkBox"
                                style={{ marginLeft: "37%" }}
                              >
                                <i class="fa fa-check" aria-hidden="true"></i>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-12 office-use">
                      Check list for parents
                    </div>
                    <div
                      className="col-md-12 family-box"
                      style={{ padding: "15px", border: "1px solid #161717" }}
                    >
                      <div className="col-md-12 family-text">
                        I/ We hereby certify that the above information provided
                        by me/ us is correct and I/ we understand that if the
                        information is found to be incorrect or false, the ward
                        shall be automatically debarred from selection/
                        admission process without any correspondence in this
                        regard.
                        <br /> I/ We also understand that the application/
                        registration/ short listing does not guarantee admission
                        to my ward. I/ we accept the process of Admission
                        undertaken by the school and I/ we will abide by the
                        decision taken by the school authorities.
                      </div>
                      <div className="col-md-12">&nbsp;</div>
                      <div className="col-md-12">&nbsp;</div>
                      <div className="col-md-12">&nbsp;</div>
                      <div className="col-md-12">&nbsp;</div>
                      <div className="col-md-12">
                        <div className="col-md-3 d-inline-block family-text">
                          Date
                        </div>
                        <div className="col-md-3 d-inline-block family-text">
                          Father’s Signature
                        </div>
                        <div className="col-md-3 d-inline-block family-text">
                          Mother’s Signature
                        </div>
                        <div className="col-md-3 d-inline-block family-text">
                          Guardian's Signature
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </PDFExport>
        </div>
      </>
    );
  }
}
export default withRouter(ApplicationPreview);
