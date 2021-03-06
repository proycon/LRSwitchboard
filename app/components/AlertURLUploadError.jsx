import React from 'react';
import PropTypes from 'prop-types';
import {ModalContainer, ModalDialog} from 'react-modal-dialog';

export default class UserHelp extends React.Component {
  static propTypes = {
    className: PropTypes.string,
  }
  state = {
    showModal: true
  }
  openModal = () => {
    this.setState({showModal: true});
  }
  closeModal = () => {
    this.setState({showModal: false});
  }
  render() {
    return <a className={this.props.className} onClick={this.openModal}>
      {this.state.showModal ?
        <AlertURLUploadError onClose={this.closeModal}/>
      : null}
    </a>;
  }
}

class AlertURLUploadError extends React.Component {
  static propTypes = {
    onClose: PropTypes.func,
  }
  render() {
    return <ModalContainer onClose={this.props.onClose}>
        <ModalDialog onClose={this.props.onClose} className="systemAlertDialog"  width={400}>
	    <h2>Resource Upload Error</h2>
	    <p>
	  The switchboard was unable to upload your resource to a file storage location (so that the resource becomes accessible for the tools connected to the switchboard). Please try again. If failure persists, please contact the switchboard development team at "switchboard@clarin.eu". 
	    </p>
        </ModalDialog>
    </ModalContainer>;
  }
}

