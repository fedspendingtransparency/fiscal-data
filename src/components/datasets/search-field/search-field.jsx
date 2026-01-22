import React, { useContext, useEffect, useRef, useState } from 'react';
import { noButton, searchInput, searchInput_iconButton, searchInput_textField } from './search-field.module.scss';
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons/faTimesCircle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import InfoTip, { infoTipAnalyticsObject } from '../../info-tip/info-tip';
import Analytics from '../../../utils/analytics/analytics';
import { siteContext } from '../../persist/persist';

const infoIcon = {
  title: 'Dataset Keyword Search',
  body: (
    <>
      Dataset Keyword Search finds datasets that match one or more of the following attributes:
      <ul>
        <li>Title</li>
        <li>Description</li>
        <li>Topic</li>
        <li>Column Display Name</li>
      </ul>
    </>
  ),
};

let qtUpdate = null;
let analyticsUpdate = null;

export const searchFieldAnalyticsObject = {
  category: 'Dataset Search Page',
  action: 'Keyword Search',
};

export const lastUpdatedInfoTipAnalyticsObject = {
  ...infoTipAnalyticsObject,
  label: 'Keyword Search',
};

const SearchField = ({ changeHandler, finalDatesNotFound }) => {
  const context = useContext(siteContext);
  const { keywords, setKeywords } = context;
  const [localText, setLocalText] = useState(context ? keywords : '');
  const [searchIsEmpty, setSearchIsEmpty] = useState(!context || !keywords || !keywords.length);
  const searchField = useRef();

  const processInput = event => {
    const searchFieldVal = event.target.value;
    setSearchIsEmpty(searchFieldVal.length === 0);
    setLocalText(searchFieldVal);
  };

  const throttleChange = () => {
    if (qtUpdate) {
      clearTimeout(qtUpdate);
    }

    if (analyticsUpdate) {
      clearTimeout(analyticsUpdate);
    }

    qtUpdate = setTimeout(() => {
      changeHandler(localText);
      setKeywords(localText);
    }, 300);

    analyticsUpdate = setTimeout(() => {
      // only send tracking event if there's something other than whitespace in search field
      if (localText && localText.replace(/\s*/, '').length) {
        Analytics.event({
          ...searchFieldAnalyticsObject,
          label: localText,
        });

        // GA4 event
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: 'Keyword Search',
          eventLabel: localText,
        });
      }
    }, 2000);
  };

  const clear = () => {
    setSearchIsEmpty(true);
    setLocalText('');
    changeHandler('');
  };

  const handleInfoTipClick = () => {
    Analytics.event(lastUpdatedInfoTipAnalyticsObject);
    // GA4 event
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'Info Button Click',
      eventLabel: 'Keyword Search',
    });
  };

  useEffect(() => {
    if (!finalDatesNotFound) {
      throttleChange();
    }
  }, [localText, finalDatesNotFound]);

  useEffect(() => {
    if (searchField.current) {
      searchField.current.focus();
    }
  }, []);

  return (
    <>
      <div className={searchInput}>
        <input
          type="text"
          value={localText}
          name="components.search"
          placeholder="Search for Datasets by Keyword..."
          onChange={processInput}
          className={classNames([searchInput_textField, noButton])}
          data-testid="keyword-search"
          ref={searchField}
          aria-label="Enter search terms"
          title="Enter Search Terms"
        />
        <button
          data-testid="search-button"
          className={searchInput_iconButton}
          onClick={clear}
          disabled={searchIsEmpty}
          aria-hidden={searchIsEmpty}
          aria-label={!searchIsEmpty ? 'clear' : ''}
        >
          {searchIsEmpty ? (
            <FontAwesomeIcon icon={faSearch} data-testid="search-icon" />
          ) : (
            <FontAwesomeIcon icon={faTimesCircle} data-testid="clear-search-icon" />
          )}
        </button>
        <InfoTip secondary={true} title={infoIcon.title} clickEvent={handleInfoTipClick}>
          {infoIcon.body}
        </InfoTip>
      </div>
    </>
  );
};

export default SearchField;
