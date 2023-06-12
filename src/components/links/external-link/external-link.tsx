import React, { FunctionComponent } from 'react';

type ExternalLinkProps = {
  url: string,
  children: React.ReactNode,
  onClick?: () => void,
  dataTestId?: string,
  id?: string
}

const ExternalLink: FunctionComponent<ExternalLinkProps> = (
  {
    url,
    children,
    onClick ,
    dataTestId = 'external-link',
    id
  },
) => (
  <a
    className="primary"
    href={url}
    target="_blank"
    rel="noreferrer noopener"
    data-testid={dataTestId}
    onClick={() => onClick ? onClick() : null}
    id={id}
  >
    {children}
  </a>
);

export default ExternalLink;
