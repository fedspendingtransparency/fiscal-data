import React from 'react';
import CustomLink from "../links/custom-link/custom-link";

type IAnchorText = {
  link: string;
  text: string;
};

const AnchorText = ({ link, text }: IAnchorText): JSX.Element => {
  return (
    <sup>
      <CustomLink url={`#footnote`} id={link} data-testid={'anchor-text'}>
        {text}
      </CustomLink>
    </sup>
  );
};

export default AnchorText;
