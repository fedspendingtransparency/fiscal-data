import React from 'react';
import {
  outer_container_label,
  publisher_count,
  publisher_chevron,
  publisher_outer_container,
  treasury_title,
  inner_container_label,
  publisher_inner_container,
  fiscal_title,
  publisher_checkbox_container,
} from './filterPublisher.module.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown';

export default function FilterPublisher({ filterList, children }) {
  const publisherCount = `${filterList.filter(r => r.groupId === 'publisher').length} Publishers`;
  return (
    <div data-testid="publisher-filter-wrapper">
      <div className={outer_container_label} data-testid="publisher-outer-container-label">
        <div className={publisher_count} data-testid="publisher-count">
          <FontAwesomeIcon icon={faChevronDown} className={publisher_chevron} />
          {publisherCount}
        </div>
      </div>
      <div className={publisher_outer_container} data-testid="publisher-outer-container">
        <div className={treasury_title} data-testid="treasury-label">
          Treasury Department
        </div>
        <div data-testid="publisher-inner-container-label" className={inner_container_label}>
          <div className={publisher_count} data-testid="publisher-count">
            <FontAwesomeIcon icon={faChevronDown} className={publisher_chevron} />
            {publisherCount}
          </div>
        </div>
        <div className={publisher_inner_container} data-testid="publisher-inner-container">
          <div className={fiscal_title} data-testid="fiscal-title">
            Bureau of the Fiscal Service
          </div>
          <div className={publisher_checkbox_container}>{children}</div>
        </div>
      </div>
    </div>
  );
}
