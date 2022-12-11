import React, { useState } from "react";
import Button from "../Button";

export default function CommentForm(props) {
 
  const [text, setText] = useState("");

  const handleSubmit = event => {
    event.preventDefault(); 
    props.validate(text);
    setText('');
    };

  return (
    <div className="comment-form">
      {props.error !== "" && <p className="error">{props.error}</p>}
      <form onSubmit={(event) => event.preventDefault()} autoComplete="off">
        <textarea
          name="text"
          type="text"
          placeholder="let em hear it"
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
     </form>
      <Button
        type="reset"
        confirm
        className="button--confirm"
        message="greenlight"
        onClick={handleSubmit}
      />
    </div>
   
  );
}
