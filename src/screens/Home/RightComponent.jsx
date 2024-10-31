import React, { useContext, useState, useRef } from "react";
import styled from "styled-components";
import { IoTrashOutline, IoSearch } from "react-icons/io5";
import { BiEditAlt } from "react-icons/bi";
import { BiArrowToTop, BiArrowFromTop } from "react-icons/bi";
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

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: baseline;
  width: 100%;
  margin-bottom: 1rem;
  margin-top: 1rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.5rem 2rem 0.5rem 0.5rem;
  border-radius: 5px;
  border: 1px solid #ccc;
  outline: none;
  font-size: 1rem;
`;

const SearchIcon = styled(IoSearch)`
  position: absolute;
  right: 10px;
  cursor: pointer;
  margin-top: 0.5rem;
`;

const RightComponent = () => {
  const navigate = useNavigate();

  const { openModal } = useContext(ModalContext);
  const { folders, deleteFolder, deleteCard } = useContext(PlaygroundContext);

  const [searchTerm, setSearchTerm] = useState("");
  const searchRefs = useRef({});

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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  const totalPlaygrounds = Object.values(folders).reduce(
    (acc, folder) => acc + Object.keys(folder).length - 1,
    0
  );

  const handleSearchClick = () => {
    if (searchTerm === "") {
      toast.error("Please enter a search term.", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }

    for (let ref in searchRefs.current) {
      if (ref.toLowerCase().includes(searchTerm.toLowerCase())) {
        searchRefs.current[ref].scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    toast.error("Nothing Found!!!", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearchClick();
    }
  };

  return (
    <>
      <StyledRightComponent>
        <SearchContainer>
          <SearchInput
            placeholder="Search code snippets or folders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <SearchIcon onClick={handleSearchClick} />
        </SearchContainer>
        <Header>
          <Heading size="large">
            My <span>Playground</span> [{totalPlaygrounds}]
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

        {Object.entries(folders)
          .reverse()
          .map(([folderId, folder]) => (
            <FolderCard key={folderId}>
              <Header ref={(el) => (searchRefs.current[folder.title] = el)}>
                <Heading size="small">
                  {/* <FcOpenedFolder /> {folder.title} */}
                  <Logo
                    src={folderLogo}
                    style={{ width: "30px", marginRight: "0" }}
                  />{" "}
                  {folder.title} [{Object.keys(folder.playgrounds).length}]
                </Heading>
                <FolderIcons>
                  <IoTrashOutline
                    onClick={() => handleDeleteFolder(folderId)}
                  />
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
                      ref={(el) => (searchRefs.current[playground.title] = el)}
                      onClick={() => {
                        navigate(`/playground/${folderId}/${playgroundId}`);
                      }}
                    >
                      <CardContainer>
                        <Logo
                          src={languageLogos[playground.language] || logo}
                        />
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
                          onClick={() =>
                            handleDeleteCard(folderId, playgroundId)
                          }
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
      <TopButton onClick={scrollToTop}>
        <BiArrowToTop size={22} />
      </TopButton>

      <BottomButton onClick={scrollToBottom}>
        <BiArrowFromTop size={22} />
      </BottomButton>

      <ToastContainer />
    </>
  );
};

export default RightComponent;
