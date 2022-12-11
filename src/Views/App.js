import { useEffect, createContext, useState } from "react";
import axios from "axios";
import BeatLoader from "react-spinners/BeatLoader";

import "../index.scss";
import { Link } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";
import Article from "../components/Article";
import CategoryList from "../components/CategoryList";
import NewPost from "../components/NewPost";
import Spacing from "../components/Spacing";

import useApplicationData from "../hooks/useApplicationData";
import {
  getShowForPost,
  getUser,
  getFavouritesByUser,
} from "../helpers/selectors";
import ScrollToTop from "../components/ScrollToTop";

export const ApplicationContext = createContext();

function App() {
  const [loading, setLoading] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState({});
  const applicationData = useApplicationData();
  const {
    state,
    hideSpoiler,
    handleSpoilerToggle,
    getFilteredShows,
    getAllShows,
    deleteFavourites,
    updateFavourites,
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
      return;
    } else {
      axios.get(`http://localhost:3001/api/users/${userId}`).then((res) => {
        setLoggedInUser(res.data);
      });
    }
  }, [state.posts.length, state.favourites.length]);

  const favouriteShows = getFavouritesByUser(state, loggedInUser.id);

  console.log("user", loggedInUser);

  const articleList = state.filerteredPosts.map((post) => {
    const show = getShowForPost(state, post.tvshow_id);
    const postUser = getUser(state, post.user_id);

    // user = user for the specific post
    // loggedInUser = the user who is logged in
    return (
      <Article
        key={post.id}
        timestamp={post.created_at}
        {...post}
        addLike={addLike}
        deleteLike={deleteLike}
        state={state}
        show={show}
        user={postUser}
        loggedInUser={loggedInUser}
        spoiler={hideSpoiler && post.spoiler}
        getFilteredShows={getFilteredShows}
        addToWatchList={addToWatchList}
        deleteFromWatchlist={deleteFromWatchlist}
        saveComment={saveComment}
      />
    );
  });

  return (
    <ApplicationContext.Provider value={applicationData}>
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
        <main>
          <section className="category-filters">
            <CategoryList
              state={state}
              user={loggedInUser}
              deleteFavourites={deleteFavourites}
              updateFavourites={updateFavourites}
              shows={favouriteShows}
              hideSpoilers={handleSpoilerToggle}
              getFilteredShows={getFilteredShows}
              getAllShows={getAllShows}
            />
          </section>
          {favouriteShows.length === 0 && loggedInUser.id && (
            <h4>
              you have no favourite shows! :( <br />
              <Link to="/profile/edit">add your favourite shows</Link> to filter
              them :)
            </h4>
          )}

          {loggedInUser.id && <NewPost user={loggedInUser} state={state} />}
          <section className="article-container">{articleList}</section>
        </main>
      )}
      <ScrollToTop />
      <Footer />
    </ApplicationContext.Provider>
  );
}
export default App;
