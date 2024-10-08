import React, { useContext, useState } from "react";
import { Header, CloseButton, Input } from "../Modal";
import { IoCloseSharp } from "react-icons/io5";
import { ModalContext } from "../../context/ModalContext";
import { PlaygroundContext } from "../../context/PlaygroundContext";

import { toast } from 'react-toastify';


const EditFolder = () => {
  const { closeModal, isOpenModal } = useContext(ModalContext);
  const { editFolderTitle, folders } = useContext(PlaygroundContext);

  const folderId = isOpenModal.identifiers.folderId;
  const [folderTitle, setFolderTitle] = useState(folders[folderId].title);

  const notifyRename = (msg) => {
    toast.info(msg, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const handleRenameFolder = (folderId,folderTitle) => {
    editFolderTitle(folderId, folderTitle);
    closeModal();
    notifyRename("Rename folder successfully");
  }

  return (
    <>
      <Header>
        <h2>Edit Folder Title</h2>
        <CloseButton onClick={() => closeModal()}>
          <IoCloseSharp />
        </CloseButton>
      </Header>
      <Input>
        <input type="text" onChange={(e) => setFolderTitle(e.target.value)} />
        <button
          onClick={() => handleRenameFolder(folderId, folderTitle)}
        >
          Update Title
        </button>
      </Input>
    </>
  );
};

export default EditFolder;
