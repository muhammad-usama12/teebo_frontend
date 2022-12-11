import React from "react";
import "./Create.scss";

// We pass props from App.js
export default function Create(props) {
  return (
    <section className="create-post">
      <h1>which pot are you stirring today?</h1>
      <i
        className="pen-icon fa-solid fa-marker fa-bounce"
        onClick={props.onClick}></i>
    </section>
  );
}