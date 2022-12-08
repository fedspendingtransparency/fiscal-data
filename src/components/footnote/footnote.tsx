import React from 'react';
import { IFootnote } from '../../models/IFootnote';
import * as styles from './footnote.module.scss';

const Footnote = ({footnotes}) : JSX.Element => {
  return (
    <div className={styles.footnoteContainer} id="footnote" data-testid="footnote-section">
        <h6 className={styles.footnoteHeading}>Footnotes</h6>
        {footnotes && footnotes.map((footnote, idx) => {
            return(
              <div className={styles.footnoteBody} key={idx} data-testid="footnote-item">
                  <sup>
                    <a href={`#${footnote.link}`}>{idx+1}</a>
                  </sup>
                  {footnote.body}
              </div>
            )
        })}
    </div>
  )
}

export default Footnote