import React, { useEffect, useState } from 'react';
import { button_container, button_contents, oval, topicActive, topicLabel } from './topic.module.scss';
import classNames from 'classnames';
import Analytics from '../../../../utils/analytics/analytics';
import { getImage, GatsbyImage } from 'gatsby-plugin-image';
import { ga4DataLayerPush } from '../../../../helpers/google-analytics/google-analytics-helper';

export const topicIconAnalyticsEvent = {
  category: 'Dataset Search Page',
  action: 'Topics Filter Click',
};

const Topic = ({ active, filterKey, label, onChange, image }) => {
  const [selected, setSelected] = useState(active || false);
  const icon = getImage(image);

  const handleClick = event => {
    if (event && event.bubbles) {
      event.stopPropagation();
    }

    const newVal = !selected;
    setSelected(newVal);
    onChange({
      key: filterKey,
      value: newVal,
    });

    if (newVal) {
      Analytics.event({
        ...topicIconAnalyticsEvent,
        label,
      });

      // GA4 - Topics Filter Click
      ga4DataLayerPush({
        event: 'Topics Filter Click',
        eventLabel: label,
      });
    }
  };

  useEffect(() => {
    setSelected(active || false);
  }, [active]);

  return (
    <button className={button_container} name={label} value={filterKey} onClick={handleClick}>
      <div className={button_contents}>
        <div className={classNames([oval, selected ? topicActive : ''])} data-testid="topic-selector-button">
          <GatsbyImage image={icon} alt={image?.name} />
        </div>
        <label className={topicLabel} data-testid="topic-selector-label">
          {label}
        </label>
      </div>
    </button>
  );
};

export default Topic;
