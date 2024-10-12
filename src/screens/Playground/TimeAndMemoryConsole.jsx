import React from "react";
import { Console, Header, TextArea } from "./InputConsole.jsx";

const TimeAndMemoryConsole = ({ currentOutput }) => {
  return (
    <Console>
      <Header >
        Time & Memory:
      </Header>
      <TextArea value={currentOutput} disabled />
    </Console>
  );
};

export default TimeAndMemoryConsole;
