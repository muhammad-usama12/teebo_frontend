import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BeatLoader from "react-spinners/BeatLoader";
import classNames from "classnames";

import "./Profile.scss";
import "../components/Watchlist.scss";
import "../components/Button.scss";

import Header from "../components/Header";
import Spacing from "../components/Spacing";
import CategoryList from "../components/CategoryList";
import Watchlist from "../components/Watchlist";
import Article from "../components/Article";
import Button from "../components/Button";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";

import useApplicationData from "../hooks/useApplicationData";
import useVisualMode from "../hooks/useVisualMode";
import {
  getPostsByUser,
  getShowForPost,
  getFavouritesByUser,
} from "../helpers/selectors";
import DeleteDialog from "../components/Article/DeleteDialog";

export default function Profile() {
  const WATCHLIST = "WATCHLIST";
  const POSTS = "POSTS";

  const { mode, transition, back } = useVisualMode(POSTS);

  const [loading, setLoading] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState({});
  const [togglePosts, setTogglePosts] = useState(true);
  const [toggleWatchlist, setToggleWatchlist] = useState(false);
  const [deleteBox, setDeleteBox] = useState(false);
  const [currentAricle, setCurrentArticle] = useState({});

  const clickPostsClass = classNames("toggle", {
    "toggleTrue": togglePosts,
  });

  const clickWatchlistClass = classNames("toggle", {
    "toggleTrue": toggleWatchlist,
  });

  const navigate = useNavigate();

  const applicationData = useApplicationData();
  const {
    state,
    hideSpoiler,
    handleSpoilerToggle,
    getFilteredShows,
    getAllShows,
    deletePost,
    addToWatchList,
    deleteFromWatchlist,
    logout,
    saveComment,
    addLike,
    deleteLike,
    loadApplicationState,
  } = applicationData;

  useEffect(() => {
    setLoading(true);
    loadApplicationState();

    setTimeout(() => {
      setLoading(false);
    }, 1000);

    const userId = localStorage.getItem("teeboUser");

    if (!userId) {
      return navigate("/login");
    } else {
      axios.get(`http://localhost:3001/api/users/${userId}`).then((res) => {
        console.log("userid response", userId, res);
        setLoggedInUser(res.data);
      });
    }
  }, [state.posts.length]);

  const favouriteShows = getFavouritesByUser(state, loggedInUser.id);

  const posts = getPostsByUser(state, loggedInUser.id);
  const articleList = posts.map((post) => {
    const show = getShowForPost(state, post.tvshow_id);

    // user = user for the specific post
    // loggedInUser = the user who is logged in
    // they are the same here because this is for the loggedInUser's profile *** DONT REMOVE ***
    return (
      <div className="profile-article">
        <Article
          key={post.id}
          timestamp={post.created_at}
          {...post}
          addLike={addLike}
          deleteLike={deleteLike}
          state={state}
          show={show}
          user={loggedInUser}
          loggedInUser={loggedInUser}
          spoiler={hideSpoiler && post.spoiler}
          getFilteredShows={getFilteredShows}
          addToWatchList={addToWatchList}
          deleteFromWatchlist={deleteFromWatchlist}
          saveComment={saveComment}
        />
        <Button
          trash
          message={<i className="fa-solid fa-trash-can"></i>}
          onClick={() => {
            setDeleteBox(true);
            setCurrentArticle(post);
          }}
        ></Button>
        {deleteBox && post.id === currentAricle.id && (
          <DeleteDialog close={setDeleteBox} open={() => deletePost(post.id)} />
        )}
      </div>
    );
  });

  return (
    <>
      <Header logout={logout} />
      <Spacing />
      {loading ? (
        <BeatLoader
          className="loader"
          color={"#D9D9D9"}
          loading={loading}
          size={30}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      ) : (
        <>
          <section className="profile-header">
            <img
              className="profile-display-picture"
              src={loggedInUser.icon_url}
              alt="profile"
            ></img>
            <div className="handle-and-bio">
              <div className="handle">
                <h1>@{loggedInUser.username}</h1>
              </div>
              <div className="bio">
                <p>{loggedInUser.bio}</p>
              </div>
            </div>
            <Link to="/profile/edit">
              <button className="pill-container edit-profile-button">
                edit profile
              </button>
            </Link>
          </section>
          <section className="posts-watchlist">
            <div className="toggleWatchlist">
              <div
                className={clickPostsClass}
                onClick={() => {
                  setTogglePosts(true);
                  setToggleWatchlist(false);
                  back();
                }}
              >
                <Link to="#">posts</Link>
              </div>
              <div
                className={clickWatchlistClass}
                onClick={() => {
                  setToggleWatchlist(true);
                  setTogglePosts(false);
                  transition(WATCHLIST);
                }}
              >
                <Link to="#">watchlist</Link>
              </div>
            </div>
          </section>
          {mode === WATCHLIST && (
            <Watchlist
              state={state}
              profileUser={loggedInUser}
              loggedInUser={loggedInUser}
              deleteFromWatchlist={deleteFromWatchlist}
            />
          )}
          {mode === POSTS && (
            <section className="category-filters">
              <CategoryList
                state={state}
                user={loggedInUser}
                shows={favouriteShows}
                hideSpoilers={handleSpoilerToggle}
                getFilteredShows={getFilteredShows}
                getAllShows={getAllShows}
              />
            </section>
          )}
          {/* <CategoryListItem
            spoiler
            user={user}
            state={state}
            name="hide spoilers"
            onClick={handleSpoilerToggle}
          /> */}
          {mode === POSTS && (
            <section className="article-container profile-article-container">
              {articleList}
            </section>
          )}
        </>
      )}
      <ScrollToTop />
      <Footer />
    </>
  );
}
