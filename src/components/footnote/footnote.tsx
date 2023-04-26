import React, {FunctionComponent} from 'react';
import * as styles from './footnote.module.scss';

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
                  {footnote.anchors.map(anchor => <sup key={anchor.link}><a href={`#${anchor.link}`}>{anchor.text}</a></sup>)}
                  {footnote.definition}
              </div>
            )
        })}
    </div>
  )
}

export default Footnote
