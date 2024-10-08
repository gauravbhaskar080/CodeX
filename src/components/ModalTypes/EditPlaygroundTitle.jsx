import React, { useContext, useState } from 'react'
import { Header, CloseButton, Input } from '../Modal'
import { IoCloseSharp } from 'react-icons/io5'
import { ModalContext } from '../../context/ModalContext'
import { PlaygroundContext } from '../../context/PlaygroundContext'
import { toast } from 'react-toastify';


const EditPlaygroundTitle = () => {
  const { isOpenModal, closeModal } = useContext(ModalContext);
  const { editPlaygroundTitle, folders } = useContext(PlaygroundContext);

  const { folderId, cardId } = isOpenModal.identifiers;
  const [playgroundTitle, setPlaygroundTitle] = useState(folders[folderId].playgrounds[cardId].title);

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

  const handleRenameFile = (folderId,cardId, playgroundTitle) => {
    editPlaygroundTitle(folderId, cardId, playgroundTitle)
    closeModal();
    notifyRename("Rename file successfully");
  }

  return (
    <>
      <Header>
        <h2>Edit Card Title</h2>
        <CloseButton onClick={() => closeModal()}>
          <IoCloseSharp />
        </CloseButton>
      </Header>
      <Input>
        <input type="text" onChange={(e) => setPlaygroundTitle(e.target.value)} />
        <button onClick={() => handleRenameFile(folderId,cardId,playgroundTitle)}>Update Title</button>
      </Input>
    </>
  )
}

export default EditPlaygroundTitle