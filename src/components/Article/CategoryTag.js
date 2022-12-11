import React from "react";
import "../Category.scss";

// The show name that appears on the bottom of an article
export default function CategoryTag(props) {
  return (
    <button className="pill-container category-tag" onClick={props.onClick}>
      {props.name}
    </button>
  );
}
