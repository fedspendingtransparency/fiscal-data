import React from 'react';
import { emptyDiv, topics, topicsHeading } from './dataset-topics-summary.module.scss';
import Truncator from '../../truncate/truncate';

export default function datasetTopicsSummary(props) {
  return (
    <>
      {props.relatedTopics && props.relatedTopics.length ? (
        <>
          <div className={topicsHeading}>TOPICS:</div>
          <div className={topics}>
            <Truncator numberOfLines={1}>{props.relatedTopics.join(', ')}</Truncator>
          </div>
        </>
      ) : (
        <div className={emptyDiv} data-testid="topics-empty-div" />
      )}
    </>
  );
}
