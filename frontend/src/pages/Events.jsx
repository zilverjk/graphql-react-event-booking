import React, { Component } from "react";
import { Form, FormGroup, Label, Input } from "reactstrap";

import Modal from "../components/Modal/modal";
import AuthContext from "../context/auth-context";
import "./Events.css";

class EventsPage extends Component {
  state = {
    creating: false
  };

  static contextType = AuthContext;

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
    const price = +this.priceElRef.current.value;
    const date = this.dateElRef.current.value;
    const description = this.descriptionElRef.current.value;

    if (
      title.trim().length === 0 ||
      price <= 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0
    ) {
      return;
    }

    const event = { title, price, date, description };
    console.log(event);

    const requestBody = {
      query: `
        mutation {
          createEvent(eventInput: {title: "${title}", description: "${description}", price: ${price}, date: "${date}"}) {
            _id
            title
            description
            date
            price
            creator {
              _id
              email
            }
          }
        }
        `
    };

    // Obtengo el Token del contexto AuthContext
    const token = this.context.token;

    fetch("http://localhost:5000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) throw new Error("Error!");
        return res.json();
      })
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
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
                  type="datetime-local"
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
        {this.context.token && (
          <div className="events-control">
            <p>Comparte tus eventos!</p>
            <button
              className="btn btn-warning"
              onClick={this.startCreateEventHandler}
            >
              Nuevo Evento
            </button>
          </div>
        )}
        <ul className="events__list">
          <li className="events__list-item" />
        </ul>
      </React.Fragment>
    );
  }
}

export default EventsPage;
