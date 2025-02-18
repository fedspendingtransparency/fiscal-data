import React, { FunctionComponent, useEffect, useRef, useState } from 'react';

import { container, item, border } from './download-dialog.module.scss';

export const DownloadDialog: FunctionComponent = ({ active, setActive }) => {
  const containerRef = useRef(null);
  const [inFocus, setInFocus] = useState(false);

  useEffect(() => {
    if (!inFocus) {
      setActive(false);
    }
  }, [inFocus]);

  return (
    <>
      {active ? (
        <div
          className={container}
          role="presentation"
          ref={containerRef}
          onFocus={() => setInFocus(true)}
          onBlur={e => {
            if (!e.relatedTarget.className.includes('download-dialog')) {
              setInFocus(false);
            }
          }}
        >
          <div className={item} role={'button'} tabIndex={0}>
            <span>CSV</span>
            <span>84 KB</span>
          </div>
          <div className={item} role={'button'} tabIndex={0}>
            <span>JSON</span>
            <span>84 KB</span>
          </div>
          <div className={item} role={'button'} tabIndex={0}>
            <span>XML</span>
            <span>84 KB</span>
          </div>
          <div className={border} />
          <div className={item} role={'button'} tabIndex={0}>
            <span>Data Dictionary</span>
            <span>24 KB</span>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};
