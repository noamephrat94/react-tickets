import React, { useState } from "react";
import { Ticket } from "./api";

interface Props {
  text: Ticket["content"];
  length?: number;
}

const SmartText = ({ text, length = 20 }: Props) => {
  const [showLess, setShowLess] = useState(true);

  if (text.length < length) {
    return <p>{text}</p>;
  }

  return (
    <p>
      {showLess ? `${text.slice(0, length)}...` : text}
      <a onClick={() => setShowLess(!showLess)}>
        &nbsp;See {showLess ? "More" : "Less"}
      </a>
    </p>
  );
};

export default SmartText;