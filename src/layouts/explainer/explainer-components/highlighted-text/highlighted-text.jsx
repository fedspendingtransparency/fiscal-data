import React from 'react';
import {
  highlightTextContainer,
  highlightText
} from "./highlight-text.module.scss"

export const highlightedText = () => {

  return (
    <div className={highlightTextContainer}>
      <p className={highlightText} defaultValue={"COMING SOON!"}>COMING SOON!</p>
    </div>
  );
}

export default highlightedText;
