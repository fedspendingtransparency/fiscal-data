import React, { FunctionComponent, useState } from 'react';
import RedirectModal from '../redirect-modal';
import { primary } from '../redirect-modal.module.scss';

type ExternalLinkProps = {
  url: string;
  children: React.ReactNode;
  onClick?: () => void;
  dataTestId?: string;
  id?: string;
};
const isGovDomain = (href: string) => /\.gov(?:\/|$)/i.test(new URL(href).hostname);
const ExternalLink: FunctionComponent<ExternalLinkProps> = ({ url, children, onClick, dataTestId = 'external-link', id, style }) => {
  const [showModal, setShowModal] = useState(false);
  const flagModalOpen = () => document.body.setAttribute('data-redirect-open', 'true');
  const flagModalClose = () => document.body.removeAttribute('data-redirect-open');
  const openModal = (e: React.SyntheticEvent) => {
    e.preventDefault();
    flagModalOpen();
    setShowModal(true);
  };

  const proceed = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
    onClick?.();
    flagModalClose();
    setShowModal(false);
  };

  if (isGovDomain(url)) {
    return (
      <a href={url} id={id} target="_blank" rel="noopener, noreferrer" data-testid={dataTestId} onClick={onClick} style={style}>
        {children}
      </a>
    );
  }
  // const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
  //   e.stopPropagation();
  //   if (!isGovDomain(url)) {
  //     e.preventDefault();
  //     setShowModal(true);
  //   } else {
  //     onClick?.();
  //   }
  // };

  return (
    <>
      <a className={primary} id={id} href={url} target="_blank" rel="noopener noreferrer" data-testid={dataTestId} onClick={openModal}>
        {children}
      </a>

      <RedirectModal isOpen={showModal} url={url} onClose={() => setShowModal(false)} onProceed={proceed} />
    </>
  );
};

export default ExternalLink;
