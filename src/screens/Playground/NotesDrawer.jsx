import React, { useState, useEffect } from "react";
import { Drawer, Button, TextField, IconButton, Dialog } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import { IoMdClose } from "react-icons/io";
import { MdEdit, MdDelete } from "react-icons/md";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NotesInputContainer = styled.div`
  flex: 0.6;
  position: relative;
  margin-right: 5px;
`;

const SnippetsContainer = styled.div`
  flex: 0.4;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #c8c4c4;
  overflow-y: auto;
  max-height: 125px;
`;

const SnippetItem = styled.div`
  margin-bottom: 8px;
  padding: 4px;
  background-color: #444;
  color: #fff;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SnippetText = styled.span`
  color: #fff;
`;

const ModalContent = styled.div`
  padding: 20px;
  position: relative;
  text-align: center;
`;

const ModalCloseButton = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  cursor: pointer;
`;

const NotesDrawer = ({ open, onClose }) => {
  const location = useLocation();
  const dynamicId = location.pathname.split("/playground/")[1];

  const [notes, setNotes] = useState("");
  const [savedSnippets, setSavedSnippets] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [modalSnippet, setModalSnippet] = useState("");

  useEffect(() => {
    const savedNotes = localStorage.getItem(`notes_${dynamicId}`);
    if (savedNotes) {
      setNotes(savedNotes);
    }

    const savedSnippetData = localStorage.getItem(`savedSnippets_${dynamicId}`);
    if (savedSnippetData) {
      setSavedSnippets(JSON.parse(savedSnippetData));
    }
  }, [dynamicId]);

  const handleSaveNotes = () => {
    if (editingIndex !== null) {
      const updatedSnippets = savedSnippets.map((snippet, index) =>
        index === editingIndex ? notes : snippet
      );
      setSavedSnippets(updatedSnippets);
      localStorage.setItem(
        `savedSnippets_${dynamicId}`,
        JSON.stringify(updatedSnippets)
      );
      toast.success("Notes updated successfully!", {
        position: "top-right",
        autoClose: 2000,
      });
      setEditingIndex(null);
    } else {
      setSavedSnippets((prev) => [...prev, notes]);
      localStorage.setItem(
        `savedSnippets_${dynamicId}`,
        JSON.stringify([...savedSnippets, notes])
      );
      toast.success("Notes saved successfully!", {
        position: "top-right",
        autoClose: 2000,
      });
    }
    setNotes("");
  };

  const handleEditNote = (index) => {
    setNotes(savedSnippets[index]);
    setEditingIndex(index);
  };

  const handleDeleteNote = (index) => {
    const updatedSnippets = savedSnippets.filter((_, i) => i !== index);
    setSavedSnippets(updatedSnippets);
    localStorage.setItem(
      `savedSnippets_${dynamicId}`,
      JSON.stringify(updatedSnippets)
    );
    toast.success("Notes deleted successfully!", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const handleReadMore = (snippet) => {
    setModalSnippet(snippet);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <>
      <Drawer
        anchor="top"
        open={open}
        onClose={onClose}
        sx={{
          ".MuiDrawer-paper": {
            borderRadius: "0 0 18px 18px",
          },
        }}
      >
        <Container>
          <Header>
            <h3>Notes & Examples:</h3>
            <h3 style={{ marginLeft: "26%" }}>Saved Notes & Examples:</h3>
            <IconButton onClick={onClose}>
              <IoMdClose size={24} />
            </IconButton>
          </Header>
          <div style={{ display: "flex", flex: 1, columnGap: "10px" }}>
            <NotesInputContainer>
              <TextField
                label="Write your notes here"
                multiline
                rows={4}
                variant="outlined"
                fullWidth
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              <Button
                variant="contained"
                onClick={handleSaveNotes}
                style={{
                  position: "absolute",
                  bottom: 10,
                  right: 10,
                }}
              >
                {editingIndex !== null ? "Update Notes" : "Save Notes"}
              </Button>
            </NotesInputContainer>
            <SnippetsContainer>
              <h4 style={{ color: "#fff", marginTop: "-20px" }}>
                Saved Snippets:
              </h4>
              {savedSnippets.map((snippet, index) => (
                <SnippetItem key={index}>
                  <SnippetText>
                    {snippet.length > 100
                      ? snippet.slice(0, 100) + "..."
                      : snippet}
                    {snippet.length > 100 && (
                      <Button
                        onClick={() => handleReadMore(snippet)}
                        style={{
                          color: "#fff",
                          textDecoration: "underline",
                          marginLeft: "4px",
                        }}
                      >
                        Read More
                      </Button>
                    )}
                  </SnippetText>
                  <div>
                    <IconButton
                      onClick={() => handleEditNote(index)}
                      style={{ marginRight: "4px" }}
                    >
                      <MdEdit size={20} color="#fff" />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteNote(index)}>
                      <MdDelete size={20} color="#fff" />
                    </IconButton>
                  </div>
                </SnippetItem>
              ))}
            </SnippetsContainer>
          </div>
        </Container>
      </Drawer>

      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
      >
        <ModalContent>
          <ModalCloseButton onClick={handleCloseModal}>
            <IoMdClose size={24} />
          </ModalCloseButton>
          <h3>Full Note</h3>
          <br />
          <p>{modalSnippet}</p>
        </ModalContent>
      </Dialog>

      <ToastContainer />
    </>
  );
};

export default NotesDrawer;
