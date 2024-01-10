import React from 'react';
import { notFoundHeader, headerSubText, graphicPlacement, pText, textBox } from '../page-error.module.scss';
import NotFoundGraphic from '../page-error-graphic';
import CustomLink from '../../links/custom-link/custom-link';

const Header = ({ children }) => {
  return (
    <h1 className={notFoundHeader}>
      <span>{children}</span>
    </h1>
  );
};

const Header2 = ({ children }) => {
  return (
    <h2>
      <span className={headerSubText}>{children}</span>
    </h2>
  );
};

const NotFoundGraphicHolder = () => {
  return (
    <div className={graphicPlacement}>
      <NotFoundGraphic />
    </div>
  );
};

const PTag = ({ children }) => {
  return <p className={pText}>{children}</p>;
};

export const Wrapper = ({ children }) => {
  return <div className={textBox}>{children}</div>;
};

const NotFoundText = () => {
  return (
    <>
      <Header2>We will be back shortly.</Header2>

    </>
  );
};

const FallbackText = () => {
  return (
    <>
      <Header2>This content is currently unavailable.</Header2>
      <p className={pText}>
        Something didn't go quite right on our end while loading this page. Try refreshing the page or check back in a bit as we work to resolve the
        issue.
      </p>
    </>
  );
};

const SiteOutage = ({ fallback }) => (
  <Wrapper>
    <Header>Fiscal Data is unavailable right now. </Header>
    {fallback ? <FallbackText /> : <NotFoundText />}
      <PTag className={pText}>
        Our team is working diligently to address the issue. Please check back later or contact us
        via email at{' '}<CustomLink url="mailto:fiscaldata@fiscal.treasury.gov">fiscaldata@fiscal.treasury.gov</CustomLink>{' '}for further assistance. 
        Thank you! 
      </PTag>
    <NotFoundGraphicHolder />
  </Wrapper>
);

export const NFComponents = {
  h1: Header,
  h2: Header2,
  NotFoundGraphicHolder,
  p: PTag,
  Wrapper,
};

export default SiteOutage;
