import React, { useContext } from "react";
import styled from "styled-components";
import { IoTrashOutline } from "react-icons/io5";
import { BiEditAlt } from "react-icons/bi";
import { BiArrowToTop,BiArrowFromTop  } from "react-icons/bi";
import logo from "../../assets/logo-small.png";
import { ModalContext } from "../../context/ModalContext";
import { PlaygroundContext } from "../../context/PlaygroundContext";
import { useNavigate } from "react-router-dom";

import cpp from "../../assets/3d-c++.png";
import java from "../../assets/java.png";
import python from "../../assets/python.png";
import javascript from "../../assets/javascript.png";
import php from "../../assets/php.png";
import rust from "../../assets/rust.png";
import folderLogo from "../../assets/folder.png";

import { ToastContainer, toast } from "react-toastify";

const StyledRightComponent = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 60%;
  padding: 2rem;

  @media (max-width: 768px) {
    position: relative;
    width: 100%;
    padding: 1rem 0.5rem;
  }
`;

const TopButton = styled.div`
  position: fixed;
  top: 10px;
  right: 32px;
  z-index: 1000;
  background-color: rgba(211, 211, 211, 0.8); /* Light gray with 80% opacity */
  color: white;
  padding: 1px 20px;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
  &:hover {
    background-color: rgba(169, 169, 169, 0.8); /* Dark gray with 80% opacity */
  }
`;

const BottomButton = styled.div`
  position: fixed;
  bottom: 10px;
  right: 32px;
  z-index: 1000;
  background-color: rgba(211, 211, 211, 0.8); /* Light gray with 80% opacity */
  color: white;
  padding: 1px 20px;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
  &:hover {
    background-color: rgba(169, 169, 169, 0.8); /* Dark gray with 80% opacity */
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #989898;
  margin-bottom: 1rem;
`;

const Heading = styled.h3`
  font-size: ${(props) => (props.size === "small" ? "1.25rem" : "1.75rem")};
  font-weight: 400;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  span {
    font-weight: 700;
  }
`;

const AddButton = styled.div`
  font-size: 1rem;
  border-radius: 30px;
  color: black;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  span {
    font-size: 1.5rem;
    font-weight: 700;
  }

  &:hover {
    cursor: pointer;
  }
`;

const FolderCard = styled.div`
  margin-bottom: 1rem;
`;

const FolderIcons = styled.div`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  cursor: pointer;
`;

const PlayGroundCards = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: 428px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 8px;
  box-shadow: 0 0 4px 0px #989898;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    scale: 1.05;
    box-shadow: 0 0 8px 0px #989898;
  }
`;

const CardContainer = styled.div`
  display: flex;
  align-items: center;
`;

const CardContent = styled.div``;

const Logo = styled.img`
  width: 70px;
  margin-right: 1rem;

  @media (max-width: 425px) {
    width: 50px;
    margin-right: 0.5rem;
  }
`;
const RightComponent = () => {
  const navigate = useNavigate();

  const { openModal } = useContext(ModalContext);
  const { folders, deleteFolder, deleteCard } = useContext(PlaygroundContext);
  const notifyDeleteSuccess = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      progressStyle: {
        background: "red",
        color: "#fff",
      },
    });
  };

  const handleDeleteFolder = (folderId) => {
    deleteFolder(folderId);
    notifyDeleteSuccess("Folder deleted successfully");
  };

  const handleDeleteCard = (folderId, playgroundId) => {
    deleteCard(folderId, playgroundId);
    notifyDeleteSuccess("File deleted successfully");
  };
  const languageLogos = {
    cpp: cpp,
    python: python,
    java: java,
    javascript: javascript,
    php: php,
    rust: rust,
  };

  // Function to scroll to the top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Function to scroll to the bottom
  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  return (
    <>
      <StyledRightComponent>
        <Header>
          <Heading size="large">
            My <span>Playground</span>
          </Heading>
          <AddButton
            onClick={() =>
              openModal({
                show: true,
                modalType: 1,
                identifiers: {
                  folderId: "",
                  cardId: "",
                },
              })
            }
          >
            <span>+</span> New Folder
          </AddButton>
        </Header>

        {Object.entries(folders).reverse().map(([folderId, folder]) => (
          <FolderCard key={folderId}>
            <Header>
              <Heading size="small">
                {/* <FcOpenedFolder /> {folder.title} */}
                <Logo
                  src={folderLogo}
                  style={{ width: "30px", marginRight: "0" }}
                />{" "}
                {folder.title}
                {" "}[{Object.keys(folder.playgrounds).length}]
              </Heading>
              <FolderIcons>
                <IoTrashOutline onClick={() => handleDeleteFolder(folderId)} />
                <BiEditAlt
                  onClick={() =>
                    openModal({
                      show: true,
                      modalType: 4,
                      identifiers: {
                        folderId: folderId,
                        cardId: "",
                      },
                    })
                  }
                />
                <AddButton
                  onClick={() =>
                    openModal({
                      show: true,
                      modalType: 2,
                      identifiers: {
                        folderId: folderId,
                        cardId: "",
                      },
                    })
                  }
                >
                  <span>+</span> New Playground
                </AddButton>
              </FolderIcons>
            </Header>

            <PlayGroundCards>
              {Object.entries(folder["playgrounds"]).map(
                ([playgroundId, playground]) => (
                  <Card
                    key={playgroundId}
                    onClick={() => {
                      navigate(`/playground/${folderId}/${playgroundId}`);
                    }}
                  >
                    <CardContainer>
                      <Logo src={languageLogos[playground.language] || logo} />
                      <CardContent>
                        <p>{playground.title}</p>
                        <p>Language: {playground.language}</p>
                      </CardContent>
                    </CardContainer>
                    <FolderIcons
                      onClick={(e) => {
                        e.stopPropagation(); //stop click propagation from child to parent
                      }}
                    >
                      <IoTrashOutline
                        onClick={() => handleDeleteCard(folderId, playgroundId)}
                      />
                      <BiEditAlt
                        onClick={() =>
                          openModal({
                            show: true,
                            modalType: 5,
                            identifiers: {
                              folderId: folderId,
                              cardId: playgroundId,
                            },
                          })
                        }
                      />
                    </FolderIcons>
                  </Card>
                )
              )}
            </PlayGroundCards>
          </FolderCard>
        ))}
      </StyledRightComponent>
      <TopButton onClick={scrollToTop}><BiArrowToTop size={22} /></TopButton>

      <BottomButton onClick={scrollToBottom}><BiArrowFromTop size={22} /></BottomButton>

      <ToastContainer />
    </>
  );
};

export default RightComponent;
