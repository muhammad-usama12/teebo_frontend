import React, { useState } from "react";
import axios from "axios";

const searchShows = async (query) => {
  const { data } = await axios.get(
    `https://api.tvmaze.com/search/shows?q=${query}`
  );

  console.log(
    "data from tv maze:",
    data[0].show,
    data[0].show.name,
    data[0].show.image.medium,
    data[0].show.image.original
  );
};

// searchShows("The Office");

export default function Search() {
  const [search, setSearch] = useState("");

  const onSearchHandler = (e) => {
    e.preventDefault();

    if (search === "") {
      alert("Please enter something", "danger");
    } else {
      searchShows(search);
    }
  };
  return (
    <form className="searchbar__form">
      <input
        type="text"
        placeholder="Search For Tv Show"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button className="btn btn-block" onClick={onSearchHandler}>
        SEARCH
      </button>
    </form>
  );
}
