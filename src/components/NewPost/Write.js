import { useState, useContext } from "react";
import { storage } from "../../firebase/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import "./Write.scss";
import GifBoxIcon from "@mui/icons-material/GifBox";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Button from "../Button";

import ReactGiphySearchbox from "react-giphy-searchbox";

import { ApplicationContext } from "../../Views/App";

export default function Write(props) {
  const [text, setText] = useState("");
  const [show, setShow] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [previewSelectedImage, setPreviewSelectedImage] = useState(null);
  const [spoiler, setSpoiler] = useState(false);
  const [gifs, setGifs] = useState(false);
  const [mediaType, setMediaType] = useState(null);

  const MEDIA_TYPE_GIF = "gif";
  const MEDIA_TYPE_IMAGE = "image";

  const { state } = useContext(ApplicationContext);

  function cancel() {
    props.onCancel();
  }

  const handleChange = (e, showId) => {
    setShow(showId);
  };

  const handleSpoilerToggle = () => {
    if (spoiler) {
      setSpoiler(false);
    } else {
      setSpoiler(true);
    }
  };

  const showsArr = state.shows;
  const shows = showsArr.map((show) => {
    return {
      label: show.name,
      id: show.id,
    };
  });

  const uploadImage = () => {
    const imageRef = ref(storage, `images/${selectedImage.name}`);
    uploadBytes(imageRef, selectedImage).then((snapshot) => {
      getDownloadURL(snapshot.ref)
        .then((url) => {
          setSelectedImage(url);
          console.log("upload success", url);
          return url;
        })
        .then((url) => {
          console.log("url after save: ", url);
          props.onSave(text, url, spoiler, show);
        });
    });
  };

  const selectedGif = (item) => {
    if (item) {
      console.log("gif selected:", item.images.original.url);
      setSelectedImage(item.images.original.url);
      setMediaType(MEDIA_TYPE_GIF);
    }
  };

  const handleSubmitPost = () => {
    if (selectedImage && mediaType === MEDIA_TYPE_IMAGE) {
      uploadImage();
    } else {
      props.onSave(text, selectedImage, spoiler, show);
    }
  };

  console.log(props.onSave);

  return (
    <div className="write-post">
      {props.error !== null && <p className="error">{props.error}</p>}
      <form onSubmit={(event) => event.preventDefault()} autoComplete="off">
        <textarea
          name="create-post"
          type="text"
          placeholder="what do the people need to hear..."
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
        {previewSelectedImage && (
          <img
            className="profile-display-picture"
            src={previewSelectedImage}
            alt="profile"
          ></img>
        )}
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={shows}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          renderInput={(params) => (
            <TextField {...params} label="what show was that?" />
          )}
          onChange={(e, show) => handleChange(e, show.id)}
        />
      </form>
      {gifs && (
        <ReactGiphySearchbox
          apiKey={"6TLFFlfm48okMpvqfUU3vDQfoVan5W2t"}
          onSelect={selectedGif}
          masonryConfig={[
            { columns: 3, imageWidth: 180, gutter: 10 },
            { mq: "100%", columns: 2, imageWidth: 100, gutter: 10 },
          ]}
        />
      )}
      <div className="right-buttons">
        <Button
          cancel
          className="button--cancel"
          message="cancel"
          onClick={cancel}
        />
        <FormControlLabel
          className="pill-container spoiler-checkbox"
          control={<Checkbox color="default" />}
          label="spoiler"
          onChange={handleSpoilerToggle}
        />
        <label
          className="button--image pill-container"
          id="upload-image"
          for="file-upload"
        >
          <i className="fa-solid fa-image"></i>
        </label>
        <input
          id="file-upload"
          type="file"
          name="myImage"
          autoFocus={true}
          onChange={(event) => {
            if (event.target.files.length !== 0) {
              setSelectedImage(event.target.files[0]);
              setMediaType(MEDIA_TYPE_IMAGE);
              setPreviewSelectedImage(
                URL.createObjectURL(event.target.files[0])
              );
            }
          }}
        />
        <Button
          gif
          message={<GifBoxIcon />}
          onClick={() => {
            setGifs(true);
          }}
        ></Button>
        <Button
          confirm
          className="button--confirm"
          message="greenlight"
          onClick={() => handleSubmitPost()}
        />
      </div>
    </div>
  );
}
