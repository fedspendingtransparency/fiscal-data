import React, { useEffect, useState } from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons/faEllipsisH';
import { active, arrow, ellipsis, pageButtons, pagingButtons } from './pagination-controls.module.scss';

const PageButtons = ({ pageButtonProps }) => {
  const { maxPage, tableName, currentPage, handleJump, pagesArray } = pageButtonProps;
  const [current, setCurrent] = useState(1);

  useEffect(() => {
    setCurrent(currentPage);
  }, [currentPage]);

  const handlePageClick = page => {
    setCurrent(page);
    if (handleJump) {
      handleJump(page);
    }
  };

  const handleNext = () => {
    setCurrent(currentPage => Math.min(currentPage + 1, maxPage));
    handleJump(currentPage + 1);
  };

  const handlePrev = () => {
    setCurrent(currentPage => Math.min(currentPage - 1, maxPage));
    handleJump(currentPage - 1);
  };

  // Adaptation of https://gist.github.com/kottenator/9d936eb3e4e3c3e02598
  const getPageRange = (c, m) => {
    const current = c,
      last = m,
      delta = 2,
      left = current >= maxPage - 3 ? maxPage - 3 : current,
      right = current + delta + 2,
      range = [1],
      rangeWithDots = [];
    let l;

    for (let i = 2; i <= last; i++) {
      if (i === currentPage || i === last || (i >= left && i < right)) {
        range.push(i);
      }
    }

    for (const i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }

      if (i === left && i !== 1 && !rangeWithDots.includes(i - 1)) {
        rangeWithDots.push(i - 1);
      }

      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  const renderPageButtons = () => {
    const pageRange = maxPage > 7 ? getPageRange(currentPage, maxPage) : pagesArray;
    return pageRange.map((page, index) => {
      return isNaN(page) ? (
        <button
          key={`${tableName}-ellipsis${index}`}
          id={`${tableName}-ellipsis${index}`}
          className={ellipsis}
          aria-label="Page number overflow ellipsis"
        >
          <FontAwesomeIcon icon={faEllipsisH} className={ellipsis} />
        </button>
      ) : (
        <button
          key={`${tableName}-page${page}`}
          id={`${tableName}-page${page}`}
          aria-label={`${tableName}-page${page}`}
          onClick={() => handlePageClick(page)}
          className={current === page ? active : {}}
        >
          {page}
        </button>
      );
    });
  };

  return (
    <div className={pagingButtons}>
      <button id={`${tableName}-page-prev`} onClick={() => handlePrev()} disabled={currentPage - 1 <= 0} className={arrow} aria-label="Previous page">
        <ChevronLeftIcon variant="outlined" size="small" />
      </button>
      <span className={pageButtons}>{renderPageButtons()}</span>
      <button
        id={`${tableName}-page-next`}
        onClick={() => handleNext()}
        disabled={currentPage + 1 > maxPage}
        className={arrow}
        data-testid="page-next-button"
        aria-label="Next page"
      >
        <ChevronRightIcon variant="outlined" size="small" />
      </button>
    </div>
  );
};

export default PageButtons;
