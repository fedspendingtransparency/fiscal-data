import React, { FunctionComponent, SyntheticEvent } from 'react';
import { redirectModalState } from '../../modal/redirect-modal/redirect-modal-helper';
import { useSetRecoilState } from 'recoil';

type ExternalLinkProps = {
  url: string;
  children: React.ReactNode;
  onClick?: () => void;
  dataTestId?: string;
  id?: string;
  className?: string;
  style?: React.CSSProperties;
};

const isGovDomain = (href: string): boolean => {
  if (!/^https?:\/\//i.test(href)) return false;
  try {
    return /\.gov(?:\/|$)/i.test(new URL(href).hostname);
  } catch {
    return false;
  }
};
const ExternalLink: FunctionComponent<ExternalLinkProps> = ({ url, children, onClick, dataTestId = 'external-link', id, className, style }) => {
  const setModal = useSetRecoilState(redirectModalState);

  const openModal = (e: SyntheticEvent) => {
    e.preventDefault();
    onClick?.();
    setModal({
      open: true,
      url,
      after: () => {
        window.open(url, '_blank', 'noreferrer, noopener');
      },
    });
  };

  if (isGovDomain(url)) {
    return (
      <a
        href={url}
        id={id}
        target="_blank"
        rel="noreferrer noopener"
        data-testid={dataTestId}
        onClick={onClick}
        style={style}
        className={className ? className : 'primary'}
      >
        {children}
      </a>
    );
  }

  return (
    <>
      <a
        href={url}
        id={id}
        target="_blank"
        rel="noreferrer noopener"
        data-testid={dataTestId}
        className={className ? className : 'primary'}
        style={style}
        onClick={openModal}
      >
        {children}
      </a>
    </>
  );
};

export default ExternalLink;
