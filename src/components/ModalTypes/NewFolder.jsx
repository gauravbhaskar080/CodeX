import React, { useContext, useState } from 'react'
import { Header, CloseButton, Input } from '../Modal'
import { IoCloseSharp } from 'react-icons/io5'
import { ModalContext } from '../../context/ModalContext'
import { PlaygroundContext } from '../../context/PlaygroundContext'
import { toast } from 'react-toastify';

const NewFolder = () => {
  const { closeModal } = useContext(ModalContext);
  const { addFolder } = useContext(PlaygroundContext)
  const [folderTitle, setFolderTitle] = useState("");

  const notifySuccess = () => {
    toast.success("Folder created successfully", {
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
    addFolder(folderTitle)
    closeModal()
  };

  return (
    <>
      <Header>
        <h2>Create New Folder</h2>
        <CloseButton onClick={() => closeModal()}>
          <IoCloseSharp />
        </CloseButton>
      </Header>
      <Input>
        <input type="text" onChange={(e) => setFolderTitle(e.target.value)} />
        <button onClick={notifySuccess}>Create Folder</button>
      </Input>
    </>
  )
}

export default NewFolder