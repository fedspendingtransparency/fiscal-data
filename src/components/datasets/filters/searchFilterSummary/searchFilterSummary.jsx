import React, { useState, useEffect } from "react"
import * as styles from "./searchFilterSummary.module.scss"
import { faTimes, faUndo } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import classNames from "classnames"
import { isValid, format } from "date-fns"
import { filtersByGroupKeyWithName } from "../../../../transform/filters/filterDefinitions"

export default function SearchFilterSummary({
  searchQuery,
  activeFilters,
  allFilters,
  onIndividualReset,
  onGroupReset
}) {
  const [filters, setFilters] = useState(filtersByGroupKeyWithName(activeFilters, allFilters));

  useEffect(() => {
    const updated = filtersByGroupKeyWithName(activeFilters, allFilters);
    setFilters(updated);
  }, [activeFilters, allFilters]);

  const clickHandler = (option, filterConfig) => {
    return () => {
      option.active = false
      onIndividualReset(option);
    }
  };

  const handleClearAll = () => {
    const active = filters.filter(r => r.options.some(d => d.active))
    active.map(a => {
      return onGroupReset(a.key)
    })
  };

  const searched = searchQuery.length > 0
  const filtered = activeFilters.length > 0

  return (
    <React.Fragment>
      {searched || filtered ? (
        <div className={styles.showingDatasetsText}>
          Searching Datasets
          {searched ? (
            <>
              &nbsp;matching '
              <span className={styles.searchTermText}>{searchQuery}</span>'
            </>
          ) : null}
          {filtered && (
            <>
              &nbsp;<span>refined by</span>
            </>
          )}
        </div>
      ) : null}
      {filtered ? (
        <div className={styles.filter_summary_container}>
          {filters
            .filter(obj => obj.options.some(r => r.active))
            .map((filterConfig, index) => (
              <React.Fragment key={index}>
                <div
                  className={styles.filter_summary_item}
                >
                  <p
                    className={styles.filter_summary_title}
                  >
                    {filterConfig.name}:
                  </p>
                  {filterConfig.options
                    .filter(obj => obj.active)
                    .map((option, index) => (
                      <button
                        type="button"
                        className={styles.filter_summary_button}
                        key={index}
                        onClick={clickHandler(option, filterConfig)}
                      >
                        {option.active.active &&
                        option.active.startDate &&
                        isValid(option.active.startDate) &&
                        option.active.endDate &&
                        isValid(option.active.endDate) ? (
                          <label >
                            {`${format(option.active.startDate, [
                              "MM/dd/yyyy",
                            ])} - ${format(option.active.endDate, [
                              "MM/dd/yyyy",
                            ])}`}
                          </label>
                        ) : (
                          <label >
                            {option.label}
                          </label>
                        )}

                        <FontAwesomeIcon
                          icon={faTimes}
                          className={styles.times_icon}
                        />
                      </button>
                    ))}
                </div>
              </React.Fragment>
            ))}
          {filtered && (
            <div className={styles.filter_summary_item}>
              <p
                className={classNames([
                  styles.filter_summary_title,
                  styles.clear_all_title_hidden,
                ])}
              >
                text here
              </p>
              <button
                type="button"
                className={styles.filter_summary_button}
                onClick={() => handleClearAll()}
              >
                Clear All Filters{" "}
                <FontAwesomeIcon icon={faUndo} className={styles.undo_icon} />
              </button>
            </div>
          )}
        </div>
      ) : null}
    </React.Fragment>
  )
}
