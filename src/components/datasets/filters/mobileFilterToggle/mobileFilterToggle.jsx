import React from 'react'
import * as styles from './mobileFilterToggle.module.scss'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome/index'
import {faUndo} from '@fortawesome/free-solid-svg-icons/index'

export default function MobileFilterToggle({filterCnt, datasetsView, toggleDatasetView, datasetsCount, filterReset}) {
    const showFilterButton=!datasetsView && filterCnt>0
    return (
        <section className={styles.floatingToggle}>
      <div className={styles.container}>
        {
          showFilterButton &&
          <button className={styles.resetButton} onClick={filterReset}>
            <span className={styles.filterCount}>
              <span className={styles.srOnly}>Reset </span>{filterCnt}
              <span className={styles.srOnly}> Selected Filter{ filterCnt === 1 ? '' : 's'}</span>
            </span> <FontAwesomeIcon className={styles.resetIcon} icon={faUndo} size={'1x'} />
          </button>
        }
        <button  className={styles.toggleButton} onClick={toggleDatasetView}>
          {datasetsView ? 'Filter Your Results' : `View Your Results (${datasetsCount})`}
        </button>
      </div>
        </section>
    )
}
