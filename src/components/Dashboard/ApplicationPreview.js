import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import { get } from "../../utils/API";
import { ACCESS_KEY, SECRET_KEY, LEAD_ID } from "../../utils/Constants";
import Pdf from "react-to-pdf";
import "../../assets/css/preview.scss";

class ApplicationPreview extends Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.options = {
      orientation: "landscape",
      format: [1024, 1000],
    };
    this.state = {
      leadsInfo: {},
      displayName: "",
    };
  }

  async componentDidMount() {
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
  }

  render() {
    const { leadsInfo } = this.state;
    return (
      <>
        <Pdf
          targetRef={this.ref}
          filename="application.pdf"
          options={this.options}
        >
          {({ toPdf }) => (
            <button className="btn btn-primary" onClick={toPdf}>
              Generate Pdf
            </button>
          )}
        </Pdf>
        <div ref={this.ref}>
          <div className="preview">
            <div className="application-preview">
              <div className="col-md-12 application-heading">
                APPLICATION FOR ADMISSION
              </div>
              <div className="row no-margin top-view">
                <div className="col-md-10 no-padding left-view">
                  <div className="col-md-12 text">
                    General Instructions 1) Fill the form in BLOCK LETTERS Only
                    2) To be ﬁlled and signed only by Parents.
                  </div>
                  <div className="col-md-12 text">
                    Names and DOB entered in this form will be treated as ﬁnal
                    and no changes will be accepted in future.
                  </div>
                  <div className="col-md-12 session-box">
                    <div className="col-md-2 session-text">
                      Grade Applied for
                    </div>
                    <div className="col-md-1 session-div"></div>
                    <div className="col-md-3 session-text">
                      For Academic Session
                    </div>
                    <div className="col-md-3 session-div"></div>
                  </div>
                  <div className="col-md-12 office-use">Ofﬁce Use Only</div>
                  <div className="col-md-12 no-padding">
                    <div className="receipt-text">Receipt No.</div>
                    <div className="receipt-text">Receipt No.</div>
                    <div className="receipt-text">Receipt No.</div>
                    <div className="receipt-text">Receipt No.</div>
                    <div className="receipt-text">Date</div>
                    <div className="receipt-text">Date</div>
                  </div>
                </div>
                <div className="col-md-2"></div>
              </div>
              <div className="row body-view no-margin">
                <div className="col-md-12 office-use">Student Information</div>
                <div className="col-md-12 student-name">
                  Name of the Student
                  <span>( As per Birth Certiﬁcate / Passport )</span>
                </div>
                <div className="col-md-12 student-name">Name</div>
                <div className="col-md-12 no-padding">
                  <div className="col-md-1 no-padding d-inline-block">
                    <div className="dob">Date of Birth</div>
                  </div>
                  <div className="d-inline-block dob">Date</div>
                  <div className="gender d-inline-block pull-right">
                    Gender: Male
                  </div>
                </div>
                <div className="col-md-12 dob">In Words</div>
                <div className="col-md-12 dob">Age as on 1st June</div>
                <div className="col-md-12 dob">
                  Place of Birth(City and country)
                </div>
                <div className="col-md-12 dob">Nationality</div>
                <div className="col-md-12 no-padding">
                  <div className="col-md-6 d-inline-block dob">
                    Aadhar Card No.
                  </div>
                  <div className="col-md-6 d-inline-block dob">Blood Group</div>
                </div>
                <div className="col-md-12 no-padding">
                  <div className="col-md-6 d-inline-block dob">Religion</div>
                  <div className="col-md-6 d-inline-block dob">Caste</div>
                </div>
                <div className="col-md-12 no-padding">
                  <div className="col-md-6 d-inline-block dob">
                    Mother Tounge
                  </div>
                  <div className="col-md-6 d-inline-block dob">
                    Whether School transport required
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
                    Father’s Full Name ( as per proof attached )
                  </div>
                  <div className="col-md-12 family-text">
                    Educational Qualiﬁcation
                  </div>
                  <div className="col-md-12 family-text">
                    Employed / Self-Employed
                  </div>
                  <div className="col-md-12 family-text">Occupation</div>
                  <div className="col-md-12 family-text">Designation</div>
                  <div className="col-md-12 family-text">
                    Name Of the Organization
                  </div>
                  <div className="col-md-12 family-text">
                    Phone Number office
                  </div>
                  <div className="col-md-12 family-text">Annual Income</div>
                  <div className="col-md-12 family-text">Mobile Number</div>
                  <div className="col-md-12 family-text">E-mail</div>
                  <div className="col-md-12 family-text">Aadhar Card No.</div>
                </div>
                <div
                  className="col-md-5 family-box"
                  style={{ marginLeft: "15px" }}
                >
                  <div className="col-md-12 family-text text-center">
                    Mother's Full Name ( as per proof attached )
                  </div>
                  <div className="col-md-12 family-text">
                    Educational Qualiﬁcation
                  </div>
                  <div className="col-md-12 family-text">
                    Employed / Self-Employed
                  </div>
                  <div className="col-md-12 family-text">Occupation</div>
                  <div className="col-md-12 family-text">Designation</div>
                  <div className="col-md-12 family-text">
                    Name Of the Organization
                  </div>
                  <div className="col-md-12 family-text">
                    Phone Number office
                  </div>
                  <div className="col-md-12 family-text">Annual Income</div>
                  <div className="col-md-12 family-text">Mobile Number</div>
                  <div className="col-md-12 family-text">E-mail</div>
                  <div className="col-md-12 family-text">Aadhar Card No.</div>
                </div>
                <div className="col-md-12 dob">Resedential Address</div>
                <div className="col-md-12 no-padding">
                  <div className="col-md-6 d-inline-block dob">Pin Code</div>
                  <div className="col-md-6 d-inline-block dob">
                    Phone number Residence
                  </div>
                </div>
                <div className="col-md-12 office-use">Guardian Details</div>
                <div className="col-md-12 dob">Full Name Of Guardian</div>
                <div className="col-md-12 dob">Residential Address</div>
                <div className="col-md-12 dob">Mobile</div>
                <div className="col-md-12 dob">E-mail</div>
                <div className="col-md-12 office-use">Other Details</div>
                <div className="col-md-12 dob">
                  Single Parent ( Please tick ✓ if applicable )
                </div>
                <div className="col-md-12 dob">
                  In case Parents are separated, custody of the child is with (
                  Please tick ✓ if applicable ){" "}
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
                    Second Language ( Grades V to X )
                  </div>
                  <div className="col-md-12 family-text">
                    Third Language ( Grades V to VIII )
                  </div>
                </div>
                <div className="col-md-12 dob" style={{ paddingTop: "0px" }}>
                  Note: a) 2nd and 3rd Language cannot be same.
                  <br /> b) Availability of 2nd and 3rd Language option to be
                  checked with Relationship Executive before filling the
                  details.
                </div>
                <div className="col-md-12 office-use">Academic Record</div>
                <div className="col-md-12 no-padding">
                  <div className="col-md-6 d-inline-block dob">
                    School last attended
                  </div>
                  <div className="col-md-6 d-inline-block dob">
                    Board of the School last attended
                  </div>
                </div>
                <div className="col-md-12 no-padding">
                  <div className="col-md-6 d-inline-block dob">City</div>
                  <div className="col-md-3 d-inline-block dob">State</div>
                  <div className="col-md-3 d-inline-block dob">Country</div>
                </div>
                <div className="col-md-12 no-padding">
                  <div className="col-md-6 d-inline-block dob">
                    Grade previously studied in
                  </div>
                  <div className="col-md-6 d-inline-block dob">
                    Number of years in the previous School
                  </div>
                </div>
                <div className="col-md-12 dob">Reasons for withdrawal</div>
                <div className="col-md-12 office-use">
                  Details of previous schooling & photocopies of grades or marks
                  obtained in last exam to be attached.
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
                    Languages formally studied - First
                  </div>
                  <div className="col-md-3 d-inline-block dob">Second</div>
                  <div className="col-md-3 d-inline-block dob">Third</div>
                </div>
                <div className="col-md-12 dob">
                  Sports, Games and Activities involved in
                </div>
                <div className="col-md-12 dob">Recent Accomplishments</div>
                <div className="col-md-12 dob">
                  Submitted Original Transfer Certificate ( Please tick ✓ ) Yes
                  No
                </div>
                <div className="col-md-12 no-padding">
                  <div className="col-md-4 ml-auto dob">T.C. No</div>
                </div>
                <div className="col-md-12 no-padding">
                  <div className="col-md-4 ml-auto dob">School DISE Code</div>
                </div>
                <div className="col-md-12 no-padding">
                  <div className="col-md-4 ml-auto dob">
                    Student Enrollment Number
                  </div>
                </div>
                <div className="col-md-12 office-use">
                  Sibling Details <span>( to be filled in if applicable )</span>
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
                        <td scope="col"></td>
                        <td scope="col"></td>
                      </tr>
                      <tr>
                        <td scope="col">School & Grade Studying in</td>
                        <td scope="col"></td>
                        <td scope="col"></td>
                      </tr>
                      <tr>
                        <td scope="col">Date of Birth</td>
                        <td scope="col"></td>
                        <td scope="col"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="col-md-12 dob">
                  In case parent is ( Please tick ✓ if applicable )
                </div>
                <div className="col-md-12 dob">School Alumni ( Presidency)</div>
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
                      1. Six Passport size Photographs
                    </div>
                    <div className="col-md-12 no-padding family-text">
                      2. Birth Certificate (photocopy)
                    </div>
                    <div className="col-md-12 no-padding family-text">
                      3. Copy of Passport (Foreign Nationals)
                    </div>
                    <div className="col-md-12 no-padding family-text">
                      4. Transfer Certificate - Original
                    </div>
                  </div>
                  <div className="col-md-6 d-inline-block">
                    <div className="col-md-12 no-padding family-text">
                      5. School Performance Report
                    </div>
                    <div className="col-md-12 no-padding family-text">
                      6. Post card size family photograph
                    </div>
                    <div className="col-md-12 no-padding family-text">
                      7. Copy of Caste Certificate ( if applicable )
                    </div>
                    <div className="col-md-12 no-padding family-text">
                      8. Copy of Aadhar Card
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
                    I/ We hereby certify that the above information provided by
                    me/ us is correct and I/ we understand that if the
                    information is found to be incorrect or false, the ward
                    shall be automatically debarred from selection/ admission
                    process without any correspondence in this regard.
                    <br /> I/ We also understand that the application/
                    registration/ short listing does not guarantee admission to
                    my ward. I/ we accept the process of Admission undertaken by
                    the school and I/ we will abide by the decision taken by the
                    school authorities.
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
                      Mother’s Signature
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default withRouter(ApplicationPreview);
