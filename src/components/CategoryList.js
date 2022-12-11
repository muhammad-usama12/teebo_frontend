import React from "react";
import classNames from "classnames";
import "./Category.scss";

import CategoryListItem from "./CategoryListItem";


export default function CategoryList(props) {
  
  const categoriesArray = props.shows;

  const categoryListClass = classNames("category-list", {
    "overflow" : categoriesArray.length > 6
  });

  const categories = categoriesArray.map((category) => (
    <CategoryListItem
      state={props.state}
      user={props.user}
      deleteFavourites={props.deleteFavourites}
      updateFavourites={props.updateFavourites}
      key={category.id}
      favLength = {categoriesArray.length}
      name={category.name}
      img={category.image_url}
      onClick={() => props.getFilteredShows(category.id)}
    />
  ));

  return (
    <>
      <div className="general-filter">
        <CategoryListItem
          showAll
          name="show all"
          onClick={props.getAllShows}
          user={props.user}
          state={props.state}
        />
        <CategoryListItem
          spoiler
          name="hide spoilers"
          onClick={props.hideSpoilers}
          user={props.user}
          state={props.state}
        />
      </div>
      <div className={categoryListClass}>{categories}</div>
    </>
  );
}
