import React from "react";

const SuccessMessage = props => {
  return (
    <>
      <div className="success-container">
        <div className="row no-margin">
          <div className="col-md-12 check-box">
            <i class="fa fa-check-circle" aria-hidden="true"></i>
          </div>
          <div className="col-md-12 text">{props.message}</div>
        </div>
      </div>
    </>
  );
};

export default SuccessMessage;
