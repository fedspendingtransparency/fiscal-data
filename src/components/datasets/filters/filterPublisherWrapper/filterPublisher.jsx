import React from "react"
import * as styles from './filterPublisher.module.scss'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronDown } from "@fortawesome/free-solid-svg-icons"

export default function FilterPublisher({ filterList, children }) {
    const publisherCount = `${filterList.filter(r=>r.groupId === "publisher").length} Publishers`
  return (
    <div data-testid="publisher-filter-wrapper">
        <div className={styles.outer_container_label} data-testid="publisher-outer-container-label">
          <div className={styles.publisher_count} data-testid="publisher-count">
            <FontAwesomeIcon
              icon={faChevronDown}
              className={styles.publisher_chevron}
            />
            {publisherCount}
          </div>
        </div>
        <div className={styles.publisher_outer_container} data-testid='publisher-outer-container'>
          <div className={styles.treasury_title} data-testid="treasury-label">
            Treasury Department
          </div>
          <div data-testid='publisher-inner-container-label'
            className={styles.inner_container_label}
          >
            <div className={styles.publisher_count} data-testid="publisher-count">
              <FontAwesomeIcon
                icon={faChevronDown}
                className={styles.publisher_chevron}
              />
              {publisherCount}
            </div>
          </div>
          <div className={styles.publisher_inner_container} data-testid='publisher-inner-container'>
            <div className={styles.fiscal_title} data-testid='fiscal-title'>
              Bureau of the Fiscal Service
            </div>
            <div className={styles.publisher_checkbox_container}>
             {children}
            </div>
          </div>
        </div>
    </div>
  )
}
