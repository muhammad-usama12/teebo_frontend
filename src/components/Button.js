import React from "react";
import classNames from "classnames";
import "./Button.scss";

export default function Button(props) {
  const buttonClass = classNames("button", {
    "button--confirm": props.confirm,
    "button--cancel": props.cancel,
    "button--image": props.image,
    "button--trash": props.trash,
    "button--gif": props.gif
  });

  return (
    <button className={buttonClass} onClick={props.onClick}>
      {props.message}
    </button>
  );
}
