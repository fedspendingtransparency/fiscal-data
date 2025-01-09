import React from 'react';
import CustomLink from '../links/custom-link/custom-link';

type IAnchorText = {
  link: string;
  text: string;
  onAnchorClick?: (anchorId: string) => void;
};

const AnchorText = ({ link, text, onAnchorClick }: IAnchorText): JSX.Element => {
  const handleClick = () => {
    if (onAnchorClick) {
      onAnchorClick(link);
    }
  };

  return (
    <sup>
      <CustomLink url="#footnote" id={link} data-testid="anchor-text" onClick={handleClick}>
        {text}
      </CustomLink>
    </sup>
  );
};

export default AnchorText;
