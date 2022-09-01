import React from 'react';
import {
  hightlighTextContainer,
  hightlightText
} from "./highlight-text.module.scss"

export const highlightedText = () => {

  return (
    <div className={hightlighTextContainer}>
      <p className={hightlightText} defaultValue={"COMING SOON!"}>COMING SOON!</p>
    </div>
  );
}

export default highlightedText;
