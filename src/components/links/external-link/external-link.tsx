import React, { FunctionComponent } from 'react';
import { faExternalLink } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type ExternalLinkProps = {
  url: string;
  children: React.ReactNode;
  onClick?: () => void;
  dataTestId?: string;
  externalIcon?: boolean;
};

const ExternalLink: FunctionComponent<ExternalLinkProps> = ({ url, children, onClick, dataTestId = 'external-link', externalIcon }) => (
  <>
    {externalIcon ? (
      <div style={{ display: 'inline-flex', marginBottom: '.5' }}>
        <FontAwesomeIcon icon={faExternalLink} style={{ marginRight: '.5rem', color: '#0071bc', paddingTop: '.25rem' }} />
        <a
          className="primary"
          href={url}
          target="_blank"
          rel="noreferrer noopener"
          data-testid={dataTestId}
          onClick={() => (onClick ? onClick() : null)}
        >
          {children}
        </a>
      </div>
    ) : (
      <a
        className="primary"
        href={url}
        target="_blank"
        rel="noreferrer noopener"
        data-testid={dataTestId}
        onClick={() => (onClick ? onClick() : null)}
      >
        {children}
      </a>
    )}
  </>
);

export default ExternalLink;
