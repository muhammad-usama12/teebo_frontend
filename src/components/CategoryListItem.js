import React, { useState } from "react";
import classNames from "classnames";

export default function CategoryListItem(props) {
  const [clicked, setClicked] = useState(false);

  const user = props.user;

  const categoryclass = classNames("pill-container category-item", {
    "clicked": props.spoiler && clicked,
    "pill-image": props.img

  });

  const someFavouriteShow = props.tvShowId;

  const handleClick = () => {
    if (props.spoiler) {
      if (!clicked) {
        setClicked(true);
      } else {
        setClicked(false)
      }
    }
    props.onClick()
  }

  const handleDeleteFavourite = () => {
    if (someFavouriteShow) {
      return props.deleteFavourites(someFavouriteShow, user.id);
    }
  }

  return (
    <button
      className={categoryclass}
      onClick={handleClick}
    >
      {!clicked && <p>{props.name}</p>}
      {clicked && <p>show spoilers</p>}
      <img src={props.img} alt=""></img>
      {someFavouriteShow && <>&nbsp;</>}
      {someFavouriteShow &&
        <i
          className="fa-regular fa-circle-xmark"
          onClick={handleDeleteFavourite}
        ></i>}
    </button>
  );
}