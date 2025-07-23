/* istanbul ignore file */
import React, { useEffect, useState } from 'react';
import '../../../styles.scss';
import { noBullets, section } from '../../../pages/about-us/about-us.module.scss';
import GLOBALS from '../../../helpers/constants';

const FAQ = ({ triggerHighlight = 0 }) => {
  // const faqMDX = useStaticQuery(graphql`
  //   query {
  //     mdx(frontmatter: { id: { eq: "faq" } }) {
  //       body
  //     }
  //   }
  // `);

  const highlightTime = GLOBALS.config.highlight.defaultTimeToHighlight;
  const [highlight, setHighlight] = useState(false);

  const highlightWhoCanIContactText = () => {
    if (highlight) return;
    setHighlight(true);

    setTimeout(() => {
      setHighlight(false);
    }, highlightTime);
  };

  useEffect(() => {
    if (triggerHighlight === 0) return;
    highlightWhoCanIContactText();
  }, [triggerHighlight]);

  return (
    <div className={`${section} ${noBullets}`}>
      {/*{faqMDX && faqMDX.mdx && faqMDX.mdx.body && (*/}
      {/*  <FDGMdxProvider>*/}
      {/*    <MDXProvider components={aboutUsComponents}>*/}
      {/*      <MDXRenderer children={faqMDX.mdx.body} />*/}
      {/*    </MDXProvider>*/}
      {/*  </FDGMdxProvider>*/}
      {/*)}*/}
    </div>
  );
};

export default FAQ;
