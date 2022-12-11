import { useState } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import Moment from "react-moment";

import "./Article.scss";

import Tooltip from '@mui/material/Tooltip';
import CategoryTag from "./CategoryTag";
import CommentList from "./CommentList";
import useVisualMode from "../../hooks/useVisualMode";
import {
  getWatchlistByUser,
  getLikeByUserandPost,
} from "../../helpers/selectors";

export default function Article(props) {
  // This checks if props.spoiler is true, and if it is, apply the "spoiler" class to blur spoiler posts
  const ifSpoilerClass = classNames("screen", { spoiler: props.spoiler });
  const post_id = props.id;
  const user_id = localStorage.getItem("teeboUser");

  const [error, setError] = useState(null);
  const [likecounter, setLikecounter] = useState(props.total_likes);
  const [likedOrNot, setLikedOrNot] = useState(getLikeByUserandPost(props.state, post_id, user_id));
  const [commentCounter, setCommentCounter] = useState(props.total_comments);

  const SHOW = "SHOW";
  const HIDE = "HIDE";

  const handleLikeButton = () => {
    const likedbyUser = getLikeByUserandPost(props.state, post_id, user_id);

    if (likedbyUser) {
      setLikedOrNot(false); 
      return props
        .deleteLike(post_id, user_id)
        .then((res) => setLikecounter(res.data.total_likes));
    } else {
      setLikedOrNot(true); 
      return props
        .addLike(post_id, user_id)
        .then((res) => setLikecounter(res.data.total_likes));
    }
  };

  const { mode, transition, back } = useVisualMode(HIDE);

  function toggleComments() {
    if (mode === SHOW) {
      back();
    } else {
      transition(SHOW);
    }
  }

  function validate(text) {
    if (text === "") {
      setError("can't let him hear it with no words, bestie");
    } else {
      setError(null);
      props
        .saveComment(text, post_id, props.loggedInUser.id)
        .then((res) => setCommentCounter(res));
    }
  }

  const watchlistShows = getWatchlistByUser(props.state, props.loggedInUser.id);
  const currentWatchlistShow = watchlistShows.find(
    (watchlistShows) => watchlistShows.id === props.show.id
  );

  const handleWatchlistAction = () => {
    if (currentWatchlistShow) {
      return props.deleteFromWatchlist(props.show.id, props.loggedInUser.id);
    } else {
      return props.addToWatchList(props.show.id, props.loggedInUser.id);
    }
  };

  const likeButtonClass = classNames("fa-solid fa-star", {
    liked: likedOrNot,
  });
  const watchlistButtonClass = classNames("fa-solid fa-circle-plus", {
    watchlisted: currentWatchlistShow,
  });

  return (
    <article>
      <div className="screen-and-buttons">
        <div className={ifSpoilerClass}>
          <p>{props.text}</p>
          <img className="article-image" src={props.image} alt=""></img>
        </div>
        <div className="article-buttons">
          <Link to={`/profile/${props.user.id}`}>
            <img
              className="profile-icon"
              src={props.user.icon_url}
              alt={props.user.user_name}
            ></img>
          </Link>
          <div className="actions">
            {!document.cookie && 
              <Tooltip title="log in to give props :)">
                <i className={likeButtonClass}></i>
              </Tooltip>
            }
            {document.cookie && <i className={likeButtonClass} onClick={handleLikeButton}></i>}
            <p>{likecounter}</p>
            <i
              className="fa-solid fa-comment-dots"
              onClick={toggleComments}
            ></i>
            <p>{commentCounter}</p>

            {document.cookie && <i
              className={watchlistButtonClass}
              onClick={handleWatchlistAction}
            ></i>}
          </div>
        </div>
      </div>
      <div className="category-timestamp">
        <CategoryTag
          name={props.show.name}
          onClick={() => props.getFilteredShows(props.show.id)}
        />
        <div class="timestamp"><Moment fromNow>{props.timestamp}</Moment> by <Link to={`/profile/${props.user.id}`}>@{props.user.username}</Link></div>
      </div>

      {mode === SHOW && (
        <CommentList
          state={props.state}
          error={error}
          postId={props.id}
          validate={validate}
        />
      )}
    </article>
  );
}
