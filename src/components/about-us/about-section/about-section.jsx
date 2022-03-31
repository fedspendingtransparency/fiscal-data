import React from 'react';
import {graphql, useStaticQuery} from 'gatsby';
import '../../../styles.scss';
import * as styles from '../../../pages/about-us/about-us.module.scss';
import {MDXRenderer} from "gatsby-plugin-mdx";
import FDGMdxProvider from "../../../components/mdx/FDGMdxProvider";
import { MDXProvider } from "@mdx-js/react";
import {aboutUsComponents} from "../helpers/helpers";

const AboutUs = () => {
  const aboutSection = useStaticQuery(graphql`
    query {
      mdx(frontmatter: {id: {eq: "about-section"}}) {
        body
      }
    }
  `);

  return (
    <>
      {aboutSection && aboutSection.mdx && aboutSection.mdx.body &&
        <section className={styles.section}>
          <FDGMdxProvider>
            <MDXProvider components={aboutUsComponents}>
              <MDXRenderer children={aboutSection.mdx.body}/>
            </MDXProvider>
          </FDGMdxProvider>
        </section>
      }
    </>
  );

};

export default AboutUs;
