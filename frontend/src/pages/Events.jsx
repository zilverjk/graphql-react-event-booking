import React, { Component } from "react";
import { Form, FormGroup, Label, Input } from "reactstrap";

import Modal from "../components/Modal/modal";
import "./Events.css";

class EventsPage extends Component {
  state = {
    creating: false
  };

  constructor(props) {
    super(props);
    this.titleElRef = React.createRef();
    this.priceElRef = React.createRef();
    this.dateElRef = React.createRef();
    this.descriptionElRef = React.createRef();
  }

  startCreateEventHandler = () => {
    this.setState({ creating: true });
  };

  modalConfirmHandler = () => {
    this.setState({ creating: false });
    const title = this.titleElRef.current.value;
    const price = this.priceElRef.current.value;
    const date = this.dateElRef.current.value;
    const description = this.descriptionElRef.current.value;

    if (
      title.trim().length === 0 ||
      price.trim().length === 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0
    ) {
      return;
    }

    const event = { title, price, date, description };
    console.log(event);
  };

  modalCloseHandler = () => {
    this.setState({ creating: false });
  };

  render() {
    return (
      <React.Fragment>
        {this.state.creating && (
          <Modal
            title="Añadir Evento"
            canCancel
            canConfirm
            toggle={this.state.creating}
            close={this.modalCloseHandler}
            confirm={this.modalConfirmHandler}
          >
            <Form>
              <FormGroup>
                <Label for="txtTitle">Titulo</Label>
                <Input
                  name="title"
                  id="txtTitle"
                  placeholder="Coloca algo nuevo!"
                  innerRef={this.titleElRef}
                />
              </FormGroup>
              <FormGroup>
                <Label for="txtPrice">Precio</Label>
                <Input
                  type="number"
                  name="price"
                  id="txtPrice"
                  innerRef={this.priceElRef}
                />
              </FormGroup>
              <FormGroup>
                <Label for="txtDate">Fecha</Label>
                <Input
                  type="date"
                  name="date"
                  id="txtDate"
                  innerRef={this.dateElRef}
                />
              </FormGroup>
              <FormGroup>
                <Label for="txtDescription">Descripción</Label>
                <Input
                  type="textarea"
                  name="description"
                  id="txtDescription"
                  innerRef={this.descriptionElRef}
                />
              </FormGroup>
            </Form>
          </Modal>
        )}
        <div className="events-control">
          <p>Comparte tus eventos!</p>
          <button
            className="btn btn-warning"
            onClick={this.startCreateEventHandler}
          >
            Nuevo Evento
          </button>
        </div>
      </React.Fragment>
    );
  }
}

export default EventsPage;
