import React from 'react';
import Topic from './topic/topic';
import * as styles from './topics.module.scss';
import FilterGroupReset from '../filters/filterGroupReset/filterGroupReset';

const Topics = ({ activeFilters, groupId, onChange, onGroupReset, availableFilters, topicIcons }) => (
  <>
    <h2 className={styles.topicTitle} data-testid="topics-title">
      Topics
    </h2>
    <FilterGroupReset
      data-testid="topics-reset"
      groupId={groupId}
      activeFilters={activeFilters}
      filters={availableFilters}
      onGroupReset={onGroupReset}
    />
    <div className={styles.topicsLayout}>
      {availableFilters
        .filter(filter => filter.groupId === groupId)
        .map(filter => {
          const image = topicIcons.find(icon => icon.name === filter.slug);
          return (
            <Topic
              active={filter.active}
              filterKey={filter.id}
              key={filter.id}
              label={filter.label}
              onChange={onChange}
              slug={filter.slug}
              image={image}
            />
          );
        })}
    </div>
  </>
);

export default Topics;
