import React from "react";
import * as styles from "./notFound.module.scss";
import NotFoundGraphic from './notFoundGraphic';
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

const NotFoundText = () => (
  <Wrapper>
    <Header>Oops... there's been a glitch in the data.</Header>
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

export default NotFoundText;
