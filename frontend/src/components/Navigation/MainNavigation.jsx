import React from "react";
import { NavLink } from "react-router-dom";

import AuthContext from "../../context/auth-context";
import "./mainNavigation.css";

const mainNavigation = props => (
  <AuthContext.Consumer>
    {context => {
      return (
        <header className="main-navigation">
          <div className="main-navigation__logo">
            <h1>EasyEvent</h1>
          </div>
          <nav className="main-navigation__items">
            <ul>
              {!context.token && (
                <li>
                  <NavLink to="/auth">Ingresar</NavLink>
                </li>
              )}
              <li>
                <NavLink to="/events">Eventos</NavLink>
              </li>
              {context.token && (
                <React.Fragment>
                  <li>
                    <NavLink to="/bookings">Bookings</NavLink>
                  </li>
                  <li>
                    <NavLink onClick={context.logout}>Salir</NavLink>
                  </li>
                </React.Fragment>
              )}
            </ul>
          </nav>
        </header>
      );
    }}
  </AuthContext.Consumer>
);

export default mainNavigation;
