import React from "react";
import * as styles from "./page-error.module.scss";
import NotFoundGraphic from './page-error-graphic';
import CustomLink from "../links/custom-link/custom-link";

const Header = ({children}) => {
  return (
    <h1 className={styles.notFoundHeader}>
      <span>{children}</span>
    </h1>
  );
}

const Header2 = ({children}) => {
  return <h2><span className={styles.headerSubText}>{children}</span></h2>
}

const NotFoundGraphicHolder = () => {
  return (
    <div className={styles.graphicPlacement}>
      <NotFoundGraphic />
    </div>
  );
}

const PTag = ({children}) => {
  return <p className={styles.pText}>{children}</p>
}

const UlTag = ({children}) => {
  return <ul className={styles.linkList}>{children}</ul>
};

export const Wrapper = ({children}) => {
  return <div className={styles.textBox}>{children}</div>
};

const NotFoundText = () => {
  return (
    <>
    <Header2>404: Page not found</Header2>
        <p className={styles.pText}>
          We're sorry, we can't seem to find that page. This may be due to a broken link or a typo in
          the URL. Try retyping the URL or checking out some of these pages instead:
        </p>
        <UlTag>
          <li>
            <CustomLink url="/datasets/" external>Dataset Search</CustomLink>
          </li>
          <li>
            <CustomLink url="/" external>Homepage</CustomLink>
          </li>
          <li>
            <CustomLink url="/api-documentation/" external>API Documentation</CustomLink>
          </li>
        </UlTag>
    </>
  );
}

const FallbackText = () => {

  return (
    <>
      <Header2>This content is currently unavailable.</Header2>
        <p className={styles.pText}>
        Something didn't go quite right on our end while loading this page. 
        Try refreshing the page or check back in a bit as we work to resolve the issue.
        </p>
    </>
  );
}

const PageErrorText = ({fallback}) => (
  <Wrapper>
      <Header>Oops... there's been a glitch in the data.</Header>
      {fallback ? <FallbackText /> : <NotFoundText />}
      <PTag>
        Want to get in touch or send in general comments about the site?
        Send a message {' '}
        <CustomLink url="mailto:fiscaldata@fiscal.treasury.gov?subject=Contact Us">
          via email
        </CustomLink>, and our team will respond at our earliest opportunity.
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
  Wrapper
}

export default PageErrorText;
