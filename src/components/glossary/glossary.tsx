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

  useEffect(() => {
    // focus shifts to glossary
    if (activeState) {
      const node = glossaryRef.current;
      if (node) {
        node.focus();
      }
    } else {
      // focus shifts back to the clicked term
      if (glossaryTriggerEl) {
        setTimeout(() => {
          glossaryTriggerEl.focus();
          glossaryTriggerEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setGlossaryTriggerEl(null);
        }, 100);
      }
    }
  }, [activeState]);

  useEffect(() => {
    if (!activeState || !glossaryTriggerEl) return;
    let hasReturnedFocus = false;

    const handleKeyDown = e => {
      if (e.key !== 'Tab' || hasReturnedFocus) return;

      const trayElement = document.querySelector(`.${tray}.${open}`);
      if (!trayElement) return;

      setTimeout(() => {
        if (!trayElement.contains(document.activeElement)) {
          glossaryTriggerEl.focus();
          glossaryTriggerEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          hasReturnedFocus = true;
        }
      }, 0);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeState, glossaryTriggerEl]);

  const toggleState = e => {
    if (!e.key || e.key === 'Enter') {
      setActiveState(!activeState);
      setQueryTerm(null);
    }
  };

  return (
    <div className={`${glossaryContainer} ${activeState ? open : ''}`} data-testid="glossaryContainer">
      <div className={overlay} data-testid="overlay" onClick={toggleState} role="presentation" />
      <div className={`${tray} ${activeState ? open : ''}`}>
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
