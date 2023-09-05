import React, {FunctionComponent} from 'react';
import * as styles from './footnote.module.scss';
import CustomLink from "../links/custom-link/custom-link";

type FootnoteProps = {
  footnotes: [{
    anchors: [{
      text?: string,
      link?: string
    }],
    definition?: string
  }],
  width?: string
};

const Footnote: FunctionComponent<FootnoteProps> = ({footnotes, width ="80%"}) : JSX.Element => {

  return (
    <div className={styles.footnoteContainer} id="footnote" data-testid="footnote-section">
        <h6 className={styles.footnoteHeading}>Footnotes</h6>
        {footnotes && footnotes.map((footnote, idx) => {
            return(
              <div className={styles.footnoteBody} style={{width: width}} key={idx} data-testid="footnote-item">
                {footnote.anchors.map(anchor =>
                  <sup>
                    <CustomLink url={`#${anchor.link}`} href={`#${anchor.link}`}>
                      {anchor.text}
                    </CustomLink>
                  </sup>)}
                {footnote.definition}
              </div>
            )
        })}
    </div>
  )
}

export default Footnote
