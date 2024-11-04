import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { BiPlus, BiEditAlt, BiTrash, BiFullscreen, BiX } from "react-icons/bi";
import { Modal, Button, TextField } from "@mui/material";
import noVideo from "../../assets/not-found-video.png";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

export const Console = styled.div`
  display: flex;
  flex-direction: column;
  background: #fff;
  height: 350px;
  font-size: 1.25rem;
  font-weight: 700;
`;

export const Header = styled.div`
  display: flex;
  height: 3rem;
  align-items: center;
  justify-content: space-between;
  background: #ededed;
  padding: 1rem;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.16);
  z-index: 2;

  button {
    display: flex;
    color: black;
    background: transparent;
    &:hover {
      background: rgba(0, 0, 0, 0.05);
    }
  }
`;

export const VideoDisplay = styled.div`
  margin: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  iframe {
    width: 100%;
    max-width: 600px;
    height: 100%;
    border: 0;
  }
`;

export const ModalContent = styled.div`
  background: white;
  width: 35%;
  border-radius: 8px;
  position: relative;
  padding: 28px;

  h2 {
    font-size: 24px;
    font-weight: 500;
    margin: 0 0 24px 0;
    padding-right: 24px;
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 24px;
  }

  .MuiButton-contained {
    text-transform: none;
    font-weight: normal;
    padding: 6px 16px;
    background-color: #1a1a1a;

    &:hover {
      background-color: #333;
    }
  }

  .MuiTextField-root {
    .MuiOutlinedInput-root {
      background: white;
    }
  }
`;

export const CloseIcon = styled(BiX)`
  position: absolute;
  top: 1px;
  right: 10px;
  font-size: 28px;
  cursor: pointer;
  color: #666;

  &:hover {
    color: #000;
  }
`;

export const CenteredModal = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const VideoConsole = () => {
  const [videos, setVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const location = useLocation();
  const dynamicId = location.pathname.split("/playground/")[1];

  useEffect(() => {
    const savedVideos =
      JSON.parse(localStorage.getItem(`videos_${dynamicId}`)) || [];
    setVideos(savedVideos);
  }, [dynamicId]);

  const saveVideosToLocalStorage = (newVideos) => {
    localStorage.setItem(`videos_${dynamicId}`, JSON.stringify(newVideos));
  };

  const getEmbedUrl = (url) => {
    const youtubeRegex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^&\n]{11})/;
    const googleDriveRegex =
      /(?:https?:\/\/)?(?:drive\.google\.com\/file\/d\/|drive\.google\.com\/open\?id=)([^\/\n]+)/;

    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch && youtubeMatch[1]) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }

    const googleDriveMatch = url.match(googleDriveRegex);
    if (googleDriveMatch && googleDriveMatch[1]) {
      return `https://drive.google.com/file/d/${googleDriveMatch[1]}/preview`;
    }

    return url;
  };

  const notifySuccess = (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      progressStyle: {
        background: "green",
        color: "#fff",
      },
      progressBar: false,
    });
  };

  const handleAddVideo = () => {
    if (currentVideo) {
      const newVideos = [...videos, getEmbedUrl(currentVideo)];
      setVideos(newVideos);
      saveVideosToLocalStorage(newVideos);
      setCurrentVideo("");
      handleCloseModal();
      notifySuccess("Video added successfully");
    }
  };

  const handleUpdateVideo = () => {
    if (selectedIndex !== null && currentVideo) {
      const updatedVideos = [...videos];
      updatedVideos[selectedIndex] = getEmbedUrl(currentVideo);
      setVideos(updatedVideos);
      saveVideosToLocalStorage(updatedVideos);
      setCurrentVideo("");
      setSelectedIndex(null);
      handleCloseModal();
      notifySuccess("Video updated successfully");
    }
  };

  const handleDeleteVideo = (index) => {
    const updatedVideos = videos.filter((_, i) => i !== index);
    setVideos(updatedVideos);
    saveVideosToLocalStorage(updatedVideos);
  };

  const handleOpenModal = (type, video = "", index = null) => {
    setModalType(type);
    setCurrentVideo(video);
    setSelectedIndex(index);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentVideo("");
    setSelectedIndex(null);
  };

  const handleOpenFullscreen = () => {
    setFullscreenOpen(true);
  };

  const handleCloseFullscreen = () => {
    setFullscreenOpen(false);
  };

  return (
    <Console>
      <Header>
        <Button
          onClick={() => handleOpenModal("add")}
          startIcon={<BiPlus style={{ marginRight: "-5px" }} />}
        >
          Add Video
        </Button>
        {videos.length > 0 && (
          <>
            <Button
              onClick={() =>
                handleOpenModal(
                  "update",
                  videos[videos.length - 1],
                  videos.length - 1
                )
              }
              startIcon={<BiEditAlt style={{ marginRight: "-5px" }}/>}
            >
              Edit
            </Button>
            <Button
              onClick={() => {
                handleDeleteVideo(videos.length - 1);
                notifySuccess("Video deleted successfully");
              }}
              startIcon={<BiTrash style={{ marginRight: "-5px" }}/>}
            >
              Delete
            </Button>
            <Button onClick={handleOpenFullscreen} startIcon={<BiFullscreen style={{ marginRight: "-5px" }}/>}>
              Full Screen
            </Button>
          </>
        )}
      </Header>

      <VideoDisplay>
        {videos.length > 0 ? (
          <iframe
            src={videos[videos.length - 1]}
            title="Video Player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <img src={noVideo} alt="Placeholder" />
        )}
      </VideoDisplay>

      <CenteredModal open={modalOpen} onClose={handleCloseModal}>
        <ModalContent>
          <CloseIcon onClick={handleCloseModal} />
          <h2>
            {modalType === "add" ? "Add Video Link" : "Update Video Link"}
          </h2>
          <TextField
            label="Video URL"
            variant="outlined"
            value={currentVideo}
            onChange={(e) => setCurrentVideo(e.target.value)}
            fullWidth
          />
          <Button
            onClick={modalType === "add" ? handleAddVideo : handleUpdateVideo}
            variant="contained"
            style={{ marginTop: "10px" }}
          >
            {modalType === "add" ? "Add" : "Update"}
          </Button>
        </ModalContent>
      </CenteredModal>

      <CenteredModal open={fullscreenOpen} onClose={handleCloseFullscreen}>
        <ModalContent style={{ width: "80%", height: "80%" }}>
          <CloseIcon onClick={handleCloseFullscreen} />
          {videos.length > 0 ? (
            <iframe
              src={videos[videos.length - 1]}
              title="Fullscreen Video Player"
              style={{ width: "100%", height: "100%" }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <img src={noVideo} alt="Placeholder" />
          )}
        </ModalContent>
      </CenteredModal>
    </Console>
  );
};

export default VideoConsole;
