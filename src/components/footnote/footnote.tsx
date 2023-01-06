import React from 'react';
import { IFootnote } from '../../models/IFootnote';
import * as styles from './footnote.module.scss';

const Footnote = ({footnotes, width="80%"}) : JSX.Element => {
  return (
    <div className={styles.footnoteContainer} id="footnote" data-testid="footnote-section">
        <h6 className={styles.footnoteHeading}>Footnotes</h6>
        {footnotes && footnotes.map((footnote, idx) => {
            return(
              <div className={styles.footnoteBody} style={{width: width}} key={idx} data-testid="footnote-item">
                  {footnote.anchors.map(anchor => <sup><a href={`#${anchor.link}`}>{anchor.text}</a></sup>)}
                  {footnote.definition}
              </div>
            )
        })}
    </div>
  )
}

export default Footnote