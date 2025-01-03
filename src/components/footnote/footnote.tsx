import React, { FunctionComponent } from 'react';
import { footnoteHeading, footnoteBody, footnoteContainer } from './footnote.module.scss';
import CustomLink from '../links/custom-link/custom-link';

type FootnoteAnchor = {
  text?: string;
  link?: string;
};

type FootnoteItem = {
  anchors: FootnoteAnchor[];
  definition?: JSX.Element | (() => JSX.Element);
};

type FootnoteProps = {
  footnotes: FootnoteItem[];
  width?: string;
  onBackToContentClick?: () => void;
};

const Footnote: FunctionComponent<FootnoteProps> = ({ footnotes, width = '80%', onBackToContentClick, lastAnchorClicked }) => {
  return (
    <div className={footnoteContainer} id="footnote" data-testid="footnote-section" tabIndex={-1}>
      <h6 className={footnoteHeading}>Footnotes</h6>
      {footnotes?.map((footnote, idx) => (
        <div className={footnoteBody} style={{ width }} key={idx} data-testid="footnote-item">
          {footnote.anchors.map((anchor, index) => (
            <sup key={index}>
              <CustomLink url={`#${anchor.link}`} href={`#${anchor.link}`}>
                {anchor.text}
              </CustomLink>
            </sup>
          ))}
          {footnote.definition} <a href={`#${footnote.anchors[0].link}-footnote`}>Back to content</a>
        </div>
      ))}
    </div>
  );
};

export default Footnote;
