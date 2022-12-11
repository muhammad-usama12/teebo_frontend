import React, { useEffect, useState } from "react";
import { storage } from "../firebase/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import BeatLoader from "react-spinners/BeatLoader";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Spacing from "../components/Spacing";
import Button from "../components/Button";
import CategoryListItem from "../components/CategoryListItem";

import useApplicationData from "../hooks/useApplicationData";
import { getFavouritesByUser } from "../helpers/selectors";

export default function EditProfile() {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const [user, setUser] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewSelectedImage, setPreviewSelectedImage] = useState(null);
  const [newFavouriteShowId, setNewFavouriteShowId] = useState(null);
  const [search, setSearch] = useState("");

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const navigate = useNavigate();

  const applicationData = useApplicationData();
  const {
    state,
    getFilteredShows,
    loadApplicationState,
    updateFavourites,
    deleteFavourites,
    logout,
    newShow,
  } = applicationData;

  useEffect(() => {
    loadApplicationState();
    
    const userId = localStorage.getItem("teeboUser");
    if (!userId) {
      navigate("/login");
    }
    axios.get(`http://localhost:3001/api/users/${userId}`)
      .then((res) => {
        setUser(res.data);
      });
  }, [state.favourites.length]);

  function onChange(e) {
    setUser({ ...user, [e.target.id]: e.target.value });
  }

  const submitText = (e) => {
    setError(null);
    setMessage(null);

    const payload = { bio: user.bio, username: user.username };
    axios.put(`http://localhost:3001/api/users/${user.id}`, payload)
      .then(() => {
        setMessage("profile saved!");
        setOpen(true);
        return setLoading(false);
      })
      .catch((err) => {
        if (err.response.status === 500) {
          setLoading(false);
          setError("that username is taken luv, xx");
          return setOpen(true);
        }
      });
  };

  const submitForm = (e) => {
    setError(null);
    setMessage(null);
    setLoading(true);

    if (!user.username) {
      setLoading(false);
      setError("you gotta be called SOMETHING");
      return setOpen(true);
    }

    if (selectedImage !== null) {
      const imageRef = ref(storage, `images/${selectedImage.name}`);
      uploadBytes(imageRef, selectedImage)
        .then((snapshot) => {
          getDownloadURL(snapshot.ref)
            .then((url) => {
              setSelectedImage(url);
              console.log("upload success", url);
              return url;
            })
            .then((url) => {
              console.log("url after upload", url);
              const payload = { icon_url: url };
              console.log("profile update success payload", payload);
              axios.put(`http://localhost:3001/api/users/${user.id}`, payload);
            })
            .then(() => {
              submitText();
            })
            .catch((err) => console.log("submit failed: ", err.message));
        });
    } else {
      submitText();
    }
  }

  const onAddFavouritesHandler = (e) => {
    setMessage(null);
    setError(null);
    e.preventDefault();

    if (!newFavouriteShowId || !user.id) {
      setError("can't add nothing luv xx");
      return setOpen(true);
    } else {
      setMessage("new favourite added!");
      setOpen(true);
      return updateFavourites(newFavouriteShowId, user.id);
    }
  };

  const showsArr = state.shows;
  const shows = showsArr.map((show) => {
    return {
      label: show.name,
      id: show.id,
    };
  });

  const favouriteShowsArr = getFavouritesByUser(state, user.id);

  const favouriteShows = favouriteShowsArr.map((category) => {
    return (
      <CategoryListItem
        edit
        state={state}
        user={user}
        deleteFavourites={deleteFavourites}
        key={category.id}
        tvShowId={category.id}
        name={category.name}
        onClick={() => getFilteredShows(category.id)}
      />
    );
  });

  const onSearchHandler = (e) => {
    setMessage(null);
    setError(null);
    e.preventDefault();

    if (search === "") {
      setOpen(true);
      return setError("um... enter a show to find a show");
    } else {
      newShow(search)
        .then(() => {
          setMessage("new show added!");
          setOpen(true);
        })
        .catch(() => {
          setError("we already have that show babe");
          setOpen(true);
        });
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <>
      <Header logout={logout} />
      <Spacing />
      {/* <form className="searchbar__form">
        <input
          type="text"
          placeholder="Search For Tv Show"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn btn-block" onClick={onSearchHandler}>
          SEARCH
        </button>
      </form> */}
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
          <section className="edit-profile">
            <h1>so who are you</h1>
            <div className="profile-header">
              <label className="upload-image">
                <input
                  type="file"
                  name="myImage"
                  id="icon_url"
                  onChange={(e) => {
                    if (e.target.files.length !== 0) {
                      setPreviewSelectedImage(
                        URL.createObjectURL(e.target.files[0])
                      );
                      setSelectedImage(e.target.files[0]);
                    }
                  }}
                />
                <img
                  className="profile-display-picture"
                  src={
                    previewSelectedImage ? previewSelectedImage : user.icon_url
                  }
                  alt="profile"
                ></img>
                <p id="change-photo">change photo</p>
                <i className="fa-solid fa-circle-user"></i>
              </label>

              <form>
                <div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="who are you king"
                    value={user.username}
                    onChange={onChange}
                    autoComplete="off"
                  />
                  <p>username</p>
                </div>
                <div>
                  <textarea
                    name="bio"
                    type="text"
                    id="bio"
                    placeholder="tell me about yourself"
                    value={user.bio ? user.bio : ""}
                    onChange={onChange}
                  />
                  <p>bio</p>
                </div>
              </form>
              <div className="edit-button-save">
                <Button confirm message="save" onClick={submitForm} />
              </div>
            </div>
            <div className="edit-profile-shows">
              <div className="add-show-favourites">
                <h1>what are your favourite shows, luv</h1>
                <form className="add-favourite-show">
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={shows}
                    isOptionEqualToValue={(option, value) =>
                      option.value === value.value
                    }
                    sx={{ width: 500 }}
                    renderInput={(params) => (
                      <TextField {...params} label="add favourite show?" />
                    )}
                    onChange={(e, show) => setNewFavouriteShowId(show.id)}
                  />
                  <Button
                    className="add-favourite"
                    confirm
                    type="submit"
                    message="add"
                    onClick={onAddFavouritesHandler}
                  />
                </form>
                <div className="edit-profile-categories">{favouriteShows}</div>
              </div>
            </div>
            <div className="add-show-database">
              <h1>don't see a show? help us populate our database!</h1>
              <form className="add-favourite-show">
                <TextField
                  id="outlined-basic"
                  onChange={(e) => setSearch(e.target.value)}
                  variant="outlined"
                  label="add new show?"
                  sx={{ width: 500 }}
                />
                <Button
                  className="add-newshow"
                  confirm
                  type="submit"
                  message="add"
                  onClick={onSearchHandler}
                />
              </form>
              {error && (
                <Snackbar
                  open={open}
                  autoHideDuration={6000}
                  onClose={handleClose}
                >
                  <Alert
                    onClose={handleClose}
                    severity="error"
                    sx={{ width: "100%" }}
                  >
                    {error}
                  </Alert>
                </Snackbar>
              )}
              {message && (
                <Snackbar
                  open={open}
                  autoHideDuration={6000}
                  onClose={handleClose}
                >
                  <Alert
                    onClose={handleClose}
                    severity="success"
                    sx={{ width: "100%" }}
                  >
                    {message}
                  </Alert>
                </Snackbar>
              )}
            </div>
          </section>
          <Footer />
        </>
      )}
    </>
  );
}
