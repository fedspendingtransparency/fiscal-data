import React from 'react';
import { redirectModalState } from './../redirect-modal-helper';
import { useSetRecoilState } from 'recoil';

const isGovDomain = (href: string) => /\.gov(?:\/|$)/i.test(new URL(href).hostname);

const ExternalLink: React.FC<{
  url: string;
  children: React.ReactNode;
  onClick?: () => void;
  'data-testid'?: string;
  id?: string;
}> = ({ url, children, onClick, ...rest }) => {
  const setModal = useSetRecoilState(redirectModalState);

  const handleClick = e => {
    if (isGovDomain(url)) return;

    e.preventDefault();
    setModal({
      open: true,
      url,
      after: () => {
        window.open(url, '_blank', 'noopener, noreferrer');
        onClick?.();
      },
    });
  };

  return (
    <a className="primary" {...rest} href={url} target="_blank" rel="noopener noreferrer" onClick={handleClick}>
      {children}
    </a>
  );
};

export default ExternalLink;
