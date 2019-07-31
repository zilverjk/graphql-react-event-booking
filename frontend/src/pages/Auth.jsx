import React, { Component } from "react";

import "./Auth.css";
import AuthContext from "../context/auth-context";

class AuthPage extends Component {
  state = {
    isLogin: true
  };

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
  }

  switchModeHandler = () => {
    this.setState(prevState => {
      return { isLogin: !prevState.isLogin };
    });
  };

  submitHandler = event => {
    event.preventDefault();
    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;

    if (email.trim().length === 0 || password.trim().length === 0) return;

    let requestBody = {
      query: `
        query {
          login(email: "${email}", password: "${password}") {
            userId
            token
            tokenExpiration
          }
        }
      `
    };

    if (!this.state.isLogin) {
      requestBody = {
        query: `
        mutation {
          createUser(userInput: {email: "${email}", password: "${password}"}) {
            _id
            email
          }
        }
        `
      };
    }

    fetch("http://localhost:5000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) throw new Error("Error!");
        return res.json();
      })
      .then(res => {
        if (res.data.login.token) {
          this.context.login(
            res.data.login.token,
            res.data.login.userId,
            res.data.login.tokenExpiration
          );
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    return (
      <form className="auth-form" onSubmit={this.submitHandler}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            ref={this.emailEl}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            ref={this.passwordEl}
          />
        </div>
        <div className="form-group">
          <button className="btn btn-success" type="submit">
            {this.state.isLogin ? "Ingresar" : "Registrar"}
          </button>
          <button
            type="button"
            className="btn btn-info ml-2"
            onClick={this.switchModeHandler}
          >
            Cambiar a {this.state.isLogin ? "Registrar" : "Login"}
          </button>
        </div>
      </form>
    );
  }
}

export default AuthPage;
