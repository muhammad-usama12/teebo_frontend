import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import BeatLoader from "react-spinners/BeatLoader";
import classNames from "classnames";
import { Link } from "react-router-dom";

import "./Profile.scss";
import "../components/Watchlist.scss";
import "../components/Button.scss";

import Header from "../components/Header";
import Spacing from "../components/Spacing";
import CategoryList from "../components/CategoryList";
import Watchlist from "../components/Watchlist";
import Article from "../components/Article";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";

import useApplicationData from "../hooks/useApplicationData";
import useVisualMode from "../hooks/useVisualMode";
import {
  getPostsByUser,
  getShowForPost,
  getFavouritesByUser,
} from "../helpers/selectors";

import { useParams } from "react-router-dom";

export default function ProfileVisit(props) {
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [loggedInUser, setloggedInUser] = useState({});
  const [profileUser, setProfileUser] = useState({ id });
  
  const navigate = useNavigate();

  // const stateParamVal = useLocation().state;
  console.log("Props Parameter Value:", id);
  // console.log("Props State Value:", stateParamVal);
  console.log("CURRENT USER:", profileUser.id);

  const WATCHLIST = "WATCHLIST";
  const POSTS = "POSTS";

  const { mode, transition, back } = useVisualMode(POSTS);
  const [togglePosts, setTogglePosts] = useState(true);
  const [toggleWatchlist, setToggleWatchlist] = useState(false);

  const clickPostsClass = classNames("toggle", {
    "toggleTrue": togglePosts,
  });

  const clickWatchlistClass = classNames("toggle", {
    "toggleTrue": toggleWatchlist,
  });

  const applicationData = useApplicationData();
  const {
    state,
    hideSpoiler,
    handleSpoilerToggle,
    getFilteredShows,
    getAllShows,
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
    setTimeout(() => {
      setLoading(false);
    }, 1000);

    loadApplicationState();

    const userId = localStorage.getItem("teeboUser");

    axios.get(`http://localhost:3001/api/users/${userId}`).then((res) => {
      console.log("userid response", userId, res);
      setloggedInUser(res.data);
    });


    axios.get(`http://localhost:3001/api/users/${profileUser.id}`).then((res) => {
      console.log("userid response", res.data.id);
      setProfileUser(res.data);
    });

    if (profileUser.id === userId) {
      navigate('/profile');
    }
  }, []);

  // const handleChange = async (query) => {
  //   await axios
  //     .get(`https://api.tvmaze.com/search/shows?q=${query}`)
  //     .then((res) => {
  //       console.log("data from profile:", res.data);
  //       setUser(res.data);
  //     });
  // };

  // axios.get(`http://localhost:3001/api/users/${user.id}`).then((res) => {
  //   console.log("userid response", res);
  //   setUser(res.data);
  // });

  const favouriteShows = getFavouritesByUser(state, profileUser.id);

  const posts = getPostsByUser(state, profileUser.id);
  const articleList = posts.map((post) => {
    const show = getShowForPost(state, post.tvshow_id);

    // user = user of the profile we're visiting
    // loggedInUser = the user who is logged in
    return (
      <div className="profile-article">
        <Article
          key={post.id}
          timestamp = {post.created_at}
          {...post}
          addLike = {addLike}
          deleteLike = {deleteLike}
          state={state}
          show={show}
          user={profileUser}
          loggedInUser={loggedInUser}
          spoiler={hideSpoiler && post.spoiler}
          getFilteredShows={getFilteredShows}
          addToWatchList={addToWatchList}
          deleteFromWatchlist={deleteFromWatchlist}
          saveComment={saveComment}
        />
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
              src={profileUser.icon_url}
              alt="profile"
            ></img>
            <div className="handle-and-bio">
              <div className="handle">
                <h1>@{profileUser.username}</h1>
              </div>
              <div className="bio">
                <p>{profileUser.bio}</p>
              </div>
            </div>
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
          {mode === WATCHLIST &&
            <Watchlist
              state={state}
              profileUser={profileUser}
              loggedInUser={loggedInUser}
            />}
          {mode === POSTS && (
            <section className="category-filters">
              <CategoryList
                state={state}
                user={profileUser}
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
