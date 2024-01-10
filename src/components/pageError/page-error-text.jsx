import React from 'react';
import { notFoundHeader, headerSubText, graphicPlacement, pText, linkList, textBox } from './page-error.module.scss';
import NotFoundGraphic from './page-error-graphic';
import CustomLink from '../links/custom-link/custom-link';

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

const UlTag = ({ children }) => {
  return <ul className={linkList}>{children}</ul>;
};

export const Wrapper = ({ children }) => {
  return <div className={textBox}>{children}</div>;
};

const NotFoundText = () => {
  return (
    <>
      <Header>Oops... there's been a glitch in the data.</Header>
      <Header2>404: Page not found</Header2>
      <p className={pText}>
        We're sorry, we can't seem to find that page. This may be due to a broken link or a typo in the URL. Try retyping the URL or checking out some
        of these pages instead:
      </p>
      <UlTag>
        <li>
          <CustomLink url="/datasets/" external>
            Dataset Search
          </CustomLink>
        </li>
        <li>
          <CustomLink url="/" external>
            Homepage
          </CustomLink>
        </li>
        <li>
          <CustomLink url="/api-documentation/" external>
            API Documentation
          </CustomLink>
        </li>
      </UlTag>
      <PTag>
        Want to get in touch or send in general comments about the site? Contact us via email at{' '}
        <CustomLink url="mailto:fiscaldata@fiscal.treasury.gov?subject=Contact Us">fiscaldata@fiscal.treasury.gov</CustomLink>
        {' '}for further assistance. Thank you!
      </PTag>
      <NotFoundGraphicHolder />
    </>
  );
};

const FallbackText = () => {
  return (
    <>
      <Header>This content is currently unavailable.</Header>
      <Header2>We will be back shortly.</Header2>
      <PTag className={pText}>
        Our team is working diligently to address the issue. Please check back later or contact us
        via email at{' '}<CustomLink url="mailto:fiscaldata@fiscal.treasury.gov">fiscaldata@fiscal.treasury.gov</CustomLink>{' '}for further assistance. 
        Thank you! 
      </PTag>
      <NotFoundGraphicHolder />
    </>
  );
};



const PageErrorText = ({ fallback }) => (
  <Wrapper>
    {fallback ? <FallbackText /> : <NotFoundText />}
  </Wrapper>
);

export const NFComponents = {
  h1: Header,
  h2: Header2,
  NotFoundGraphicHolder,
  p: PTag,
  ul: UlTag,
  Wrapper,
};

export default PageErrorText;
