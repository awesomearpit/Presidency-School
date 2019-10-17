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
            margin="0.5cm"
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
                      <div className="col-md-12 session-box">
                        <div className="col-md-2 session-text">
                          Grade Applied for
                        </div>
                        <div className="col-md-1 session-div">
                          {leadsInfo.mx_Grade_Applied_for}
                        </div>
                        <div className="col-md-3 session-text">
                          For Academic Session
                        </div>
                        <div className="col-md-3 session-div">
                          {leadsInfo.mx_For_Academic_Session}
                        </div>
                      </div>
                      <div className="col-md-12 office-use">Ofﬁce Use Only</div>
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
                        {moment(leadsInfo.mx_Date_of_Birth).format(
                          "DD/MM/YYYY"
                        )}
                      </div>
                      <div className="gender d-inline-block pull-right">
                        Gender: {leadsInfo.mx_Gender}
                      </div>
                    </div>
                    <div className="col-md-12 dob">In Words</div>
                    <div className="col-md-12 dob">
                      Age as on 1st June : {leadsInfo.mx_Age_as_on_1_June_2019}
                    </div>
                    <div className="col-md-12 dob">
                      Place of Birth(City and country):{" "}
                      {leadsInfo.mx_Place_of_Birth}
                    </div>
                    <div className="col-md-12 dob">
                      Nationality : {leadsInfo.mx_Nationality}
                    </div>
                    <div className="col-md-12 no-padding">
                      <div className="col-md-6 d-inline-block dob">
                        Aadhar Card No.: {leadsInfo.mx_Aadhaar_Card_No}
                      </div>
                      <div className="col-md-6 d-inline-block dob">
                        Blood Group : {leadsInfo.mx_Blood_Group}
                      </div>
                    </div>
                    <div className="col-md-12 no-padding">
                      <div className="col-md-6 d-inline-block dob">
                        Religion : {leadsInfo.mx_Religion}
                      </div>
                      <div className="col-md-6 d-inline-block dob">
                        Caste : {leadsInfo.mx_Caste}
                      </div>
                    </div>
                    <div className="col-md-12 no-padding">
                      <div className="col-md-6 d-inline-block dob">
                        Mother Tounge : {leadsInfo.mx_Mother_Tongue}
                      </div>
                      <div className="col-md-6 d-inline-block dob">
                        Whether School transport required :{" "}
                        {leadsInfo.mx_Whether_School_transport_required}
                      </div>
                    </div>
                    <div className="col-md-12 office-use">
                      Family Details ( Please Tick the name of the person to be
                      contacted in case of Emergency )
                    </div>
                    <div
                      className="col-md-5 family-box"
                      style={{ marginRight: "15px" }}
                    >
                      <div className="col-md-12 family-text text-center">
                        Father’s Full Name ( as per proof attached ) :{" "}
                        {leadsInfo.mx_Father_Full_Name}
                      </div>
                      <div className="col-md-12 family-text">
                        Educational Qualiﬁcation :{" "}
                        {leadsInfo.mx_Father_Educational_Qualifications}
                      </div>
                      <div className="col-md-12 family-text">
                        Employed / Self-Employed :{" "}
                        {leadsInfo.mx_Father_Employed_or_Self_Employed}
                      </div>
                      <div className="col-md-12 family-text">
                        Occupation : {leadsInfo.mx_Father_Occupation}
                      </div>
                      <div className="col-md-12 family-text">
                        Designation : {leadsInfo.mx_Father_Designation}
                      </div>
                      <div className="col-md-12 family-text">
                        Name Of the Organization :{" "}
                        {leadsInfo.mx_Father_Organisation}
                      </div>
                      <div className="col-md-12 family-text">
                        Phone Number office :{" "}
                        {leadsInfo.mx_Father_Mobile_Number}
                      </div>
                      <div className="col-md-12 family-text">
                        Annual Income : {leadsInfo.mx_Father_Annual_Income}
                      </div>
                      <div className="col-md-12 family-text">
                        Mobile Number : {leadsInfo.mx_Father_Mobile_Number}
                      </div>
                      <div className="col-md-12 family-text">
                        E-mail : {leadsInfo.mx_Father_EMail_ID}
                      </div>
                      <div className="col-md-12 family-text">
                        Aadhar Card No. : {leadsInfo.mx_Father_Aadhaar_Card_No}
                      </div>
                    </div>
                    <div
                      className="col-md-5 family-box"
                      style={{ marginLeft: "15px" }}
                    >
                      <div className="col-md-12 family-text text-center">
                        Mother's Full Name ( as per proof attached ) :{" "}
                        {leadsInfo.mx_Mother_Name}
                      </div>
                      <div className="col-md-12 family-text">
                        Educational Qualiﬁcation :{" "}
                        {leadsInfo.mx_Mother_Educational_Qualifications}
                      </div>
                      <div className="col-md-12 family-text">
                        Employed / Self-Employed :{" "}
                        {leadsInfo.mx_Mother_Employed_or_Self_Employed}
                      </div>
                      <div className="col-md-12 family-text">
                        Occupation : {leadsInfo.mx_Mother_Occupation}
                      </div>
                      <div className="col-md-12 family-text">
                        Designation : {leadsInfo.mx_Mother_Designation}
                      </div>
                      <div className="col-md-12 family-text">
                        Name Of the Organization :{" "}
                        {leadsInfo.mx_Mother_Organisation}
                      </div>
                      <div className="col-md-12 family-text">
                        Phone Number office :{" "}
                        {leadsInfo.mx_Mother_Mobile_Number}
                      </div>
                      <div className="col-md-12 family-text">
                        Annual Income : {leadsInfo.mx_Mother_Annual_Income}
                      </div>
                      <div className="col-md-12 family-text">
                        Mobile Number : {leadsInfo.mx_Mother_Mobile_Number}
                      </div>
                      <div className="col-md-12 family-text">
                        E-mail : {leadsInfo.mx_Mother_Email_ID}
                      </div>
                      <div className="col-md-12 family-text">
                        Aadhar Card No. : {leadsInfo.mx_Mother_Aadhaar_Card_No}
                      </div>
                    </div>
                    <div className="col-md-12 dob">
                      Resedential Address :{" "}
                      {leadsInfo.mx_Father_Residential_Address}
                    </div>
                    <div className="col-md-12 no-padding">
                      <div className="col-md-6 d-inline-block dob">
                        Pin Code : {leadsInfo.mx_Pincode}{" "}
                      </div>
                      <div className="col-md-6 d-inline-block dob">
                        Phone number Residence : {leadsInfo.Phone}
                      </div>
                    </div>
                    <div className="col-md-12 office-use">Guardian Details</div>
                    <div className="col-md-12 dob">
                      Full Name Of Guardian :{" "}
                      {leadsInfo.mx_Full_Name_of_the_Guardian}
                    </div>
                    <div className="col-md-12 dob">
                      Residential Address :{" "}
                      {leadsInfo.mx_Guardian_Residential_Address}
                    </div>
                    <div className="col-md-12 dob">
                      Mobile : {leadsInfo.mx_Guardian_Mobile}{" "}
                    </div>
                    <div className="col-md-12 dob">
                      E-mail : {leadsInfo.mx_Guardian_Email}{" "}
                    </div>
                    <div className="col-md-12 office-use">Other Details </div>
                    <div className="col-md-12 dob">
                      Single Parent ( Please tick ✓ if applicable ) :{" "}
                      {leadsInfo.mx_Single_Parent_Please_select_if_applicable}
                    </div>
                    <div className="col-md-12 dob">
                      In case Parents are separated, custody of the child is
                      with ( Please tick ✓ if applicable ) :{" "}
                      {
                        leadsInfo.mx_In_case_Parents_are_separated_Select_if_applicable
                      }
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
                      style={{ padding: "15px" }}
                    >
                      <div className="col-md-12 family-text">
                        Kannada Language is compulsory from Grades I to IV
                      </div>
                      <div className="col-md-12 family-text">
                        Second Language ( Grades V to X ) :{" "}
                        {leadsInfo.mx_Second_Language_Grades_V_to_X}
                      </div>
                      <div className="col-md-12 family-text">
                        Third Language ( Grades V to VIII ) :{" "}
                        {leadsInfo.mx_Third_Language__Grades_V_to_VIII}
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
                        School last attended
                      </div>
                      <div className="col-md-6 d-inline-block dob">
                        Board of the School last attended :{" "}
                        {leadsInfo.mx_Board_of_the_School_last_attended}
                      </div>
                    </div>
                    <div className="col-md-12 no-padding">
                      <div className="col-md-6 d-inline-block dob">
                        City : {leadsInfo.mx_City_Last_School_Attended}{" "}
                      </div>
                      <div className="col-md-3 d-inline-block dob">State</div>
                      <div className="col-md-3 d-inline-block dob">
                        Country : {leadsInfo.mx_Country_of_last_school_attended}
                      </div>
                    </div>
                    <div className="col-md-12 no-padding">
                      <div className="col-md-6 d-inline-block dob">
                        Grade previously studied in :{" "}
                        {leadsInfo.mx_Grade_previously_studied_in}
                      </div>
                      <div className="col-md-6 d-inline-block dob">
                        Number of years in the previous School :{" "}
                        {leadsInfo.mx_Number_of_years_in_the_previous_School}
                      </div>
                    </div>
                    <div className="col-md-12 dob">
                      Reasons for withdrawal :{" "}
                      {leadsInfo.mx_Reasons_for_withdrawal}{" "}
                    </div>
                    <div className="col-md-12 office-use">
                      Details of previous schooling & photocopies of grades or
                      marks obtained in last exam to be attached.
                    </div>
                    <div className="col-md-12 no-padding family-box">
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
                        {leadsInfo.mx_Languages_formally_studied__First}
                      </div>
                      <div className="col-md-3 d-inline-block dob">
                        Second :{" "}
                        {leadsInfo.mx_Languages_formally_studied__Second}{" "}
                      </div>
                      <div className="col-md-3 d-inline-block dob">
                        Third : {leadsInfo.mx_Languages_formally_studied_Third}{" "}
                      </div>
                    </div>
                    <div className="col-md-12 dob">
                      Sports, Games and Activities involved in :{" "}
                      {leadsInfo.mx_Sports_Games_and_Activities_involved_in}
                    </div>
                    <div className="col-md-12 dob">
                      Recent Accomplishments :{" "}
                      {leadsInfo.mx_Recent_Accomplishments}
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
                        T.C. No : {leadsInfo.mx_TC_No}{" "}
                      </div>
                    </div>
                    <div className="col-md-12 no-padding">
                      <div className="col-md-4 ml-auto dob">
                        School DISE Code : {leadsInfo.mx_School_DISE_Code}{" "}
                      </div>
                    </div>
                    <div className="col-md-12 no-padding">
                      <div className="col-md-4 ml-auto dob">
                        Student Enrollment Number :{" "}
                        {leadsInfo.mx_Student_Enrollment_Number}
                      </div>
                    </div>
                    <div className="col-md-12 office-use">
                      Sibling Details{" "}
                      <span>( to be filled in if applicable )</span>
                    </div>
                    <div className="col-md-12 no-padding family-box">
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
                      In case parent is ( Please tick ✓ if applicable )
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
                      style={{ padding: "15px" }}
                    >
                      <div className="col-md-6 d-inline-block">
                        <div className="col-md-12 no-padding family-text">
                          1. Six Passport size Photographs :{" "}
                          {leadsInfo.mx_Six_Passport_size_Photographs}
                        </div>
                        <div className="col-md-12 no-padding family-text">
                          2. Birth Certificate (photocopy) :{" "}
                          {leadsInfo.mx_Birth_Certificate_Photocopy}
                        </div>
                        <div className="col-md-12 no-padding family-text">
                          3. Copy of Passport (Foreign Nationals) :{" "}
                          {leadsInfo.mx_Copy_of_Passport_Foreign_Nationals}
                        </div>
                        <div className="col-md-12 no-padding family-text">
                          4. Transfer Certificate - Original :{" "}
                          {leadsInfo.mx_Submitted_Original_Transfer_Certificate}
                        </div>
                      </div>
                      <div className="col-md-6 d-inline-block">
                        <div className="col-md-12 no-padding family-text">
                          5. School Performance Report :{" "}
                          {leadsInfo.mx_School_Performance_Report}
                        </div>
                        <div className="col-md-12 no-padding family-text">
                          6. Post card size family photograph :{" "}
                          {leadsInfo.mx_Post_card_size_family_photograph}
                        </div>
                        <div className="col-md-12 no-padding family-text">
                          7. Copy of Caste Certificate ( if applicable ) :{" "}
                          {leadsInfo.mx_Copy_of_Caste_Certificate_if_applicable}
                        </div>
                        <div className="col-md-12 no-padding family-text">
                          8. Copy of Aadhar Card :{" "}
                          {leadsInfo.mx_Copy_of_Aadhar_Card}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-12 office-use">
                      Check list for parents
                    </div>
                    <div
                      className="col-md-12 family-box"
                      style={{ padding: "15px" }}
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
