import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import logo from "../../assets/codex-logo.png";
import { ModalContext } from "../../context/ModalContext";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { defaultFiles, defaultFileNames } from "../../context/defaultData.js";
import FileList from "../../components/Drawer/FileList.jsx";
import FileDialog from "../../components/Drawer/FileDialog.jsx";

const StyledLeftComponent = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 40%;
  height: 100vh;
  background-color: #1e1e1e;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    position: relative;
    width: 100%;
  }
`;

const ContentContainer = styled.div`
  text-align: center;
`;

const Logo = styled.img`
  width: 80%;
  margin-bottom: 1rem;
`;

const MainHeading = styled.h1`
  font-size: 2.5rem;
  font-weight: 400;
  color: #fff;
  margin-bottom: 0.75rem;

  span {
    font-weight: 700;
  }
`;

const SubHeading = styled.div`
  font-size: 1.5rem;
  color: #fff;
  opacity: 0.7;
  margin-bottom: 1.5rem;
`;

const AddNewButton = styled.button`
  padding: 0.25rem 1.5rem;
  margin-left: auto;
  margin-right: auto;
  font-size: 1rem;
  border: none;
  border-radius: 30px;
  box-shadow: 0px 0px 4px 2px #8b8b8b;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: all 0.2s ease-in-out;

  span {
    font-size: 2rem;
    font-weight: 700;
  }

  &:hover {
    cursor: pointer;
    scale: 1.05;
    box-shadow: 0px 0px 6px 2px #8b8b8b;
  }
`;

const LeftComponent = () => {
  const { openModal } = useContext(ModalContext);

  const [state, setState] = useState({
    bottomDrawerOpen: false,
    files: [],
    fileNames: [],
    selectedFile: null,
    selectedImage: null,
    selectedImageName: "",
    selectedPdf: null,
    selectedPdfName: null,
    zoomLevel: 1,
    imageDialogOpen: false,
    pdfDialogOpen: false,
  });

  useEffect(() => {
    const storedFiles = JSON.parse(localStorage.getItem("files")) || [];
    const storedFileNames = JSON.parse(localStorage.getItem("fileNames")) || [];

    if (storedFiles.length === 0) {
      localStorage.setItem("files", JSON.stringify(defaultFiles));
      localStorage.setItem("fileNames", JSON.stringify(defaultFileNames));

      setState((prev) => ({
        ...prev,
        files: defaultFiles,
        fileNames: defaultFileNames,
      }));
    } else {
      setState((prev) => ({
        ...prev,
        files: storedFiles,
        fileNames: storedFileNames,
      }));
    }
  }, []);

  const toggleDrawer = (open) => {
    setState((prev) => ({ ...prev, bottomDrawerOpen: open }));
  };

  const handleFileChange = (event) => {
    setState((prev) => ({ ...prev, selectedFile: event.target.files[0] }));
  };

  const handleUploadFile = () => {
    const { selectedFile, files, fileNames } = state;

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newFileName = selectedFile.name;
        const newFileUrl =
          selectedFile.type.startsWith("image/") ||
          selectedFile.type === "application/pdf"
            ? reader.result
            : null;

        const updatedFiles = [...files, newFileUrl || newFileName];
        const updatedFileNames = [...fileNames, newFileName];

        localStorage.setItem("files", JSON.stringify(updatedFiles));
        localStorage.setItem("fileNames", JSON.stringify(updatedFileNames));

        setState((prev) => ({
          ...prev,
          files: updatedFiles,
          fileNames: updatedFileNames,
          selectedFile: null,
        }));
      };

      reader.readAsDataURL(selectedFile);
    }
  };

  const handleFileClick = (file, name) => {
    if (file.startsWith("data:image")) {
      setState((prev) => ({
        ...prev,
        selectedImage: file,
        selectedImageName: name,
        imageDialogOpen: true,
      }));
    } else if (file.startsWith("data:application/pdf")) {
      setState((prev) => ({
        ...prev,
        selectedPdf: file,
        selectedPdfName: name,
        pdfDialogOpen: true,
      }));
    } else {
      alert(`Opening ${name} is not supported for preview.`);
    }
  };

  const handleCloseImageDialog = () => {
    setState((prev) => ({
      ...prev,
      imageDialogOpen: false,
      selectedImage: null,
      selectedImageName: "",
      zoomLevel: 1,
    }));
  };

  const handleClosePdfDialog = () => {
    setState((prev) => ({
      ...prev,
      pdfDialogOpen: false,
      selectedPdfName: "",
      selectedPdf: null,
    }));
  };

  const handleZoomIn = () => {
    setState((prev) => ({
      ...prev,
      zoomLevel: prev.zoomLevel * 1.2,
    }));
  };

  const handleZoomOut = () => {
    setState((prev) => ({
      ...prev,
      zoomLevel: prev.zoomLevel / 1.2,
    }));
  };

  const stripExtension = (name) => {
    return name.replace(/\.[^/.]+$/, "");
  };

  const trimFileName = (name, maxLength = 20) => {
    const strippedName = stripExtension(name);
    if (strippedName.length > maxLength) {
      return `${strippedName.substring(0, maxLength)}...`;
    }
    return strippedName;
  };

  const handleRenameFile = (newFileName, index) => {
    if (newFileName && newFileName.trim() !== "") {
      const updatedFileNames = [...state.fileNames];
      updatedFileNames[index] = newFileName; 
  
      const updatedFiles = [...state.files];
      updatedFiles[index] = updatedFiles[index];
  
      localStorage.setItem("files", JSON.stringify(updatedFiles));
      localStorage.setItem("fileNames", JSON.stringify(updatedFileNames));
  
      setState((prev) => ({
        ...prev,
        fileNames: updatedFileNames,
        files: updatedFiles,
      }));
    }
  };
  

  const handleDeleteFile = (index) => {
    const updatedFiles = state.files.filter((_, i) => i !== index);
    const updatedFileNames = state.fileNames.filter((_, i) => i !== index);

    localStorage.setItem("files", JSON.stringify(updatedFiles));
    localStorage.setItem("fileNames", JSON.stringify(updatedFileNames));

    setState((prev) => ({
      ...prev,
      files: updatedFiles,
      fileNames: updatedFileNames,
    }));
  };


  return (
    <StyledLeftComponent>
      <ContentContainer>
        <Logo src={logo} alt="Logo" />
        <MainHeading>
          <span>Code</span> X
        </MainHeading>
        <SubHeading>Code. Compile. Debug.</SubHeading>
        <AddNewButton
          onClick={() =>
            openModal({
              show: true,
              modalType: 3,
              identifiers: {
                folderId: "",
                cardId: "",
              },
            })
          }
        >
          <span>+</span> Create New Playground
        </AddNewButton>
        <br />
        <AddNewButton onClick={() => toggleDrawer(true)}>
        <span>+</span> Upload New Resource
        </AddNewButton>
      </ContentContainer>

      <SwipeableDrawer
        anchor="bottom"
        open={state.bottomDrawerOpen}
        onClose={() => toggleDrawer(false)}
        onOpen={() => toggleDrawer(true)}
        sx={{
          ".MuiDrawer-paper": {
            height: "50%",
            overflowY: "auto",
            borderRadius: "40px 40px 0 0",
          },
        }}
      >
        <FileList
          state={state}
          handleFileChange={handleFileChange}
          handleUploadFile={handleUploadFile}
          handleFileClick={handleFileClick}
          trimFileName={trimFileName}
          handleRenameFile={handleRenameFile}
          handleDeleteFile={handleDeleteFile}
        />

        <FileDialog
          type="image"
          open={state.imageDialogOpen}
          file={state.selectedImage}
          fileName={state.selectedImageName}
          zoomLevel={state.zoomLevel}
          handleCloseDialog={handleCloseImageDialog}
          handleZoomIn={handleZoomIn}
          handleZoomOut={handleZoomOut}
        />

        <FileDialog
          type="pdf"
          open={state.pdfDialogOpen}
          file={state.selectedPdf}
          fileName={state.selectedPdfName}
          handleCloseDialog={handleClosePdfDialog}
        />
      </SwipeableDrawer>
    </StyledLeftComponent>
  );
};

export default LeftComponent;
