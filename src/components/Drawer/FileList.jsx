import React, { useState } from "react";
import styled from "styled-components";
import pdfIcon from "../../assets/pdf.png";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import {
  MdOutlineDriveFileRenameOutline,
  MdOutlineDeleteForever,
} from "react-icons/md";

const FileItem = styled.div`
  width: 150px;
  height: 220px;
  margin: 20px 2px 2px 20px;
  background-color: #f4f4f4;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    background-color: #edede9;
  }

  img {
    width: 95%;
    height: 60%;
  }

  hr {
    width: 100%;
    margin: 10px 0;
    border: none;
    border-top: 1px solid #ccc;
  }

  p {
    margin-bottom: 8px;
    font-size: 0.9rem;
    font-weight: 500;
    color: #333;
    text-align: center;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const ScreenshotContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: start;
`;

const ScreenshotImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
`;

const UploadContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  margin-bottom: 20px;
`;

const FileInput = styled.input`
  padding: 8px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  outline: none;
  transition: border 0.3s ease-in-out;

  &:focus {
    border-color: #3f51b5;
  }

  ::file-selector-button {
    background-color: #3f51b5;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    padding: 6px 12px;
    margin-left: 5px;
    transition: background-color 0.2s ease-in-out;
  }

  ::file-selector-button:hover {
    background-color: #303f9f;
  }
`;

const StyledButton = styled(Button)`
  && {
    padding: 8px 16px;
    background-color: #3f51b5;
    color: white;
    font-size: 1rem;
    font-weight: 500;
    border-radius: 5px;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
    transition: background-color 0.2s ease-in-out, transform 0.2s ease-in-out;

    &:hover {
      background-color: #303f9f;
      transform: scale(1.05);
    }

    &:active {
      transform: scale(1);
    }
  }
`;

const ActionContainer = styled.div`
  display: flex;
  align-items: center;
`;

const IconWrapper = styled.div`
  cursor: pointer;
  padding: 5px;
  border-radius: 5px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #e0e0e0;
  }

  &:nth-child(2) {
    margin-left: 10px;
  }
`;

const RenameIcon = styled(MdOutlineDriveFileRenameOutline)`
  font-size: 24px;
  color: #3f51b5;
`;

const DeleteIcon = styled(MdOutlineDeleteForever)`
  font-size: 24px;
  color: #f44336;
`;

const FileList = ({
  state,
  handleFileChange,
  handleUploadFile,
  handleFileClick,
  trimFileName,
  handleRenameFile,
  handleDeleteFile,
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [renameFileIndex, setRenameFileIndex] = useState(null);
  const [newFileName, setNewFileName] = useState("");

  const handleRenameDialogOpen = (index) => {
    setRenameFileIndex(index);
    setNewFileName(trimFileName(state.fileNames[index])); 
    setOpenDialog(true);
  };

  const handleRenameDialogClose = () => {
    setOpenDialog(false);
    setRenameFileIndex(null);
    setNewFileName("");
  };

  const handleRenameDialogSubmit = () => {
    if (newFileName.trim()) {
      handleRenameFile(newFileName, renameFileIndex); 
      setOpenDialog(false);
      setRenameFileIndex(null);
      setNewFileName("");
    }
  };

  return (
    <div
      style={{
        width: "100%",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "20px 20px 0 20px",
        }}
      >
        <h1 style={{ textAlign: "left" }}>Resources :</h1>
        <UploadContainer style={{ display: "flex", alignItems: "center" }}>
          <FileInput
            type="file"
            accept="image/*,.pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            style={{ marginRight: "10px" }}
          />
          <StyledButton
            variant="contained"
            color="primary"
            onClick={handleUploadFile}
          >
            Upload File
          </StyledButton>
        </UploadContainer>
      </div>

      <ScreenshotContainer>
        {state.files.length > 0 ? (
          state.files.map((file, index) => (
            <FileItem
              key={index}
              onClick={() => handleFileClick(file, state.fileNames[index])}
            >
              {file.startsWith("data:image") ? (
                <ScreenshotImage src={file} alt={`Screenshot ${index + 1}`} />
              ) : file.startsWith("data:application/pdf") ? (
                <img src={pdfIcon} alt={`PDF Icon ${index + 1}`} />
              ) : null}
              <hr />
              <p>{trimFileName(state.fileNames[index])}</p>

              <ActionContainer>
                <IconWrapper
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRenameDialogOpen(index);
                  }}
                >
                  <RenameIcon />
                </IconWrapper>
                <IconWrapper
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteFile(index); 
                  }}
                >
                  <DeleteIcon />
                </IconWrapper>
              </ActionContainer>
            </FileItem>
          ))
        ) : (
          <p>No files uploaded yet.</p>
        )}
      </ScreenshotContainer>

      <Dialog open={openDialog} onClose={handleRenameDialogClose}>
        <DialogTitle>Rename File</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="New File Name"
            variant="outlined"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRenameDialogClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleRenameDialogSubmit}
            color="primary"
            variant="contained"
          >
            Rename
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default FileList;
