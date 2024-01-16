/* istanbul ignore file */
import React from 'react';
import { section } from '../../../pages/about-us/about-us.module.scss';
import { container } from './contact-section.module.scss';
import { graphql, useStaticQuery } from 'gatsby';
import FDGMdxProvider from '../../../components/mdx/FDGMdxProvider';
import { MDXProvider } from '@mdx-js/react';
import { aboutUsComponents } from '../helpers/helpers';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import ContactForm from './contact-form/contact-form';

const Contact = ({ onUnsupportedSubject = () => {} }) => {
  const contactMDX = useStaticQuery(graphql`
    query {
      mdx(frontmatter: { id: { in: ["contact-section", "subscribe"] } }) {
        body
      }
    }
  `);

  // todo - As of now (3/7/22), Jest does not have a way to test the following
  //  transformations take place. Please unit test if possible.
  const contactComponents = {
    ContactForm: () => <ContactForm onUnsupportedSubject={onUnsupportedSubject} />,
  };

  return (
    <div className={`${section} ${container}`}>
      {contactMDX && contactMDX.mdx && contactMDX.mdx.body && (
        <FDGMdxProvider>
          <MDXProvider components={Object.assign({}, aboutUsComponents, contactComponents)}>
            <MDXRenderer children={contactMDX.mdx.body} />
          </MDXProvider>
        </FDGMdxProvider>
      )}
    </div>
  );
};

export default Contact;
