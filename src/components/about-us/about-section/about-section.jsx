/* istanbul ignore file */
import React from 'react';
import '../../../styles.scss';
import { section } from '../../../pages/about-us/about-us.module.scss';

const AboutUs = () => {
  // const aboutSection = useStaticQuery(graphql`
  //   query {
  //     mdx(frontmatter: { id: { eq: "about-section" } }) {
  //       body
  //     }
  //   }
  // `);

  return (
    <>
      {aboutSection && aboutSection.mdx && aboutSection.mdx.body && (
        <section className={section}>
          {/*<FDGMdxProvider>*/}
          {/*  <MDXProvider components={aboutUsComponents}>*/}
          {/*    <MDXRenderer children={aboutSection.mdx.body} />*/}
          {/*  </MDXProvider>*/}
          {/*</FDGMdxProvider>*/}
        </section>
      )}
    </>
  );
};

export default AboutUs;
