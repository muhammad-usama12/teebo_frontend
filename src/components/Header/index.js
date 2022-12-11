import React from "react";
import "./Header.scss";

import { Link } from "react-router-dom";

export default function Header(props) {
  return (
    <header>
      <div className="App">
        <nav className="Navbar">
          <Link to="/">
            <h2>teebo</h2>
          </Link>
          <ul>
            <li className="spacing">
              {!document.cookie && <Link to="/signup">sign up</Link>}
            </li>
            <li id="log-in">{!document.cookie && <Link to="/login">log in</Link>}</li>
            {document.cookie && (
            <li>
              <Link to="/profile" onClick={props.profile}>
                profile
              </Link>
            </li>
            )}
            {document.cookie && (
            <li>
              <Link to="#" onClick={props.logout}>
                log out
              </Link>
            </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
