import React, { useContext, useState } from "react";
import { Header, CloseButton } from "../Modal";
import { IoCloseSharp } from "react-icons/io5";
import { ModalContext } from "../../context/ModalContext";
import { PlaygroundContext } from "../../context/PlaygroundContext";

import { toast } from 'react-toastify';

import Select from "react-select";
import styled from "styled-components";

const InputWithSelect = styled.div`
  display: grid;
  grid-template-columns: 1fr 0.5fr;
  gap: 1rem;
  margin-top: 1.2rem;
  align-items: center;

  input {
    flex-grow: 1;
    height: 2rem;
  }

  button {
    background: #241f21;
    height: 2.5rem;
    color: white;
    padding: 0.3rem 2rem;
  }

  & > div {
    width: 8rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const NewPlaygroundAndFolder = () => {
  const { closeModal } = useContext(ModalContext);
  const { addPlaygroundAndFolder } = useContext(PlaygroundContext);

  const languageOptions = [
    { value: "cpp", label: "cpp" },
    { value: "javascript", label: "javascript" },
    { value: "java", label: "java" },
    { value: "python", label: "python" },
    { value: "php", label: "php" },
    { value: "rust", label: "rust" },
  ];

  const [playgroundName, setPlaygroundName] = useState("");
  const [folderName, setFolderName] = useState("");
  const [language, setLanguage] = useState(languageOptions[0]);

  const handleLanguageChange = (selectedOption) => {
    setLanguage(selectedOption);
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
        color: "#fff"
      },
      progressBar : false
    });
  };

  return (
    <>
      <Header>
        <h2>Create New Playground & Create New Folder</h2>
        <CloseButton onClick={() => closeModal()}>
          <IoCloseSharp />
        </CloseButton>
      </Header>
      <InputWithSelect>
        <label>Enter Folder Name</label>
        <input type="text" onChange={(e) => setFolderName(e.target.value)} />

        <label>Enter Card Name</label>
        <input
          type="text"
          onChange={(e) => setPlaygroundName(e.target.value)}
        />

        <Select
          options={languageOptions}
          value={language}
          onChange={handleLanguageChange}
        />

        <button
          onClick={() => {
            addPlaygroundAndFolder(folderName, playgroundName, language.label);
            closeModal();
            notifySuccess("Folder & File created successfully");
          }}
        >
          {" "}
          Create Playground{" "}
        </button>
      </InputWithSelect>
    </>
  );
};

export default NewPlaygroundAndFolder;
