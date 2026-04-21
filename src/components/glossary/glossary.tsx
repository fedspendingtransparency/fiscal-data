import React, { FunctionComponent, useContext, useEffect, useRef, useState } from 'react';
import { glossaryContainer, glossaryHeaderContainer, open, overlay, tray } from './glossary.module.scss';
import GlossaryHeader from './glossary-header/glossary-header';
import GlossaryListContainer from './glossary-list/glossary-list-container';
import { getSortedGlossaryList } from '../../helpers/glossary-helper/glossary-data';
import { IGlossaryTerm } from '../../models/IGlossaryTerm';
import { removeAddressPathQuery } from '../../helpers/address-bar/address-bar';
import { GlossaryContext } from './glossary-context/glossary-context';

interface IGlossary {
  termList: IGlossaryTerm[];
  activeState: boolean;
  setActiveState: (boolean) => void;
}

const getQueryTerm = (termList): IGlossaryTerm => {
  if (typeof window !== 'undefined') {
    const queryParameters = new URLSearchParams(window.location.search);
    const termSlug = queryParameters.get('glossary');
    if (termSlug) {
      return termList.find((element: IGlossaryTerm) => {
        if (termSlug !== null) {
          return element.slug === termSlug;
        }
        return null;
      });
    }
  }
};

const Glossary: FunctionComponent<IGlossary> = ({ termList, activeState, setActiveState }) => {
  const [filter, setFilter] = useState('');

  const sortedTermList = getSortedGlossaryList(termList);
  const [queryTerm, setQueryTerm] = useState(getQueryTerm(termList));
  const [initialQuery, setInitialQuery] = useState(false);
  const [tabReset, setTabReset] = useState(false);
  const glossaryRef = useRef<HTMLDivElement>(null);
  const { glossaryClickEvent, setGlossaryClickEvent, glossaryTriggerEl, setGlossaryTriggerEl } = useContext(GlossaryContext);

  useEffect(() => {
    if (!initialQuery) {
      setInitialQuery(true);
      setActiveState(queryTerm !== null && queryTerm !== undefined);
      removeAddressPathQuery(window.location);
    }
  });

  useEffect(() => {
    if (glossaryClickEvent) {
      const term = getQueryTerm(termList);
      if (term) {
        setQueryTerm(term);
        setTimeout(() => {
          setActiveState(true);
          setGlossaryClickEvent(false);
          removeAddressPathQuery(window.location);
        });
      }
    }
  }, [glossaryClickEvent]);

  // handles focus between glossary term/overlay when overlay is opened/closed
  useEffect(() => {
    if (activeState) {
      const node = glossaryRef.current;
      if (node) {
        node.focus();
      }
    } else {
      // focus shifts back to the last clicked term when active state changes to false
      if (glossaryTriggerEl) {
        glossaryTriggerEl.focus();
      }
    }
  }, [activeState]);

  const toggleState = e => {
    if (!e.key || e.key === 'Enter') {
      setActiveState(!activeState);
      setQueryTerm(null);
    }
  };

  // function to restore view to last clicked term (when user tabs through the overlay)
  const handleOverlayTab = e => {
    if (e.key !== 'Tab') return;
    const focusableElements = e.currentTarget.querySelectorAll('button, a[href], input, textarea, select');
    const lastElement = focusableElements[focusableElements.length - 1];
    if (!e.shiftKey && document.activeElement === lastElement) {
      // prevents focus from jumping outside (top of page where glossary component is imported)
      e.preventDefault();
      if (glossaryTriggerEl) {
        glossaryTriggerEl.focus();
      } else {
        const firstElement = focusableElements[0];
        if (firstElement) {
          firstElement.focus();
        }
      }
    }
  };

  return (
    <div className={`${glossaryContainer} ${activeState ? open : ''}`} data-testid="glossaryContainer">
      <div className={overlay} data-testid="overlay" onClick={toggleState} role="presentation" />
      <div className={`${tray} ${activeState ? open : ''}`} onKeyDown={handleOverlayTab} data-testid="glossary-tray">
        {activeState && (
          <>
            <div className={glossaryHeaderContainer}>
              <GlossaryHeader
                clickHandler={toggleState}
                filter={filter}
                filterHandler={setFilter}
                glossaryRef={glossaryRef}
                tabReset={tabReset}
                setTabReset={setTabReset}
              />
            </div>
            <GlossaryListContainer
              sortedTermList={sortedTermList}
              filter={filter}
              filterHandler={setFilter}
              defaultTerm={queryTerm ? queryTerm : null}
              setTabReset={setTabReset}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Glossary;
