
import React from "react";

type IAnchorText = {
    link: string,
    text: string
  }

const AnchorText = ({link, text}: IAnchorText): JSX.Element => {
    return (<a href="#footnote" id={link} data-testid="anchor-text" className="primary">{text}</a>)
}

export default AnchorText