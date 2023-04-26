import React from "react";
import * as styles from "./filterCount.module.scss";

const FilterCount = ({ count }) => {
    const width = Math.ceil(count.count / count.of * 100) + '%';
    let minWidth = 12;

    if (count.count === 0) {
        minWidth = 0;
    } else if (count.count > 9) {
        minWidth += 7;
    }

    return (
        <div className={styles.barContainer}>
            <div
                data-testid="filter-count-bar"
                className={styles.bar}
                style={{ width: width, minWidth: minWidth }}
            />
            <div
                data-testid="filter-count"
                className={styles.count}
            >{count.count}
            </div>
        </div>
    )
}

export default FilterCount;
