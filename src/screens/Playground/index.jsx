import React, { useContext, useState } from "react";
import EditorContainer from "./EditorContainer";
import InputConsole from "./InputConsole";
import OutputConsole from "./OutputConsole";
import TimeAndMemoryConsole from "./TimeAndMemoryConsole";
import Navbar from "./Navbar";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import {
  languageMap,
  PlaygroundContext,
} from "../../context/PlaygroundContext";
import { ModalContext } from "../../context/ModalContext";
import Modal from "../../components/Modal";
import { Buffer } from "buffer";
import axios from "axios";


const MainContainer = styled.div`
  display: grid;
  grid-template-columns: ${({ isFullScreen }) =>
    isFullScreen ? "1fr" : "2fr 1fr"};
  min-height: ${({ isFullScreen }) =>
    isFullScreen ? "100vh" : "calc(100vh - 4.5rem)"};
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Consoles = styled.div`
  display: grid;
  width: 100%;
  grid-template-rows: 1fr 1fr;
  grid-template-columns: 1fr;
`;

const Playground = () => {
  const { folderId, playgroundId } = useParams();
  const { folders, savePlayground } = useContext(PlaygroundContext);
  const { isOpenModal, openModal, closeModal } = useContext(ModalContext);
  const { title, language, code } = folders[folderId].playgrounds[playgroundId];

  const [currentLanguage, setCurrentLanguage] = useState(language);
  const [currentCode, setCurrentCode] = useState(code);
  const [currentInput, setCurrentInput] = useState("");
  const [currentOutput, setCurrentOutput] = useState("");
  const [isFullScreen, setIsFullScreen] = useState(false);

  const [currentTimeMemory, setCurrentTimeMemory] = useState("");

  // all logic of the playground
  const saveCode = () => {
    savePlayground(folderId, playgroundId, currentCode, currentLanguage);
  };

  const encode = (str) => {
    return Buffer.from(str, "binary").toString("base64");
  };

  const decode = (str) => {
    return Buffer.from(str, "base64").toString();
  };

  const postSubmission = async (language_id, source_code, stdin) => {
    const options = {
      method: "POST",
      url: "https://judge0-ce.p.rapidapi.com/submissions",
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "content-type": "application/json",
        "Content-Type": "application/json",
        // "X-RapidAPI-Key": "82f428cf82mshd4cd3a8e69a1cd3p191a1fjsnbe543430f34f",
        "X-RapidAPI-Key": "d3f73b18aemshcd338a32620a431p145052jsnd08970d4002d",
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
      },
      data: JSON.stringify({
        language_id: language_id,
        source_code: source_code,
        stdin: stdin,
      }),
    };

    const res = await axios.request(options);
    return res.data.token;
  };

  // const getOutput = async (token) => {
  //   // we will make api call here
  //   const options = {
  //     method: "GET",
  //     url: "https://judge0-ce.p.rapidapi.com/submissions/" + token,
  //     params: { base64_encoded: "true", fields: "*" },
  //     headers: {
  //       "X-RapidAPI-Key": "82f428cf82mshd4cd3a8e69a1cd3p191a1fjsnbe543430f34f",
  //       "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
  //     },
  //   };

  //   // call the api
  //   const res = await axios.request(options);
  //   if (res.data.status_id <= 2) {
  //     const res2 = await getOutput(token);
  //     return res2.data;
  //   }
  //   return res.data;
  // };

  const getOutput = async (token) => {
    try {
      const options = {
        method: "GET",
        url: "https://judge0-ce.p.rapidapi.com/submissions/" + token,
        params: { base64_encoded: "true", fields: "*" },
        headers: {
          // "X-RapidAPI-Key": "82f428cf82mshd4cd3a8e69a1cd3p191a1fjsnbe543430f34f",
          "X-RapidAPI-Key": "d3f73b18aemshcd338a32620a431p145052jsnd08970d4002d",
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        },
      };
  
      const res = await axios.request(options);
  
      if (res.data && res.data.status_id <= 2) {
        await new Promise((resolve) => setTimeout(resolve, 1000)); 
        return await getOutput(token);
      }
  
      return res.data; 
    } catch (error) {
      console.error("Error fetching output:", error);
      return null;
    }
  };
  

  const runCode = async () => {
    openModal({
      show: true,
      modalType: 6,
      identifiers: {
        folderId: "",
        cardId: "",
      },
    });
    const language_id = languageMap[currentLanguage].id;
    const source_code = encode(currentCode);
    const stdin = encode(currentInput);

    // pass these things to Create Submissions
    const token = await postSubmission(language_id, source_code, stdin);

    // get the output
    const res = await getOutput(token);
    const status_name = res.status.description;
    const decoded_output = decode(res.stdout ? res.stdout : "");
    const decoded_compile_output = decode(
      res.compile_output ? res.compile_output : ""
    );
    const decoded_error = decode(res.stderr ? res.stderr : "");

    // Time and memory usage
    const executionTime = res.time; // Time in seconds
    const memoryUsage = res.memory; // Memory in kilobytes (KB)

    let final_output = "";
    if (res.status_id !== 3) {
      // our code have some error
      if (decoded_compile_output === "") {
        final_output = decoded_error;
      } else {
        final_output = decoded_compile_output;
      }
    } else {
      final_output = decoded_output;
    }
    setCurrentOutput(status_name + "\n\n" + final_output);
    const timeMemoryOutput = `Time: ${executionTime} seconds\nMemory: ${memoryUsage} KB`;
    setCurrentTimeMemory(timeMemoryOutput); // New state to handle time/memory output
    closeModal();
  };

  const getFile = (e, setState) => {
    const input = e.target;
    if ("files" in input && input.files.length > 0) {
      placeFileContent(input.files[0], setState);
    }
  };

  const placeFileContent = (file, setState) => {
    readFileContent(file)
      .then((content) => {
        setState(content);
      })
      .catch((error) => console.log(error));
  };

  function readFileContent(file) {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = (event) => resolve(event.target.result);
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  }

  return (
    <div>
      <Navbar isFullScreen={isFullScreen} />
      <MainContainer isFullScreen={isFullScreen}>
        <EditorContainer
          title={title}
          currentLanguage={currentLanguage}
          setCurrentLanguage={setCurrentLanguage}
          currentCode={currentCode}
          setCurrentCode={setCurrentCode}
          folderId={folderId}
          playgroundId={playgroundId}
          saveCode={saveCode}
          runCode={runCode}
          getFile={getFile}
          isFullScreen={isFullScreen}
          setIsFullScreen={setIsFullScreen}
        />
        <Consoles>
          <InputConsole
            currentInput={currentInput}
            setCurrentInput={setCurrentInput}
            getFile={getFile}
          />
          <OutputConsole currentOutput={currentOutput} />
          <TimeAndMemoryConsole currentOutput={currentTimeMemory} /> 
        </Consoles>
      </MainContainer>
      {isOpenModal.show && <Modal />}
    </div>
  );
};

export default Playground;
