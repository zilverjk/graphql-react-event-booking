import React from "react";

import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

const modal = props => {
  return (
    <Modal isOpen={props.toggle}>
      <ModalHeader toggle={props.close}>{props.title}</ModalHeader>
      <ModalBody>{props.children}</ModalBody>
      <ModalFooter>
        <button className="btn btn-secondary" onClick={props.close}>
          Cancelar
        </button>
        <button className="btn btn-success" onClick={props.confirm}>
          Confirmar
        </button>
      </ModalFooter>
    </Modal>
  );
};

export default modal;
