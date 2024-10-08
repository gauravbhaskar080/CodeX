import React, { useState, useEffect } from "react";
import styled from "styled-components";
import CodeMirror from "@uiw/react-codemirror";

// theme
import { githubDark, githubLight } from "@uiw/codemirror-theme-github";
import { bespin } from "@uiw/codemirror-theme-bespin";
import { duotoneDark, duotoneLight } from "@uiw/codemirror-theme-duotone";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { xcodeDark, xcodeLight } from "@uiw/codemirror-theme-xcode";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { okaidia } from "@uiw/codemirror-theme-okaidia";
import { androidstudio } from "@uiw/codemirror-theme-androidstudio";
import { monokai } from "@uiw/codemirror-theme-monokai";
import { red } from "@uiw/codemirror-theme-red";
import { sublime } from "@uiw/codemirror-theme-sublime";
import { abcdef } from "@uiw/codemirror-theme-abcdef";
import { abyss } from "@uiw/codemirror-theme-abyss";
import { andromeda } from "@uiw/codemirror-theme-andromeda";
import { basicDark } from "@uiw/codemirror-theme-basic"; 
import { copilot } from "@uiw/codemirror-theme-copilot"; 
import { materialLight, materialDark } from "@uiw/codemirror-theme-material"; 
import { solarizedLight, solarizedDark } from "@uiw/codemirror-theme-solarized"; 
import { tokyoNight } from "@uiw/codemirror-theme-tokyo-night"; 
import { tokyoNightDay } from "@uiw/codemirror-theme-tokyo-night-day"; 
import { tomorrowNightBlue } from "@uiw/codemirror-theme-tomorrow-night-blue"; 

// language
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { php } from "@codemirror/lang-php";
import { rust } from "@codemirror/lang-rust";

//configuration
import { indentUnit } from "@codemirror/language";
import { EditorState } from "@codemirror/state";

const CodeEditor = ({
  currentLanguage,
  currentTheme,
  currentCode,
  setCurrentCode,
}) => {
  const [theme, setTheme] = useState(vscodeDark);
  const [language, setLanguage] = useState(javascript);

  useEffect(() => {
    if (currentLanguage === "cpp") setLanguage(cpp);
    if (currentLanguage === "java") setLanguage(java);
    if (currentLanguage === "javascript") setLanguage(javascript);
    if (currentLanguage === "python") setLanguage(python);
    if (currentLanguage === "php") setLanguage(php);
    if (currentLanguage === "rust") setLanguage(rust);
  }, [currentLanguage]);

  useEffect(() => {
    if (currentTheme === "githubDark") setTheme(githubDark);
    if (currentTheme === "githubLight") setTheme(githubLight);
    if (currentTheme === "bespin") setTheme(bespin);
    if (currentTheme === "duotoneDark") setTheme(duotoneDark);
    if (currentTheme === "duotoneLight") setTheme(duotoneLight);
    if (currentTheme === "dracula") setTheme(dracula);
    if (currentTheme === "xcodeDark") setTheme(xcodeDark);
    if (currentTheme === "xcodeLight") setTheme(xcodeLight);
    if (currentTheme === "vscodeDark") setTheme(vscodeDark);
    if (currentTheme === "okaidia") setTheme(okaidia);
    if (currentTheme === "androidstudio") setTheme(androidstudio);
    if (currentTheme === "monokai") setTheme(monokai);
    if (currentTheme === "red") setTheme(red);
    if (currentTheme === "sublime") setTheme(sublime);
    if (currentTheme === "abcdef") setTheme(abcdef);
    if (currentTheme === "abyss") setTheme(abyss);
    if (currentTheme === "andromeda") setTheme(andromeda);
    if (currentTheme === "basicDark") setTheme(basicDark);
    if (currentTheme === "copilot") setTheme(copilot);
    if (currentTheme === "materialLight") setTheme(materialLight);
    if (currentTheme === "materialDark") setTheme(materialDark);
    if (currentTheme === "solarizedLight") setTheme(solarizedLight);
    if (currentTheme === "solarizedDark") setTheme(solarizedDark);
    if (currentTheme === "tokyoNight") setTheme(tokyoNight);
    if (currentTheme === "tokyoNightDay") setTheme(tokyoNightDay);
    if (currentTheme === "tomorrowNightBlue") setTheme(tomorrowNightBlue);
  }, [currentTheme]);

  return (
    <CodeMirror
      value={currentCode}
      height="100%"
      theme={theme}
      extensions={[
        language,
        indentUnit.of("        "),
        EditorState.tabSize.of(8),
        EditorState.changeFilter.of(() => true),
      ]}
      onChange={(value) => setCurrentCode(value)}
      basicSetup={{
        lineNumbers: true,
        highlightActiveLineGutter: true,
        highlightSpecialChars: true,
        history: true,
        foldGutter: true,
        drawSelection: true,
        dropCursor: true,
        allowMultipleSelections: true,
        indentOnInput: true,
        syntaxHighlighting: true,
        bracketMatching: true,
        closeBrackets: true,
        autocompletion: true,
        rectangularSelection: true,
        crosshairCursor: true,
        highlightActiveLine: true,
        highlightSelectionMatches: true,
        closeBracketsKeymap: true,
        defaultKeymap: true,
        searchKeymap: true,
        historyKeymap: true,
        foldKeymap: true,
        completionKeymap: true,
        lintKeymap: true,
      }}
    />
  );
};

export default CodeEditor;
