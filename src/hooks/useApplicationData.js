import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function useApplicationData() {
  const [error, setError] = useState(null);
  const [hideSpoiler, setHideSpoiler] = useState(false);

  const [state, setState] = useState({
    posts: [],
    filerteredPosts: [],
    shows: [],
    favourites: [],
    comments: [],
    users: [],
    watchlist: [],
    likes: [],
    loggedIn: false,
  });

  const loadApplicationState = () => {
    Promise.all([
      axios.get("/api/posts"),
      axios.get("/api/shows"),
      axios.get("/api/favourites"),
      axios.get("/api/comments"),
      axios.get("/api/users"),
      axios.get("/api/watchlist"),
      axios.get("/api/like"),
    ]).then((res) => {
      setState((prev) => ({
        ...prev,
        posts: res[0].data,
        filerteredPosts: res[0].data,
        shows: res[1].data,
        favourites: res[2].data,
        comments: res[3].data,
        users: res[4].data,
        watchlist: res[5].data,
        likes: res[6].data,
      }));
    });
  };

  const navigate = useNavigate();

  const getAllShows = () => {
    setState((prev) => ({ ...prev, filerteredPosts: state.posts }));
  };

  const getFilteredShows = (id) => {
    console.log("state.posts.length before", state.posts.length);
    let processedPosts = state.posts.filter((post) => post.tvshow_id === id);
    setState((prev) => ({ ...prev, filerteredPosts: processedPosts }));
    console.log("state.posts.length after", state.posts.length);
  };

  const commentCounter = (postId) => {
    return axios
      .post(`/api/comments/${postId}/counter`)
      .then((res) => res)
      .catch((err) => console.error(err));
  };

  const saveComment = async (text, postId, userId) => {
    try {
      const response = await axios.post("/api/comments/new", {
        text: text,
        postId: postId,
        userId: userId,
      });
      const comments = [...state.comments];
      comments.push(response.data);
      setState({ ...state, comments });
      const afterreturn = await commentCounter(response.data.post_id);
      return afterreturn.data.total_comments;
    } catch (error) {
      console.error("error from save", error);
    }
  };

  function addPost(postId, data) {
    return axios
      .post(`/api/posts/${postId}/new`, {
        data: data,
      })
      .then((res) => {
        const posts = [...state.posts];
        posts.push(res.data);
        setState({ ...state, posts });
      });
  }

  const deletePost = (postId) => {
    return axios
      .delete(`/api/posts/${postId}`)
      .then((res) => {
        const posts = [...state.posts];
        for (let i = 0; i < posts.length; i++) {
          if (posts[i].id === res.data.id) {
            posts.splice(i, 1);
          }
        }
        setState((prev) => ({ ...prev, posts }));
      })
      .catch((err) => console.log("delete failed", err.message));
  };

  const addToWatchList = (tvShowId, userId) => {
    axios
      .post(`/api/watchlist/new`, {
        user_id: userId,
        tvshow_id: tvShowId,
      })
      .then((res) => {
        const watchlist = [...state.watchlist];
        watchlist.push(res.data);
        setState({ ...state, watchlist });
        console.log("update watchlist success");
      })
      .catch((err) => console.log("update watchlist failed", err.message));
  };

  const deleteFromWatchlist = (tvShowId, userId) => {
    axios
      .post(`/api/watchlist/`, {
        user_id: userId,
        tvshow_id: tvShowId,
      })
      .then((res) => {
        const watchlist = [...state.watchlist];
        for (let i = 0; i < watchlist.length; i++) {
          if (watchlist[i].id === res.data.id) {
            watchlist.splice(i, 1);
          }
        }
        setState((prev) => ({ ...prev, watchlist }));
        console.log("delete from watchlist success");
      })
      .catch((err) =>
        console.log("deleted from watchlist failed", err.message)
      );
  };

  const newShow = async (query) => {
    const { data } = await axios.get(
      `https://api.tvmaze.com/search/shows?q=${query}`
    );
    const response = await axios.post(`/api/shows/new`, {
      name: data[0].show.name,
      image_url: data[0].show.image.medium,
    });

    setState((prev) => ({ ...prev, shows: [...prev.shows, response.data] }));
    console.log("data from tv maze:", data[0].show.name, data[0].show.id);
  };

  const updateFavourites = (tvShowId, userId) => {
    axios
      .post(`/api/favourites/new`, {
        user_id: userId,
        tvshow_id: tvShowId,
      })
      .then((res) => {
        const favourites = [...state.favourites];
        favourites.push(res.data);
        setState({ ...state, favourites });
        console.log("update success");
      })
      .catch((err) => console.log("update favourites failed", err.message));
  };

  const deleteFavourites = (tvShowId, userId) => {
    axios
      .post(`/api/favourites/`, {
        user_id: userId,
        tvshow_id: tvShowId,
      })
      .then((res) => {
        const favourites = [...state.favourites];
        for (let i = 0; i < favourites.length; i++) {
          if (favourites[i].id === res.data.id) {
            favourites.splice(i, 1);
          }
        }
        setState((prev) => ({ ...prev, favourites }));
        console.log("delete success");
      })
      .catch((err) => console.log("deleted favourites failed", err.message));
  };

  const logout = () => {
    axios
      .post(`/api/auth/logout`)
      .then(() => {
        console.log("successful log out");
        setState((prev) => ({ ...prev, loggedIn: false }));
        localStorage.clear();
        navigate("/login");
      })
      .catch((err) => console.log("logout failed", err.message));
  };

  const handleSpoilerToggle = () => {
    if (hideSpoiler) {
      setHideSpoiler(false);
    } else {
      setHideSpoiler(true);
    }
  };

  const addLike = (post_id, user_id) => {
    return axios
      .put(`/api/like/${post_id}/add`, {
        user_id: user_id,
      })
      .then((res) => {
        const likes = [...state.likes];
        likes.push(res.data);
        setState({ ...state, likes });
        return addLikeCounter(post_id, user_id);
      })
      .catch((err) => console.error(err));
  };

  const addLikeCounter = (post_id, user_id) => {
    return axios
      .put(`/api/like/${post_id}/addCounter`)
      .catch((err) => console.error(err));
  };

  const deleteLike = (post_id, user_id) => {
    return axios
      .put(`/api/like/${post_id}/delete`, {
        user_id: user_id,
      })
      .then((res) => {
        const likes = [...state.likes];
        console.log("before set delete", res);
        for (let i = 0; i < likes.length; i++) {
          if (likes[i].id === res.data.id) {
            likes.splice(i, 1);
          }
        }
        setState((prev) => ({ ...prev, likes }));
        console.log("after set delete", likes);
        return deleteLikeCounter(post_id, user_id);
      })
      .catch((err) => console.error(err));
  };
  const deleteLikeCounter = (post_id, user_id) => {
    return axios
      .put(`/api/like/${post_id}/deleteCounter`)
      .catch((err) => console.error(err));
  };

  return {
    state,
    setState,
    addLike,
    deleteLike,
    hideSpoiler,
    setHideSpoiler,
    handleSpoilerToggle,

    error,
    setError,

    getFilteredShows,
    getAllShows,

    addPost,
    deletePost,
    saveComment,

    newShow,
    updateFavourites,
    deleteFavourites,

    addToWatchList,
    deleteFromWatchlist,

    logout,

    loadApplicationState,
  };
}
