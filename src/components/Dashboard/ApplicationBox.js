import React from "react";
import { nonDigitRemove, momentFormat } from "../../utils/functions";
import { Link } from "react-router-dom";

const ApplicationBox = (props) =>{
    return(
        <>
            <div className="col-md-12 body-box">
            <div className="col-md-4 d-inline-block no-padding box-display">
              <div className="col-md-12 enquiry-text">
                {props.name}
              </div>
              <div className="col-md-12 no-padding">
                <div className={`${props.className}`}>{props.status}</div>
              </div>
            </div>
            <div className="col-md-4 d-inline-block no-padding box-display">
              <div className="col-md-12 application-number">
                PS-
                {nonDigitRemove(props.RelatedProspectId)}
              </div>
              <div className="col-md-12 no-padding">
                <span className="last-updated">
                  Last Updated On :
                </span>
                <span className="date-update">
                  {momentFormat(props.ModifiedOn)}
                </span>
              </div>
            </div>
            <div className="col-md-4 btn-block box-display">
              <Link
                className="btn btn-view"
                to={`/enquiryForm/${props.activityId}`}
              >
                View Application
              </Link>
            </div>
          </div>
        </>
    )
}

export default ApplicationBox;