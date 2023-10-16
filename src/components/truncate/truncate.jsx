import React, { useState } from 'react';
import * as styles from './truncate.module.scss';
import { PropTypes } from 'prop-types';

const Truncator = ({ moreLessClass = styles.moreLessButton, numberOfLines = 2, showMore, children }) => {
  const [expanded, setExpanded] = useState(false);

  let showMoreButton, showLessButton;

  const generateToggleButton = innerText => (
    <button className={moreLessClass} onClick={toggleTruncation} data-test-id="showMoreLessButton">
      {innerText}
    </button>
  );

  const toggleTruncation = () => {
    setExpanded(!expanded);
  };

  if (showMore) {
    showMoreButton = generateToggleButton('Show More');
    showLessButton = generateToggleButton('Show Less');
  }

  return (
    <>
      <div
        className={`${styles.truncateWrapper} ${expanded ? styles.expanded : ''}`}
        style={{ WebkitLineClamp: !expanded && numberOfLines ? numberOfLines : 'none' }}
        data-test-id="truncateDiv"
      >
        {children}
      </div>
      {showMore && (expanded ? showLessButton : showMoreButton)}
    </>
  );
};

Truncator.propTypes = {
  numberOfLines: PropTypes.number,
  showMore: PropTypes.bool,
};

export default Truncator;
