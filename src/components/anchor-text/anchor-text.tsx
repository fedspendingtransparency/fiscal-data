import React from 'react';

type IAnchorText = {
  link: string;
  text: string;
};

const AnchorText = ({ link, text }: IAnchorText): JSX.Element => {
  return (
    <sup>
      <a
        href="#footnote"
        id={link}
        data-testid="anchor-text"
        className="primary"
      >
        {text}
      </a>
    </sup>
  );
};

export default AnchorText;
