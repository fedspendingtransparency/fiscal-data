import React from "react";
import * as styles from "./dataset-topics-summary.module.scss";
import Truncator from "../../truncate/truncate";

export default function datasetTopicsSummary(props) {
  return (
    <>
      {props.relatedTopics && props.relatedTopics.length ? (
        <>
          <div className={styles.topicsHeading} data-test-id="topics-heading">TOPICS:</div>
          <div className={styles.topics} data-test-id="related-topics">
            <Truncator numberOfLines={1}>{props.relatedTopics.join(', ')}</Truncator>
          </div>
        </>
      ) : (
        <div className={styles.emptyDiv} data-test-id="topics-empty-div" />
        )
      }
    </>
  )
}
