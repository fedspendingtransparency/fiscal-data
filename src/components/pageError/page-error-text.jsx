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

const PageErrorText = ({ fallback }) => (
  <Wrapper>
    <Header>Oops... there's been a glitch in the data.</Header>
    {fallback ? <FallbackText /> : <NotFoundText />}
    <PTag>
      Want to get in touch or send in general comments about the site? Contact us via email at{' '}
      <CustomLink url="mailto:fiscaldata@fiscal.treasury.gov?subject=Contact Us">fiscaldata@fiscal.treasury.gov</CustomLink> for further assistance. Thank you!
    </PTag>
    <NotFoundGraphicHolder />
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
