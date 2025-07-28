import React from 'react';
import { emptyDiv, topics, topicsHeading } from './dataset-topics-summary.module.scss';
import Truncator from '../truncate/truncate';

export default function datasetTopicsSummary(props) {
  return (
    <>
      {props.relatedTopics && props.relatedTopics.length ? (
        <>
          <div className={topicsHeading} data-test-id={'topics-heading'}>
            TOPICS:
          </div>
          <p className={topics} data-test-id={'related-topics'}>
            <Truncator numberOfLines={1}>{props.relatedTopics.join(', ')}</Truncator>
          </p>
        </>
      ) : (
        <div className={emptyDiv} data-testid={'topics-empty-div'} />
      )}
    </>
  );
}
