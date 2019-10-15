import React, { Component } from "react";
import { Modal } from "react-bootstrap";

class BranchModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      branch: "",
    };
  }

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
    this.props.changeModal(false, value);
  };

  render() {
    return (
      <>
        <Modal
          className="branch-modal"
          show={this.props.show}
          onHide={this.props.showBranchModal}
        >
          <div className="row">
            <div className="col-md-6 offset-3">
              <select
                name="branch"
                value={this.state.branch}
                onChange={this.handleChange}
                className="form-control"
              >
                <option>Please Select Branch</option>
                {this.props.branch.map((branch, index) => (
                  <option value={branch.value} key={index}>
                    {branch.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Modal>
      </>
    );
  }
}

export default BranchModal;
