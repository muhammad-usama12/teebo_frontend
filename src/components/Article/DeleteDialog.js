import React from "react";
import "./DeleteDialog.scss";

function DeleteDialog(props) {
  return (
    <div className="modalBackground">
      <div className="modalContainer">
        <div className="message-close">
          <h3>are you sure?</h3>
        </div>
        <div className="body"></div>
        <div className="footer">
          <button
            onClick={() => {
              props.close(false);
            }}
            id="cancelBtn"
          >
            cancel
          </button>
          <button onClick={props.open}>
            delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteDialog;
