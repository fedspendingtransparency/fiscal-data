import CustomLink from '../links/custom-link/custom-link';
import React from 'react';
import GlitchGraphic from '../page-glitch-graphic/page-glitch-graphic';
import { graphicPlacement, headerSubText, textBox, unavailableHeader, pText, logo } from '../page-unavailable/page-unavailable.module.scss';
import { StaticImage } from 'gatsby-plugin-image';
import { withWindowSize } from 'react-fns';

export const Wrapper = ({ children }) => {
  return <div className={textBox}>{children}</div>;
};

const NotFoundGraphicHolder = () => {
  return (
    <div className={graphicPlacement}>
      <GlitchGraphic />
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
    <h1 className={unavailableHeader}>
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
        Our team is working diligently to address the issue. Please check back later or contact us via email at {}
        <CustomLink url={'mailto:fiscaldata@fiscal.treasury.gov?subject=Contact Us'}>fiscaldata@fiscal.treasury.gov</CustomLink>
        {} for further assistance. Thank you!
      </p>
    </>
  );
};

const PageUnavailableText = ({ fallback, width }) => {
  const defaultLogoWidth = 192;
  const defaultLogoHeight = 55;
  const reducedImageSize = 130;

  return (
    <Wrapper>
      <div className={logo} data-testid="logoContainer">
        <StaticImage
          src="../../images/logos/fd-logo.svg"
          loading="eager"
          placeholder="none"
          alt="Fiscal Data logo"
          height={defaultLogoHeight}
          width={defaultLogoWidth}
        />
      </div>
      <Header>Fiscal Data is unavailable right now.</Header>
      {fallback ? <FallbackText /> : <UnavailableText />}
      <NotFoundGraphicHolder />
    </Wrapper>
  );
};

export const UnavailableComponents = {
  h1: Header,
  h2: Header2,
  NotFoundGraphicHolder,
  p: PTag,
  Wrapper,
};
export default withWindowSize(PageUnavailableText);
