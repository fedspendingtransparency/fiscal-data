import React from 'react';
import { InsightsFootnote } from '../../models/IInsightsFootnotes';
import * as styles from './insights-footnote.module.scss';

const InsightsFooter = (footnotes : [InsightsFootnote]) => {
  return (
    <div className={styles.footnameContainer} >
        {footnotes && footnotes.map((footnote, idx) => {
            <div className={styles.footnoteBody} key={idx}>
                <span className={styles.footnoteIndex}>idx+1</span>
                {footnote.body}
            </div>
        })}
    </div>
  )
}

export default InsightsFooter