import CustomLink from '../links/custom-link/custom-link';
import React from 'react';
import NotFoundGraphic from '../pageError/page-error-graphic';
import { graphicPlacement, headerSubText, notFoundHeader, pText, textBox } from '../pageError/page-error.module.scss';

export const Wrapper = ({ children }) => {
  return <div className={textBox}>{children}</div>;
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

const UnavailableText = () => {
  return (
    <>
      <Header2>We will be back shortly.</Header2>
      <p className={pText}>
        Our team is working diligently to address the issue. Please check back later or contact us via email at
        <CustomLink url={'mailto:fiscaldata@fiscal.treasury.gov?subject=Contact Us'}>fiscaldata@fiscal.treasury.gov</CustomLink>
        for further assistance. Thank you!
      </p>
    </>
  );
};

const PageUnavailableText = ({ fallback }) => (
  <Wrapper>
    <Header>Fiscal Data is unavailable right now.</Header>
    {fallback ? <FallbackText /> : <UnavailableText />}
    {/*<PTag>*/}
    {/*  Want to get in touch or send in general comments about the site? Contact us via email at{' '}*/}
    {/*  <CustomLink url="mailto:fiscaldata@fiscal.treasury.gov?subject=Contact Us">fiscaldata@fiscal.treasury.gov</CustomLink> for further assistance.*/}
    {/*  Thank you!*/}
    {/*</PTag>*/}
    <NotFoundGraphicHolder />
  </Wrapper>
);

export const UnavailableComponents = {
  h1: Header,
  h2: Header2,
  NotFoundGraphicHolder,
  p: PTag,
  Wrapper,
};
export default PageUnavailableText;